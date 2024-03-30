from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Team, Player, Match, MatchEvent
from .serializers import TeamSerializer, PlayerSerializer, MatchSerializer, MatchEventSerializer

# Class-based
class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

class MatchEventViewSet(viewsets.ModelViewSet):
    queryset = MatchEvent.objects.all()
    serializer_class = MatchEventSerializer

# Function-based
def hello(request):
    """Simple view to return a Hello World response."""
    return HttpResponse("Hello, World!")

def test_api(request):
    """API test endpoint."""
    return JsonResponse({"message": "Hello from Django!"})

@csrf_exempt
@require_http_methods(["POST"])
def check_email_exists(request):
    """Check if an email exists in the User model."""
    data = json.loads(request.body)
    email_exists = User.objects.filter(email=data['email']).exists()
    return JsonResponse({'exists': email_exists})

@csrf_exempt
@require_http_methods(["POST"])
def create_account(request):
    """Create a new user account."""
    try:
        data = json.loads(request.body)
        user = User.objects.create_user(
            first_name=data['first_name'],
            last_name=data['last_name'],
            username=data['email'], 
            email=data['email'], 
            password=data['password']
        )
        return JsonResponse({"message": "User created successfully."}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def login_view(request):
    """Authenticate and log in a user, setting an HTTP-only cookie."""
    data = json.loads(request.body)
    user = authenticate(request, username=data.get('email'), password=data.get('password'))
    if user:
        login(request, user)
        # Placeholder for token generation - Ensure implementation
        # tokens = get_tokens_for_user(user)
        response = JsonResponse({"message": "Login successful."}, status=200)
        return response
    else:
        return JsonResponse({"error": "Invalid credentials."}, status=400)

@login_required
def get_user_info(request):
    """Return information about the currently logged-in user."""
    user_data = {
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
    }
    return JsonResponse(user_data)

@require_http_methods(["POST"])
def logout_view(request):
    """Log out the current user."""
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})