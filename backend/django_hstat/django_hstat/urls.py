# urls.py
from django.contrib import admin
from django.urls import path, include
from hstat import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

router = DefaultRouter()

router.register(r'teams', views.TeamViewSet, basename='team')
router.register(r'matches', views.MatchViewSet, basename='match')
router.register(r'match-events', views.MatchEventViewSet, basename='matchevent')

urlpatterns = [
    # Basic URL routes
    path('hello/', views.hello, name='hello'),
    path('admin/', admin.site.urls),
    
    # Account management URLs
    path('create-account/', views.create_account, name='create_account'),
    path('check-email-exists/', views.check_email_exists, name='check_email_exists'),
    
    # REST API URLs
    path('api/', include(router.urls)),
    path('api/dashboard-data/', views.dashboard_data_view, name='dashboard_data'),
    path('api/dashboard-data/<int:numberoflatestgames>/', views.dashboard_data_view, name='dashboard_data_number'),
    
    # Authentication URLs
    path('api/token/', views.CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/logout/', views.logout_view, name='logout'),
    path('api/user-info/', views.get_user_info, name='user_info'),
]