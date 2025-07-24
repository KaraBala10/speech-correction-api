import json
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from speech.models import Language, Letter, Level


class Command(BaseCommand):
    help = "Migrate data from JSON files to Django models"

    def add_arguments(self, parser):
        parser.add_argument(
            "--languages",
            nargs="+",
            default=["ar", "en"],
            help="Languages to migrate (default: ar en)",
        )
        parser.add_argument(
            "--clear", action="store_true", help="Clear existing data before migration"
        )

    def handle(self, *args, **options):
        languages = options["languages"]
        clear_existing = options["clear"]

        # Create languages first
        self.stdout.write("Creating languages...")
        language_objects = {}
        for lang_code in languages:
            lang_name = "Arabic" if lang_code == "ar" else "English"
            language, created = Language.objects.get_or_create(
                code=lang_code, defaults={"name": lang_name, "is_active": True}
            )
            language_objects[lang_code] = language
            if created:
                self.stdout.write(f"Created language: {lang_name} ({lang_code})")
            else:
                self.stdout.write(f"Language already exists: {lang_name} ({lang_code})")

        # Clear existing data if requested
        if clear_existing:
            self.stdout.write("Clearing existing data...")
            Level.objects.all().delete()
            Letter.objects.all().delete()
            self.stdout.write("Existing data cleared.")

        # Migrate letters
        for lang_code in languages:
            self.migrate_letters(lang_code, language_objects[lang_code])

        # Migrate levels
        for lang_code in languages:
            self.migrate_levels(lang_code, language_objects[lang_code])

        self.stdout.write(self.style.SUCCESS("Migration completed successfully!"))

    def migrate_letters(self, lang_code, language):
        """Migrate letters from JSON to Django models"""
        json_file = os.path.join(settings.BASE_DIR, "json", lang_code, "letters.json")

        if not os.path.exists(json_file):
            self.stdout.write(
                f"Warning: {json_file} not found, skipping letters migration for {lang_code}"
            )
            return

        self.stdout.write(f"Migrating letters for {lang_code}...")

        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        letters_created = 0
        letters_updated = 0

        for i, letter_data in enumerate(data.get("letters", [])):
            letter, created = Letter.objects.get_or_create(
                language=language,
                letter=letter_data["letter"],
                defaults={
                    "word": letter_data["word"],
                    "color": letter_data.get("color", "bg-blue-300"),
                    "box_color": letter_data.get("boxColor", "bg-blue-400"),
                    "word_image": letter_data.get("wordImage", ""),
                    "is_active": True,
                    "order": i + 1,
                },
            )

            if created:
                letters_created += 1
            else:
                # Update existing letter
                letter.word = letter_data["word"]
                letter.color = letter_data.get("color", "bg-blue-300")
                letter.box_color = letter_data.get("boxColor", "bg-blue-400")
                letter.word_image = letter_data.get("wordImage", "")
                letter.order = i + 1
                letter.save()
                letters_updated += 1

        self.stdout.write(
            f"Letters for {lang_code}: {letters_created} created, {letters_updated} updated"
        )

    def migrate_levels(self, lang_code, language):
        """Migrate levels from JSON to Django models"""
        json_file = os.path.join(settings.BASE_DIR, "json", lang_code, "levels.json")

        if not os.path.exists(json_file):
            self.stdout.write(
                f"Warning: {json_file} not found, skipping levels migration for {lang_code}"
            )
            return

        self.stdout.write(f"Migrating levels for {lang_code}...")

        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        levels_created = 0
        levels_updated = 0

        for level_data in data.get("levels", []):
            # Find the corresponding letter
            try:
                letter = Letter.objects.get(
                    language=language, letter=level_data["letter"]
                )
            except Letter.DoesNotExist:
                self.stdout.write(
                    f'Warning: Letter {level_data["letter"]} not found for {lang_code}, skipping level'
                )
                continue

            level, created = Level.objects.get_or_create(
                language=language,
                letter=letter,
                level_number=int(level_data["level"]),
                defaults={
                    "test_word": level_data["test"],
                    "word_image": level_data.get("wordImage", ""),
                    "is_active": True,
                    "difficulty": "easy",  # Default difficulty
                },
            )

            if created:
                levels_created += 1
            else:
                # Update existing level
                level.test_word = level_data["test"]
                level.word_image = level_data.get("wordImage", "")
                level.save()
                levels_updated += 1

        self.stdout.write(
            f"Levels for {lang_code}: {levels_created} created, {levels_updated} updated"
        )
