from django.contrib import admin
from django.utils.html import format_html
from import_export.admin import ImportExportModelAdmin

from .models import CustomUser, Profile


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "is_active", "is_staff")
    search_fields = ("username", "email")
    list_filter = ("is_active", "is_staff")
    actions = ["activate_users", "deactivate_users"]

    def activate_users(self, request, queryset):
        queryset.update(is_active=True)

    activate_users.short_description = "Activate selected users"

    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)

    deactivate_users.short_description = "Deactivate selected users"


@admin.register(Profile)
class ProfileAdmin(ImportExportModelAdmin):
    list_display = ("id", "user", "country", "profile_pic_thumb", "created_at")
    search_fields = ("user__username", "country")
    list_filter = ("country",)
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"

    def profile_pic_thumb(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" width="40" height="40" style="object-fit:cover; border-radius:50%;" />',
                obj.profile_picture.url,
            )
        return "-"

    profile_pic_thumb.short_description = "Profile Picture"
