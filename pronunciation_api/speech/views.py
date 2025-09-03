import imghdr
import json
import mimetypes
import os
import subprocess
import tempfile
from datetime import timedelta

import redis
import whisper
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomUser, Language, Letter, Level, Profile, Quiz, Skill
from .serializers import ProfileSerializer, UserSerializer
from .tasks import send_verification_email

r = redis.StrictRedis.from_url(settings.CACHES["default"]["LOCATION"])

MAX_ATTEMPTS = 3


User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        # Validate inputs
        if not username or not email or not password:
            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing_user = get_user_model().objects.filter(email=email).first()
        if existing_user:
            if existing_user.is_active:
                return Response(
                    {"error": "Email already exists and is active."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                existing_user.username = username
                existing_user.set_password(password)
                verification_code = get_random_string(
                    length=8, allowed_chars="0123456789"
                )
                existing_user.verification_code = verification_code
                existing_user.is_active = False  # remain inactive until verified
                try:
                    existing_user.save()
                except IntegrityError as e:
                    return Response(
                        {
                            "error": f"An error occurred while updating the account: {e}."
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                # Send verification email for updated account.
                send_verification_email.delay(email, verification_code)
                return Response(
                    {
                        "message": "Registration successful. Please check your email for verification."
                    },
                    status=status.HTTP_201_CREATED,
                )
        else:
            # Create a new user if the email is not found at all.
            try:
                user = User(username=username, email=email)
                user.set_password(password)
                verification_code = get_random_string(
                    length=8, allowed_chars="0123456789"
                )
                user.verification_code = verification_code
                user.is_active = False
                user.save()
            except IntegrityError as e:
                if "duplicate key value violates unique constraint" in str(e):
                    return Response(
                        {"error": "A user with this email already exists."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                return Response(
                    {"error": "An error occurred while creating the account."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            send_verification_email.delay(email, verification_code)
            return Response(
                {
                    "message": "Registration successful. Please check your email for verification."
                },
                status=status.HTTP_201_CREATED,
            )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        username = request.data.get("username")
        verification_code = request.data.get("verification_code")

        if not email or not verification_code:
            return Response(
                {"error": "Email and verification code are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attempt_key = f"failed_attempts:{email}:{username}"
        failed_attempts = r.get(attempt_key)
        last_failed_time_key = f"last_failed_time:{email}:{username}"

        if failed_attempts and int(failed_attempts) >= MAX_ATTEMPTS:
            new_verification_code = get_random_string(
                length=8, allowed_chars="0123456789"
            )
            user = (
                get_user_model().objects.filter(email=email, username=username).first()
            )
            if user:
                user.verification_code = new_verification_code
                user.save()
                send_verification_email.delay(email, verification_code)
            time_left = timedelta(seconds=int(r.ttl(attempt_key)))
            return Response(
                {
                    "error": f"Too many failed attempts. Please try again in {time_left}."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = get_user_model().objects.filter(email=email, username=username)

        if users.count() > 1:
            return Response(
                {"error": "Multiple users found with this email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if users.exists():
            user = users.first()

            if user.verification_code != verification_code:
                r.incr(attempt_key)

                r.expire(attempt_key, 3600)

                r.set(last_failed_time_key, timezone.now().timestamp())

                return Response(
                    {"error": "Invalid verification code."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            r.delete(attempt_key)
            r.delete(last_failed_time_key)

            user.is_active = True
            user.save()

            try:
                Profile.objects.get(user=user)
            except ObjectDoesNotExist:
                Profile.objects.create(user=user)

            return Response(
                {"message": "Email verified successfully. You can now log in."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# User Login
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({"token": token.key}, status=status.HTTP_200_OK)


# User Profile API


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = Profile.objects.filter(user=user).first()

        return Response(
            {
                "user": UserSerializer(user).data,
                "profile": (
                    ProfileSerializer(profile, context={"request": request}).data
                    if profile
                    else {}
                ),
            },
            status=status.HTTP_200_OK,
        )


class PublicUserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username, *args, **kwargs):
        user = get_object_or_404(User, username=username)
        profile = Profile.objects.filter(user=user).first()

        return Response(
            {
                "user": UserSerializer(user).data,
                "profile": (
                    ProfileSerializer(profile, context={"request": request}).data
                    if profile
                    else {}
                ),
            },
            status=status.HTTP_200_OK,
        )


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.bio = request.data.get("bio", profile.bio)
        profile.country = request.data.get("country", profile.country)

        if "profile_picture" in request.FILES:
            image_file = request.FILES["profile_picture"]
            image_type = imghdr.what(image_file)

            if image_type not in ["jpeg", "png", "gif", "bmp", "tiff", "webp"]:
                return Response({"error": "Only image files are allowed."}, status=400)

            profile.profile_picture = image_file

        profile.save()

        return Response(
            {
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                },
                "profile": ProfileSerializer(profile).data,
            }
        )


# Logout
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response(
                {"message": "Successfully logged out."}, status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"error": "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST
            )


# Password Reset
class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return JsonResponse(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return JsonResponse(
                {"error": "User with this email does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(str(user.pk).encode("utf-8"))

        reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"

        send_mail(
            "Password Reset Request",
            f"To reset your password, please click the following link: {reset_url}",
            "from@example.com",
            [user.email],
            fail_silently=False,
        )

        return JsonResponse(
            {"message": "Password reset email sent successfully."},
            status=status.HTTP_200_OK,
        )


# Password Reset Confirm
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode("utf-8")
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return JsonResponse(
                {"error": "Invalid token or user."}, status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return JsonResponse(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_password = request.data.get("password")
        if not new_password:
            return JsonResponse(
                {"error": "Password is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        return JsonResponse(
            {"message": "Password reset successfully."}, status=status.HTTP_200_OK
        )


# levels
def load_json(relative_path):
    full_path = os.path.join(settings.BASE_DIR, relative_path)
    with open(full_path, encoding="utf-8") as f:
        return json.load(f)


def ar_letters(request):
    return JsonResponse(load_json("json/ar/letters.json"), safe=False)


def ar_levels(request):
    return JsonResponse(load_json("json/ar/levels.json"), safe=False)


def en_letters(request):
    return JsonResponse(load_json("json/en/letters.json"), safe=False)


def en_levels(request):
    return JsonResponse(load_json("json/en/levels.json"), safe=False)


# ai

MODEL_DIR = "models"
MODEL_SIZE = "tiny"

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

_model = None


def get_model():
    global _model
    if _model is None:
        _model = whisper.load_model(MODEL_SIZE, download_root=MODEL_DIR)
    return _model


def calculate_pronunciation_similarity_ai(target_word, reference, target_char):
    """
    AI-enhanced pronunciation similarity calculation using advanced text analysis.

    Args:
        target_word (str): The word the user should pronounce
        reference (str): The transcribed text from user's audio
        target_char (str): The specific character to focus on

    Returns:
        dict: Contains AI-enhanced test results with detailed analysis
    """
    import re
    from difflib import SequenceMatcher

    # Normalize texts for better comparison
    def normalize_text(text):
        """Normalize Arabic text for better comparison"""
        # Remove extra spaces and normalize
        text = re.sub(r"\s+", " ", text.strip())
        # Normalize Arabic characters (optional: handle different forms)
        return text

    target_word_norm = normalize_text(target_word)
    reference_norm = normalize_text(reference)

    # AI-Enhanced Similarity Metrics

    # 1. Sequence Similarity (using difflib)
    sequence_similarity = SequenceMatcher(
        None, target_word_norm, reference_norm
    ).ratio()

    # 2. Character-by-Character Analysis with Position Weighting
    def calculate_position_weighted_similarity():
        """Calculate similarity with position-based weighting"""
        max_len = max(len(target_word_norm), len(reference_norm))
        if max_len == 0:
            return 0, 0

        total_score = 0
        char_matches = 0

        for i in range(max_len):
            target_char_at_pos = (
                target_word_norm[i] if i < len(target_word_norm) else ""
            )
            ref_char_at_pos = reference_norm[i] if i < len(reference_norm) else ""

            # Position weight: beginning and end are more important but not excessive
            if i == 0 or i == max_len - 1:
                position_weight = 1.2  # Beginning and end get slightly higher weight
            else:
                position_weight = 1.0

            if target_char_at_pos == ref_char_at_pos:
                char_matches += 1
                total_score += position_weight
            elif target_char_at_pos and ref_char_at_pos:
                # Partial credit for similar characters
                if target_char_at_pos in "أإآا" and ref_char_at_pos in "أإآا":
                    total_score += 0.8 * position_weight
                elif target_char_at_pos in "يى" and ref_char_at_pos in "يى":
                    total_score += 0.8 * position_weight
                elif target_char_at_pos in "وؤ" and ref_char_at_pos in "وؤ":
                    total_score += 0.8 * position_weight
                elif target_char_at_pos in "هة" and ref_char_at_pos in "هة":
                    total_score += 0.8 * position_weight

        # Normalize the position weighted score to prevent exceeding 100%
        position_weighted_score = (total_score / max_len) * 100
        char_match_score = (char_matches / max_len) * 100

        return min(position_weighted_score, 100), min(char_match_score, 100)

    # 3. Target Character Analysis
    def analyze_target_character():
        """AI-enhanced analysis of target character pronunciation"""
        target_positions = [
            i for i, char in enumerate(target_word_norm) if char == target_char
        ]
        ref_positions = [
            i for i, char in enumerate(reference_norm) if char == target_char
        ]

        if not target_positions:
            return {
                "found_in_target": False,
                "found_in_reference": False,
                "position_accuracy": 0,
                "character_score": 0,
            }

        # Calculate position accuracy
        correct_positions = 0
        for target_pos in target_positions:
            if (
                target_pos < len(reference_norm)
                and reference_norm[target_pos] == target_char
            ):
                correct_positions += 1

        position_accuracy = (correct_positions / len(target_positions)) * 100

        # Character-specific scoring
        char_score = 0
        if ref_positions:
            # Bonus for correct character count (capped at 30)
            char_count_ratio = min(len(ref_positions), len(target_positions)) / max(
                len(ref_positions), len(target_positions)
            )
            char_score += char_count_ratio * 30

            # Bonus for position accuracy (capped at 70)
            char_score += min(position_accuracy * 0.7, 70)

        # Cap the character score at 100
        char_score = min(char_score, 100)

        return {
            "found_in_target": True,
            "found_in_reference": len(ref_positions) > 0,
            "position_accuracy": position_accuracy,
            "character_score": char_score,
        }

    # 4. Phonetic Similarity (for Arabic)
    def calculate_phonetic_similarity():
        """Calculate phonetic similarity for Arabic text"""
        # Arabic phonetic groups
        phonetic_groups = {
            "أإآا": ["أ", "إ", "آ", "ا"],
            "يى": ["ي", "ى"],
            "وؤ": ["و", "ؤ"],
            "هة": ["ه", "ة"],
            "ثس": ["ث", "س"],
            "حه": ["ح", "ه"],
            "ضظ": ["ض", "ظ"],
            "طت": ["ط", "ت"],
            "صس": ["ص", "س"],
            "قك": ["ق", "ك"],
            "غخ": ["غ", "خ"],
        }

        phonetic_score = 0
        total_chars = 0

        for i in range(min(len(target_word_norm), len(reference_norm))):
            target_char = target_word_norm[i]
            ref_char = reference_norm[i]

            if target_char == ref_char:
                phonetic_score += 1
            else:
                # Check phonetic similarity
                for group in phonetic_groups.values():
                    if target_char in group and ref_char in group:
                        phonetic_score += 0.7
                        break

            total_chars += 1

        return (phonetic_score / total_chars) * 100 if total_chars > 0 else 0

    # Calculate all metrics
    position_weighted_score, char_match_score = calculate_position_weighted_similarity()
    target_char_analysis = analyze_target_character()
    phonetic_score = calculate_phonetic_similarity()

    # AI-Enhanced Final Score Calculation
    def calculate_ai_final_score():
        """Calculate final score using weighted combination of all metrics"""
        weights = {
            "sequence": 0.25,
            "position_weighted": 0.30,
            "char_match": 0.20,
            "target_char": 0.15,
            "phonetic": 0.10,
        }

        # Normalize scores to prevent exceeding 100%
        normalized_position_score = min(position_weighted_score, 100)
        normalized_char_match_score = min(char_match_score, 100)
        normalized_target_char_score = min(target_char_analysis["character_score"], 100)
        normalized_phonetic_score = min(phonetic_score, 100)

        final_score = (
            sequence_similarity * 100 * weights["sequence"]
            + normalized_position_score * weights["position_weighted"]
            + normalized_char_match_score * weights["char_match"]
            + normalized_target_char_score * weights["target_char"]
            + normalized_phonetic_score * weights["phonetic"]
        )

        # Cap the final score at 100%
        return min(round(final_score, 2), 100.0)

    final_score = calculate_ai_final_score()

    # AI-Enhanced Decision Making
    def make_ai_decision():
        """Make intelligent decision based on multiple factors"""
        # Base decision on final score
        if final_score >= 85:
            return True, "مبارك! لقد لفظت الكلمة بشكل ممتاز"
        elif final_score >= 70:
            return True, "مبارك! لقد اجتزت الاختبار بنجاح"
        elif final_score >= 50:
            return False, "أداؤك جيد، لكن حاول تحسين نطق الحرف المستهدف"
        else:
            return (
                False,
                "لقد نطقت معظم الأحرف بشكل خاطئ، استمع للصوت المسجل وحاول مرة أخرى",
            )

    test_passed, message = make_ai_decision()

    # Special case: if target character is completely missing
    if not target_char_analysis["found_in_target"]:
        test_passed = False
        message = "الحرف المستهدف غير موجود في الكلمة المرجعية"
    elif (
        target_char_analysis["found_in_target"]
        and not target_char_analysis["found_in_reference"]
    ):
        test_passed = False
        message = "لم تنطق الحرف المستهدف بشكل صحيح"

    return {
        "test_passed": test_passed,
        "message": message,
        "similarity_percentage": final_score,
        "ai_analysis": {
            "sequence_similarity": round(sequence_similarity * 100, 2),
            "position_weighted_score": round(position_weighted_score, 2),
            "character_match_score": round(char_match_score, 2),
            "target_character_analysis": target_char_analysis,
            "phonetic_similarity": round(phonetic_score, 2),
            "final_ai_score": final_score,
        },
        "detailed_feedback": {
            "overall_performance": (
                "ممتاز"
                if final_score >= 85
                else (
                    "جيد"
                    if final_score >= 70
                    else "يحتاج تحسين" if final_score >= 50 else "يحتاج ممارسة أكثر"
                )
            ),
            "target_character_performance": (
                "ممتاز"
                if target_char_analysis["position_accuracy"] >= 90
                else (
                    "جيد"
                    if target_char_analysis["position_accuracy"] >= 70
                    else "يحتاج تحسين"
                )
            ),
            "suggestions": [
                (
                    "ركز على نطق الحرف المستهدف بوضوح"
                    if target_char_analysis["position_accuracy"] < 70
                    else ""
                ),
                "حاول نطق الكلمة ببطء أكثر" if final_score < 60 else "",
                "استمع للصوت المرجعي عدة مرات" if final_score < 50 else "",
            ],
        },
    }


@csrf_exempt
def transcribe(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    if "audio" not in request.FILES:
        return JsonResponse({"error": "No audio file provided"}, status=400)

    audio_file = request.FILES.get("audio")

    # Get extension from filename or fallback from MIME type
    ext = os.path.splitext(audio_file.name)[-1]
    if not ext:
        ext = mimetypes.guess_extension(audio_file.content_type) or ".ogg"

    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as temp_in:
        for chunk in audio_file.chunks():
            temp_in.write(chunk)
        temp_in.flush()

    fixed_wav = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    try:
        proc = subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                temp_in.name,
                "-ar",
                "16000",
                "-ac",
                "1",
                "-c:a",
                "pcm_s16le",
                fixed_wav,
            ],
            capture_output=True,
            text=True,
        )
        if proc.returncode != 0:
            return JsonResponse({"error": f"ffmpeg failed: {proc.stderr}"}, status=500)

        model = get_model()
        result = model.transcribe(fixed_wav, language="ar", fp16=False)
        reference = result["text"]

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        os.remove(temp_in.name)
        os.remove(fixed_wav)

    # Get target word and character
    if request.content_type == "application/json":
        try:
            data = json.loads(request.body)
            target_word = data.get("target_word")
            target_char = data.get("target_char")
        except Exception:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    else:
        target_word = request.POST.get("target_word")
        target_char = request.POST.get("target_char")

    if not target_word:
        return JsonResponse({"error": "No target_word provided"}, status=400)
    if not target_char or len(target_char) != 1:
        return JsonResponse({"error": "target_char must be one character"}, status=400)

    # Use the extracted similarity calculation function
    similarity_result = calculate_pronunciation_similarity_ai(
        target_word, reference, target_char
    )

    return JsonResponse(
        {
            "target_word": target_word,
            "reference": reference,
            "similarity_percentage": similarity_result["similarity_percentage"],
            "test_passed": similarity_result["test_passed"],
            "message": similarity_result["message"],
        },
        status=200,
    )


@require_http_methods(["GET"])
def get_letters(request, language_code):
    """Get letters for a specific language"""
    language = get_object_or_404(Language, code=language_code, is_active=True)
    letters = Letter.objects.filter(language=language, is_active=True).order_by("order")

    data = []
    for letter in letters:
        data.append(
            {
                "id": letter.id,
                "letter": letter.letter,
                "word": letter.word,
                "color": letter.color,
                "boxColor": letter.box_color,
                "wordImage": letter.word_image,
                "media_url": letter.media_url,
                "order": letter.order,
                "created_at": letter.created_at.isoformat(),
            }
        )

    return JsonResponse({"letters": data})


@require_http_methods(["GET"])
def get_levels(request, language_code):
    """Get levels for a specific language"""
    language = get_object_or_404(Language, code=language_code, is_active=True)
    levels = Level.objects.filter(language=language, is_active=True).order_by(
        "letter__order", "level_number"
    )

    data = []
    for level in levels:
        data.append(
            {
                "id": level.id,
                "letter": level.letter.letter,
                "level": str(level.level_number),
                "test": level.test_word,
                "wordImage": level.word_image,
                "media_url": level.media_url,
                "difficulty": level.difficulty,
                "created_at": level.created_at.isoformat(),
            }
        )

    return JsonResponse({"levels": data})


@require_http_methods(["GET"])
def get_levels_by_letter(request, language_code, letter):
    """Get levels for a specific letter in a language"""
    language = get_object_or_404(Language, code=language_code, is_active=True)
    letter_obj = get_object_or_404(
        Letter, language=language, letter=letter, is_active=True
    )
    levels = Level.objects.filter(letter=letter_obj, is_active=True).order_by(
        "level_number"
    )

    data = []
    for level in levels:
        data.append(
            {
                "id": level.id,
                "letter": level.letter.letter,
                "level": str(level.level_number),
                "test": level.test_word,
                "wordImage": level.word_image,
                "media_url": level.media_url,
                "difficulty": level.difficulty,
                "created_at": level.created_at.isoformat(),
            }
        )

    return JsonResponse({"levels": data})


# Skills and Quizzes API Views
@require_http_methods(["GET"])
def get_skills(request):
    """Get all available skills"""
    skills = Skill.objects.filter(is_active=True).order_by("order")

    data = []
    for skill in skills:
        data.append(
            {
                "id": skill.id,
                "skill_name": skill.skill_name,
                "skill_desc": skill.skill_desc,
                "order": skill.order,
                "created_at": skill.created_at.isoformat(),
            }
        )

    return JsonResponse({"skills": data})


@require_http_methods(["GET"])
def get_skill_by_id(request, skill_id):
    """Get a specific skill by ID"""
    try:
        skill = get_object_or_404(Skill, id=skill_id, is_active=True)

        data = {
            "id": skill.id,
            "skill_name": skill.skill_name,
            "skill_desc": skill.skill_desc,
            "order": skill.order,
            "created_at": skill.created_at.isoformat(),
        }

        return JsonResponse({"skill": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_http_methods(["GET"])
def get_quizzes(request):
    """Get all quizzes with optional filtering"""
    skill_id = request.GET.get("skill_id")
    difficulty = request.GET.get("difficulty")
    lesson_name = request.GET.get("lesson_name")

    quizzes = Quiz.objects.filter(is_active=True)

    if skill_id:
        quizzes = quizzes.filter(skill_id=skill_id)
    if difficulty:
        quizzes = quizzes.filter(difficulty=difficulty)
    if lesson_name:
        quizzes = quizzes.filter(lesson_name__icontains=lesson_name)

    quizzes = quizzes.order_by("lesson_name", "order")

    data = []
    for quiz in quizzes:
        data.append(
            {
                "id": quiz.id,
                "lesson_name": quiz.lesson_name,
                "question": quiz.question,
                "options": quiz.options,
                "correct_answer": quiz.correct_answer,
                "skill": (
                    {
                        "id": quiz.skill.id,
                        "skill_name": quiz.skill.skill_name,
                    }
                    if quiz.skill
                    else None
                ),
                "difficulty": quiz.difficulty,
                "order": quiz.order,
                "created_at": quiz.created_at.isoformat(),
            }
        )

    return JsonResponse({"quizzes": data})


@require_http_methods(["GET"])
def get_quizzes_by_skill(request, skill_id):
    """Get quizzes for a specific skill"""
    try:
        skill = get_object_or_404(Skill, id=skill_id, is_active=True)
        quizzes = Quiz.objects.filter(skill=skill, is_active=True).order_by(
            "lesson_name", "order"
        )

        data = []
        for quiz in quizzes:
            data.append(
                {
                    "id": quiz.id,
                    "lesson_name": quiz.lesson_name,
                    "question": quiz.question,
                    "options": quiz.options,
                    "correct_answer": quiz.correct_answer,
                    "difficulty": quiz.difficulty,
                    "order": quiz.order,
                    "created_at": quiz.created_at.isoformat(),
                }
            )

        return JsonResponse(
            {
                "skill": {
                    "id": skill.id,
                    "skill_name": skill.skill_name,
                    "skill_desc": skill.skill_desc,
                },
                "quizzes": data,
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_http_methods(["GET"])
def get_quiz_by_id(request, quiz_id):
    """Get a specific quiz by ID"""
    try:
        quiz = get_object_or_404(Quiz, id=quiz_id, is_active=True)

        data = {
            "id": quiz.id,
            "lesson_name": quiz.lesson_name,
            "question": quiz.question,
            "options": quiz.options,
            "correct_answer": quiz.correct_answer,
            "skill": (
                {
                    "id": quiz.skill.id,
                    "skill_name": quiz.skill.skill_name,
                }
                if quiz.skill
                else None
            ),
            "difficulty": quiz.difficulty,
            "order": quiz.order,
            "created_at": quiz.created_at.isoformat(),
        }

        return JsonResponse({"quiz": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_http_methods(["GET"])
def get_quizzes_by_lesson(request, lesson_name):
    """Get all quizzes for a specific lesson"""
    try:
        quizzes = Quiz.objects.filter(
            lesson_name__iexact=lesson_name, is_active=True
        ).order_by("order")

        data = []
        for quiz in quizzes:
            data.append(
                {
                    "id": quiz.id,
                    "lesson_name": quiz.lesson_name,
                    "question": quiz.question,
                    "options": quiz.options,
                    "correct_answer": quiz.correct_answer,
                    "skill": (
                        {
                            "id": quiz.skill.id,
                            "skill_name": quiz.skill.skill_name,
                        }
                        if quiz.skill
                        else None
                    ),
                    "difficulty": quiz.difficulty,
                    "order": quiz.order,
                    "created_at": quiz.created_at.isoformat(),
                }
            )

        return JsonResponse({"lesson_name": lesson_name, "quizzes": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_http_methods(["POST"])
@csrf_exempt
def submit_quiz_answer(request):
    """Submit and validate a quiz answer"""
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        if request.content_type == "application/json":
            data = json.loads(request.body)
        else:
            data = request.POST.dict()

        quiz_id = data.get("quiz_id")
        user_answer = data.get("user_answer")
        user_id = data.get("user_id")

        if not quiz_id or not user_answer:
            return JsonResponse({"error": "Missing quiz_id or user_answer"}, status=400)

        quiz = get_object_or_404(Quiz, id=quiz_id, is_active=True)
        is_correct = user_answer.strip().lower() == quiz.correct_answer.strip().lower()

        response_data = {
            "quiz_id": quiz_id,
            "user_answer": user_answer,
            "correct_answer": quiz.correct_answer,
            "is_correct": is_correct,
            "lesson_name": quiz.lesson_name,
        }

        # If user_id is provided, you could save the result to track progress
        if user_id:
            try:
                CustomUser.objects.get(id=user_id)
                # Here you could create a QuizAttempt model to track user quiz attempts
                response_data["user_id"] = user_id
            except CustomUser.DoesNotExist:
                pass

        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
