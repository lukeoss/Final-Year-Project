from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from hstat import views

router = DefaultRouter()
router.register(r'teams', views.TeamViewSet, basename='team')
router.register(r'matches', views.MatchViewSet, basename='match')
router.register(r'match-events', views.MatchEventViewSet, basename='matchevent')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/create-account/', views.create_account, name='create_account'),
    path('api/check-email-exists/', views.check_email_exists, name='check_email_exists'),
    path('api/dashboard-data/', views.dashboard_data_view, name='dashboard_data'),
    path('api/dashboard-data/<int:numberoflatestgames>/', views.dashboard_data_view, name='dashboard_data_number'),
    path('api/past-games/', views.past_games_view, name='past_games'),
    path('api/user-name/', views.user_name_view, name='user_name'),
    path('api/player/<int:pk>/', views.PlayerDetailView.as_view(), name='player-detail'),
    path('api/token/', views.CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/logout/', views.logout_view, name='logout'),
]
