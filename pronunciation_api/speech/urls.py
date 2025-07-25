from django.urls import path

from . import views

urlpatterns = [
    path("signup/", views.RegisterView.as_view(), name="signup"),
    path("verify-email/", views.VerifyEmailView.as_view(), name="verify-email"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("profile/", views.UserProfileView.as_view(), name="user-profile"),
    path("profile/update/", views.UpdateProfileView.as_view(), name="update-profile"),
    path("password-reset/", views.PasswordResetView.as_view(), name="password_reset"),
    path(
        "password-reset/confirm/<uidb64>/<token>/",
        views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "profile/<str:username>/",
        views.PublicUserProfileView.as_view(),
        name="public-profile",
    ),
    path("transcribe/", views.transcribe, name="transcribe"),
    path("<str:language_code>/letters/", views.get_letters, name="get_letters"),
    path("<str:language_code>/levels/", views.get_levels, name="get_levels"),
    path(
        "<str:language_code>/levels/<str:letter>/",
        views.get_levels_by_letter,
        name="get_levels_by_letter",
    ),
    path("skills/", views.get_skills, name="get_skills"),
    path("skills/<int:skill_id>/", views.get_skill_by_id, name="get_skill_by_id"),
    path("quizzes/", views.get_quizzes, name="get_quizzes"),
    path("quizzes/<int:quiz_id>/", views.get_quiz_by_id, name="get_quiz_by_id"),
    path(
        "skills/<int:skill_id>/quizzes/",
        views.get_quizzes_by_skill,
        name="get_quizzes_by_skill",
    ),
    path(
        "quizzes/lesson/<str:lesson_name>/",
        views.get_quizzes_by_lesson,
        name="get_quizzes_by_lesson",
    ),
    path("quizzes/submit/", views.submit_quiz_answer, name="submit_quiz_answer"),
]
