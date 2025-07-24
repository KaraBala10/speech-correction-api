import json
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from speech.models import Skill, Quiz


class Command(BaseCommand):
    help = "Migrate skills and quizzes data from JSON files to Django models"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear", action="store_true", help="Clear existing data before migration"
        )

    def handle(self, *args, **options):
        clear_existing = options["clear"]

        # Clear existing data if requested
        if clear_existing:
            self.stdout.write("Clearing existing skills and quizzes data...")
            Quiz.objects.all().delete()
            Skill.objects.all().delete()
            self.stdout.write("Existing data cleared.")

        # Migrate skills
        self.migrate_skills()

        # Migrate quizzes
        self.migrate_quizzes()

        self.stdout.write(self.style.SUCCESS("Skills and quizzes migration completed successfully!"))

    def migrate_skills(self):
        """Migrate skills from JSON to Django models"""
        json_file = os.path.join(settings.BASE_DIR, "json", "skills.json")

        if not os.path.exists(json_file):
            self.stdout.write(
                f"Warning: {json_file} not found, skipping skills migration"
            )
            return

        self.stdout.write("Migrating skills...")

        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        skills_created = 0
        skills_updated = 0

        for i, skill_data in enumerate(data):
            skill, created = Skill.objects.get_or_create(
                skill_name=skill_data["skillName"],
                defaults={
                    "skill_desc": skill_data["skillDesc"],
                    "is_active": True,
                    "order": i + 1,
                },
            )

            if created:
                skills_created += 1
            else:
                # Update existing skill
                skill.skill_desc = skill_data["skillDesc"]
                skill.order = i + 1
                skill.save()
                skills_updated += 1

        self.stdout.write(
            f"Skills: {skills_created} created, {skills_updated} updated"
        )

    def migrate_quizzes(self):
        """Migrate quizzes from JSON to Django models"""
        json_file = os.path.join(settings.BASE_DIR, "json", "quizs.json")

        if not os.path.exists(json_file):
            self.stdout.write(
                f"Warning: {json_file} not found, skipping quizzes migration"
            )
            return

        self.stdout.write("Migrating quizzes...")

        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        quizzes_created = 0
        quizzes_updated = 0

        # Create a mapping of lesson names to skills
        lesson_to_skill_mapping = {
            "Pronouns and Their Usage": "GrammarSkill",
            "Types of Sentences": "GrammarSkill",
            "Simple Present Tense": "GrammarSkill",
            "Negative and Interrogative Forms": "GrammarSkill",
            "Intro to Dialogue": "ConversationSkill",
            "Everyday Q&A": "ConversationSkill",
            "Sentence Building": "GrammarSkill",
            "Express Yourself": "ConversationSkill",
            "Quick Reads": "ReadingSkill",
            "Reading for Details": "ReadingSkill",
            "Basic Listening": "ListeningSkill",
            "Understanding Context": "ListeningSkill",
        }

        for i, quiz_data in enumerate(data):
            # Try to find the associated skill
            skill = None
            lesson_name = quiz_data.get("lessonName", "")
            if lesson_name in lesson_to_skill_mapping:
                try:
                    skill = Skill.objects.get(skill_name=lesson_to_skill_mapping[lesson_name])
                except Skill.DoesNotExist:
                    self.stdout.write(f"Warning: Skill not found for lesson '{lesson_name}'")

            quiz, created = Quiz.objects.get_or_create(
                lesson_name=quiz_data["lessonName"],
                question=quiz_data["question"],
                defaults={
                    "options": quiz_data["options"],
                    "correct_answer": quiz_data["correct_answer"],
                    "skill": skill,
                    "is_active": True,
                    "order": i + 1,
                    "difficulty": "easy",  # Default difficulty
                },
            )

            if created:
                quizzes_created += 1
            else:
                # Update existing quiz
                quiz.options = quiz_data["options"]
                quiz.correct_answer = quiz_data["correct_answer"]
                quiz.skill = skill
                quiz.order = i + 1
                quiz.save()
                quizzes_updated += 1

        self.stdout.write(
            f"Quizzes: {quizzes_created} created, {quizzes_updated} updated"
        ) 