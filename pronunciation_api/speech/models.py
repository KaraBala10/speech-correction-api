from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    verification_code = models.CharField(max_length=8, blank=True, null=True)
    failed_attempts = models.IntegerField(default=0)
    verification_code_sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                name="unique_email_active",
                condition=Q(is_active=True),
            )
        ]

    def clean(self):
        if self.is_active:
            if (
                CustomUser.objects.filter(email=self.email, is_active=True)
                .exclude(id=self.id)
                .exists()
            ):
                raise ValidationError(
                    f"An active user with the email {self.email} already exists."
                )

    def __str__(self):
        return self.username

    def is_verification_code_expired(self):
        if self.verification_code_sent_at:
            return timezone.now() > self.verification_code_sent_at + timedelta(
                minutes=10
            )
        return False


@receiver(pre_save, sender=CustomUser)
def deactivate_other_users_with_same_email(sender, instance, **kwargs):
    if instance.is_active:
        CustomUser.objects.filter(email=instance.email, is_active=False).delete()


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    country = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Language(models.Model):
    """Language model to support multiple languages"""

    LANGUAGE_CHOICES = [
        ("ar", "Arabic"),
        ("en", "English"),
    ]

    code = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, unique=True)
    name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Letter(models.Model):
    """Letter model to replace letters.json"""

    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, related_name="letters"
    )
    letter = models.CharField(max_length=10)  # Support Arabic and English letters
    word = models.CharField(max_length=100)
    color = models.CharField(
        max_length=50, default="bg-blue-300"
    )  # Tailwind CSS classes
    box_color = models.CharField(max_length=50, default="bg-blue-400")
    word_image = models.URLField(max_length=500, blank=True, null=True)
    audio_file = models.FileField(upload_to="letters/audio/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["language", "letter"]
        ordering = ["language", "order", "letter"]

    def __str__(self):
        return f"{self.language.code.upper()}: {self.letter} - {self.word}"

    @property
    def media_url(self):
        """Generate media URL for audio file"""
        if self.audio_file:
            return self.audio_file.url
        return f"/media/{self.word}.wav"


class Level(models.Model):
    """Level model to replace levels.json"""

    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, related_name="levels"
    )
    letter = models.ForeignKey(Letter, on_delete=models.CASCADE, related_name="levels")
    level_number = models.PositiveIntegerField()
    test_word = models.CharField(max_length=100)
    word_image = models.URLField(max_length=500, blank=True, null=True)
    audio_file = models.FileField(upload_to="levels/audio/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ("easy", "Easy"),
            ("medium", "Medium"),
            ("hard", "Hard"),
        ],
        default="easy",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["language", "letter", "level_number"]
        ordering = ["language", "letter", "level_number"]

    def __str__(self):
        return f"{self.language.code.upper()}: {self.letter.letter} Level {self.level_number} - {self.test_word}"

    @property
    def media_url(self):
        """Generate media URL for audio file"""
        if self.audio_file:
            return self.audio_file.url
        return f"/media/{self.test_word}.wav"


class Skill(models.Model):
    """Skill model to replace skills.json"""

    skill_name = models.CharField(max_length=100, unique=True)
    skill_desc = models.TextField()
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "skill_name"]

    def __str__(self):
        return self.skill_name


class Quiz(models.Model):
    """Quiz model to replace quizs.json"""

    lesson_name = models.CharField(max_length=200)
    question = models.TextField()
    options = models.JSONField()  # Store as JSON array
    correct_answer = models.CharField(max_length=200)
    skill = models.ForeignKey(
        Skill, on_delete=models.CASCADE, related_name="quizzes", null=True, blank=True
    )
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ("easy", "Easy"),
            ("medium", "Medium"),
            ("hard", "Hard"),
        ],
        default="easy",
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["lesson_name", "order"]
        verbose_name_plural = "Quizzes"

    def __str__(self):
        return f"{self.lesson_name} - {self.question[:50]}..."
