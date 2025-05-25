from django.urls import path

from .views import (
    LoginView,
    LogoutView,
    PasswordResetConfirmView,
    PasswordResetView,
    PublicUserProfileView,
    RegisterView,
    UpdateProfileView,
    UserProfileView,
    VerifyEmailView,
    ar_letters,
    ar_levels,
    en_letters,
    en_levels,
)

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="signup"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("profile/update/", UpdateProfileView.as_view(), name="update-profile"),
    path("password-reset/", PasswordResetView.as_view(), name="password_reset"),
    path(
        "password-reset/confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "profile/<str:username>/",
        PublicUserProfileView.as_view(),
        name="public-profile",
    ),
    path("ar/letters/", ar_letters, name="ar-letters"),
    path("ar/levels/", ar_levels, name="ar-levels"),
    path("en/letters/", en_letters, name="en-letters"),
    path("en/levels/", en_levels, name="en-levels"),
]
