from django.contrib import admin
from django.urls import path, include
from hstat import views
from hstat.views import TeamViewSet, MatchViewSet, MatchEventViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'teams', TeamViewSet)
router.register(r'matches', MatchViewSet)
router.register(r'match-events', MatchEventViewSet)

urlpatterns = [
    # Basic URL routes
    path('hello/', views.hello, name='hello'),
    path('admin/', admin.site.urls),
    
    # Account management URLs
    path('create-account/', views.create_account, name='create_account'),
    path('check-email-exists/', views.check_email_exists, name='check_email_exists'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
    path('api/user-info/', views.get_user_info, name='user_info'),
    
    # REST API URLs
    path('api/', include(router.urls)),  # Including router URLs for API endpoints
]
