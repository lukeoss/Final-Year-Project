# views.py
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse  
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .serializers import TeamSerializer
import json

from .models import Team, Player
from .serializers import TeamSerializer, PlayerSerializer

class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
def hello(request):
    return HttpResponse("Hello, World!")

def test_api(request):
    return JsonResponse({"message": "Hello from Django!"})

@csrf_exempt
@require_http_methods(["POST"])
def check_email_exists(request):
    data = json.loads(request.body)
    email_exists = User.objects.filter(email=data['email']).exists()
    return JsonResponse({'exists': email_exists})

@csrf_exempt
@require_http_methods(["POST"])
def create_account(request):
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
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    user = authenticate(request, username=email, password=password)
    if user is not None:
        login(request, user)
        tokens = get_tokens_for_user(user)
        response = JsonResponse({"message": "Login successful."}, status=200)
        response.set_cookie(
            key='access',
            value=tokens['access'],
            httponly=True,
            samesite='Strict',
            secure=False, # Turn to True when HTTPS
        )
        return response
    else:
        return JsonResponse({"error": "Invalid credentials."}, status=400)
    
# def get_tokens_for_user(user):
#     refresh = RefreshToken.for_user(user)

#     return {
#         'refresh': str(refresh),
#         'access': str(refresh.access_token),
#     }
    
@login_required
def get_user_info(request):
    user_data = {
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
        # Match data etc
    }
    return JsonResponse(user_data)

@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})