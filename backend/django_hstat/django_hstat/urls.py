from django.contrib import admin
from django.urls import path, include
from hstat import views
from hstat.views import TeamViewSet, MatchViewSet, MatchEventViewSet
from rest_framework.routers import DefaultRouter

# Initialize the DefaultRouter
router = DefaultRouter()

# Register the TeamViewSet with the router
router.register(r'teams', TeamViewSet)
router.register(r'matches', MatchViewSet)
router.register(r'match-events', MatchEventViewSet)

urlpatterns = [
    path('hello/', views.hello, name='hello'),
    path('admin/', admin.site.urls),
    path('create-account/', views.create_account, name='create_account'),
    path('check-email-exists/', views.check_email_exists, name='check_email_exists'),
    # The following line has been commented out as it's replaced with router.urls
    # path('api/teams-and-players/', views.teams_and_players, name='teams-and-players'),
    path('api/', include(router.urls)),  # Include the router URLs into the application's URLconf
    path('api/user-info/',views.get_user_info, name='user_info'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
]
