from django.contrib import admin
from django.utils.html import format_html
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import CustomUser, Language, Letter, Level, Profile, Quiz, Skill


class CustomUserAdmin(ImportExportModelAdmin):
    list_display = ("id", "username", "email", "is_active", "is_staff", "date_joined")
    search_fields = ("username", "email", "first_name", "last_name")
    list_filter = ("is_active", "is_staff", "is_superuser", "date_joined")
    readonly_fields = ("date_joined", "last_login")
    ordering = ("-date_joined",)

    fieldsets = (
        (
            "Basic Information",
            {"fields": ("username", "email", "first_name", "last_name", "password")},
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important Dates",
            {"fields": ("date_joined", "last_login"), "classes": ("collapse",)},
        ),
    )


class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "country", "profile_picture_preview", "created_at")
    search_fields = ("user__username", "user__email", "country")
    list_filter = ("country", "created_at")
    readonly_fields = ("created_at", "profile_picture_preview")

    def profile_picture_preview(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px; border-radius: 50%;" />',
                obj.profile_picture.url,
            )
        return "No image"

    profile_picture_preview.short_description = "Profile Picture"


class LanguageAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("code", "name")
    ordering = ("code",)


class LetterResource(resources.ModelResource):
    class Meta:
        model = Letter
        import_id_fields = ("language", "letter")
        fields = (
            "language",
            "letter",
            "word",
            "color",
            "box_color",
            "word_image",
            "is_active",
            "order",
        )


class LetterAdmin(ImportExportModelAdmin):
    resource_class = LetterResource
    list_display = (
        "letter",
        "word",
        "language",
        "color_preview",
        "is_active",
        "order",
        "created_at",
    )
    list_filter = ("language", "is_active", "created_at")
    search_fields = ("letter", "word")
    list_editable = ("order", "is_active")
    ordering = ("language", "order", "letter")
    readonly_fields = ("created_at", "updated_at", "color_preview")

    fieldsets = (
        ("Basic Information", {"fields": ("language", "letter", "word", "order")}),
        ("Styling", {"fields": ("color", "box_color", "color_preview")}),
        ("Media", {"fields": ("word_image", "audio_file")}),
        ("Status", {"fields": ("is_active",)}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def color_preview(self, obj):
        return format_html(
            '<div style="background-color: {}; width: 30px; height: 20px; border: 1px solid #ccc;"></div>',
            obj.color.replace("bg-", "").replace("-", " "),
        )

    color_preview.short_description = "Color Preview"


class LevelResource(resources.ModelResource):
    class Meta:
        model = Level
        import_id_fields = ("language", "letter", "level_number")
        fields = (
            "language",
            "letter",
            "level_number",
            "test_word",
            "word_image",
            "difficulty",
            "is_active",
        )


class LevelAdmin(ImportExportModelAdmin):
    resource_class = LevelResource
    list_display = (
        "letter",
        "level_number",
        "test_word",
        "language",
        "difficulty",
        "is_active",
        "created_at",
    )
    list_filter = ("language", "letter", "difficulty", "is_active", "created_at")
    search_fields = ("test_word", "letter__letter", "letter__word")
    list_editable = ("is_active", "difficulty")
    ordering = ("language", "letter", "level_number")
    readonly_fields = ("created_at", "updated_at", "media_url_preview")

    fieldsets = (
        (
            "Basic Information",
            {"fields": ("language", "letter", "level_number", "test_word")},
        ),
        ("Media", {"fields": ("word_image", "audio_file", "media_url_preview")}),
        ("Settings", {"fields": ("difficulty", "is_active")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def media_url_preview(self, obj):
        if obj.audio_file:
            return format_html(
                '<audio controls style="max-width: 200px;"><source src="{}" type="audio/wav">Your browser does not support the audio element.</audio>',
                obj.audio_file.url,
            )
        return "No audio file"

    media_url_preview.short_description = "Audio Preview"


class SkillResource(resources.ModelResource):
    class Meta:
        model = Skill
        import_id_fields = ("skill_name",)
        fields = ("skill_name", "skill_desc", "is_active", "order")


class SkillAdmin(ImportExportModelAdmin):
    resource_class = SkillResource
    list_display = (
        "skill_name",
        "skill_desc_preview",
        "is_active",
        "order",
        "created_at",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("skill_name", "skill_desc")
    list_editable = ("order", "is_active")
    ordering = ("order", "skill_name")
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Basic Information", {"fields": ("skill_name", "skill_desc")}),
        ("Settings", {"fields": ("is_active", "order")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def skill_desc_preview(self, obj):
        return (
            obj.skill_desc[:100] + "..."
            if len(obj.skill_desc) > 100
            else obj.skill_desc
        )

    skill_desc_preview.short_description = "Description Preview"

    actions = ["activate_skills", "deactivate_skills"]

    def activate_skills(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} skills activated.")

    activate_skills.short_description = "Activate selected skills"

    def deactivate_skills(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} skills deactivated.")

    deactivate_skills.short_description = "Deactivate selected skills"


class QuizResource(resources.ModelResource):
    class Meta:
        model = Quiz
        import_id_fields = ("lesson_name", "question")
        fields = (
            "lesson_name",
            "question",
            "options",
            "correct_answer",
            "skill",
            "difficulty",
            "is_active",
            "order",
        )


class QuizAdmin(ImportExportModelAdmin):
    resource_class = QuizResource
    list_display = (
        "lesson_name",
        "question_preview",
        "correct_answer",
        "skill",
        "difficulty",
        "is_active",
        "created_at",
    )
    list_filter = ("skill", "difficulty", "is_active", "lesson_name", "created_at")
    search_fields = ("lesson_name", "question", "correct_answer")
    list_editable = ("is_active", "difficulty")
    ordering = ("lesson_name", "order")
    readonly_fields = ("created_at", "updated_at", "options_preview")

    fieldsets = (
        ("Basic Information", {"fields": ("lesson_name", "question")}),
        ("Quiz Content", {"fields": ("options", "correct_answer", "options_preview")}),
        ("Settings", {"fields": ("skill", "difficulty", "is_active", "order")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def question_preview(self, obj):
        return obj.question[:80] + "..." if len(obj.question) > 80 else obj.question

    question_preview.short_description = "Question Preview"

    def options_preview(self, obj):
        if obj.options:
            options_list = ", ".join([f'"{opt}"' for opt in obj.options])
            return format_html(
                '<div style="max-width: 300px; word-wrap: break-word;">{}</div>',
                options_list,
            )
        return "No options"

    options_preview.short_description = "Options Preview"

    actions = [
        "activate_quizzes",
        "deactivate_quizzes",
        "set_difficulty_easy",
        "set_difficulty_medium",
        "set_difficulty_hard",
    ]

    def activate_quizzes(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} quizzes activated.")

    activate_quizzes.short_description = "Activate selected quizzes"

    def deactivate_quizzes(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} quizzes deactivated.")

    deactivate_quizzes.short_description = "Deactivate selected quizzes"

    def set_difficulty_easy(self, request, queryset):
        updated = queryset.update(difficulty="easy")
        self.message_user(request, f"{updated} quizzes set to easy difficulty.")

    set_difficulty_easy.short_description = "Set difficulty to Easy"

    def set_difficulty_medium(self, request, queryset):
        updated = queryset.update(difficulty="medium")
        self.message_user(request, f"{updated} quizzes set to medium difficulty.")

    set_difficulty_medium.short_description = "Set difficulty to Medium"

    def set_difficulty_hard(self, request, queryset):
        updated = queryset.update(difficulty="hard")
        self.message_user(request, f"{updated} quizzes set to hard difficulty.")

    set_difficulty_hard.short_description = "Set difficulty to Hard"


# Register all models
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Language, LanguageAdmin)
admin.site.register(Letter, LetterAdmin)
admin.site.register(Level, LevelAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Quiz, QuizAdmin)
