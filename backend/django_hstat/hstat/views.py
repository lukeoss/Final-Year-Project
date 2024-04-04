# Standard library imports
import json
import logging

# Django imports
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Count, Case, When, IntegerField, Q, Subquery
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Rest Framework imports
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

# Local imports
from .models import Team, Player, Match, MatchEvent
from .serializers import TeamSerializer, PlayerSerializer, MatchSerializer, MatchEventSerializer

# Class-based views       
class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        response = Response()
        response.data = {
            'detail': 'Authentication successful. Tokens are in the cookies.'
        }

        access_token = serializer.validated_data.get('access')
        refresh_token = serializer.validated_data.get('refresh')

        response.set_cookie(
            key='access',
            value=str(access_token),
            httponly=True,
            samesite='None',
            secure=True,
            path='/'
        )
        
        response.set_cookie(
            key='refresh',
            value=str(refresh_token),
            httponly=True,
            samesite='None',
            secure=True,
            path='/'
        )

        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        if not refresh_token:
            raise InvalidToken('No refresh token provided')
        
        serializer = self.get_serializer(data={'refresh': refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        
        return Response(serializer.validated_data, status=200)

class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.none()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(user=self.request.user)

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.none()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Match.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MatchEventViewSet(viewsets.ModelViewSet):
    queryset = MatchEvent.objects.none()
    serializer_class = MatchEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MatchEvent.objects.filter(match__user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Function-based views
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

@login_required
def get_user_info(request):
    user_data = {
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
    }
    return JsonResponse(user_data)

@api_view(['POST'])
def logout_view(request):
    response = Response({"detail": "Successfully logged out."})
    response.delete_cookie('access')
    response.delete_cookie('refresh')
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data_view(request, numberoflatestgames=None):
    user = request.user

    if numberoflatestgames:
        try:
            numberoflatestgames = int(numberoflatestgames)
            latest_matches_query = Match.objects.filter(user=user).order_by('-date')[:numberoflatestgames]
        except ValueError:
            return Response({'error': 'Invalid number format for numberoflatestgames'}, status=400)
    else:
        latest_matches_query = Match.objects.filter(user=user).order_by('-date')

    match_ids = list(latest_matches_query.values_list('id', flat=True))

    filtered_events_query = MatchEvent.objects.filter(match_id__in=match_ids)
    
    # Calculate stats for filtered events
    filtered_event_counts = filtered_events_query.aggregate(
        goals=Count(Case(When(event_type='goal', then=1), output_field=IntegerField())),
        points=Count(Case(When(event_type='point', then=1), output_field=IntegerField())),
        misses=Count(Case(When(event_type='miss', then=1), output_field=IntegerField())),
        blocks=Count(Case(When(event_type='block', then=1), output_field=IntegerField())),
    )

    filtered_total_shots = filtered_event_counts['goals'] + filtered_event_counts['points'] + filtered_event_counts['misses']
    filtered_games_count = len(match_ids)
    filtered_successful_shots_percentage = (filtered_event_counts['goals'] + filtered_event_counts['points']) / filtered_total_shots * 100 if filtered_total_shots > 0 else 0

    # Always calculate all-time stats
    all_time_event_counts = MatchEvent.objects.aggregate(
        goals=Count(Case(When(event_type='goal', then=1), output_field=IntegerField())),
        points=Count(Case(When(event_type='point', then=1), output_field=IntegerField())),
        misses=Count(Case(When(event_type='miss', then=1), output_field=IntegerField())),
        blocks=Count(Case(When(event_type='block', then=1), output_field=IntegerField())),
    )

    all_time_total_shots = all_time_event_counts['goals'] + all_time_event_counts['points'] + all_time_event_counts['misses']
    all_time_games_count = Match.objects.count()
    all_time_successful_shots_percentage = (all_time_event_counts['goals'] + all_time_event_counts['points']) / all_time_total_shots * 100 if all_time_total_shots > 0 else 0
    
    return Response({
        'filtered': {
            'goals': filtered_event_counts['goals'],
            'points': filtered_event_counts['points'],
            'misses': filtered_event_counts['misses'],
            'total_shots': filtered_total_shots,
            'games_recorded': filtered_games_count,
            'successful_shots_percentage': round(filtered_successful_shots_percentage, 2),
            'blocks': filtered_event_counts['blocks'],
        },
        'all_time': {
            'goals': all_time_event_counts['goals'],
            'points': all_time_event_counts['points'],
            'misses': all_time_event_counts['misses'],
            'total_shots': all_time_total_shots,
            'games_recorded': all_time_games_count,
            'successful_shots_percentage': round(all_time_successful_shots_percentage, 2),
            'blocks': all_time_event_counts['blocks'],
        }
    })
