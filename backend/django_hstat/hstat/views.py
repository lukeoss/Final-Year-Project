# Standard library imports
import json
import logging

# Django imports
from django.utils.dateformat import DateFormat
from django.utils.formats import get_format
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
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

# Local imports
from hstat.models import Team, Player, Match, MatchEvent
from hstat.serializers import MatchEventDetailSerializer, PlayerDetailSerializer, TeamSerializer, PlayerSerializer, MatchSerializer, MatchEventSerializer

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
    # serializer_class = MatchEventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.query_params.get('detail') == 'true':
            return MatchEventDetailSerializer
        return MatchEventSerializer

    def get_queryset(self):
        return MatchEvent.objects.filter(match__user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=False, methods=['get'], url_path='(?P<game_id>\d+)')
    def game_events(self, request, game_id=None):
        if game_id is not None:
            events = self.get_queryset().filter(match_id=game_id)
            serializer = self.get_serializer(events, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PlayerDetailView(RetrieveAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Player.objects.filter(matchevent__match__user=self.request.user).distinct().prefetch_related('matchevent_set', 'matchevent_set__match')

        
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

@api_view(['POST'])
def logout_view(request):
    response = Response({"detail": "Successfully logged out."})
    response.delete_cookie('access')
    response.delete_cookie('refresh')
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_name_view(request):
    user = request.user
    
    user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    
    return Response(user_data)

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
    
    filtered_event_counts = filtered_events_query.aggregate(
        goals=Count(Case(When(event_type='goal', then=1), output_field=IntegerField())),
        points=Count(Case(When(event_type='point', then=1), output_field=IntegerField())),
        misses=Count(Case(When(event_type='miss', then=1), output_field=IntegerField())),
        blocks=Count(Case(When(event_type='block', then=1), output_field=IntegerField())),
    )

    filtered_total_shots = filtered_event_counts['goals'] + filtered_event_counts['points'] + filtered_event_counts['misses']
    filtered_games_count = len(match_ids)
    filtered_successful_shots_percentage = (filtered_event_counts['goals'] + filtered_event_counts['points']) / filtered_total_shots * 100 if filtered_total_shots > 0 else 0

    all_matches_query = Match.objects.filter(user=user)
    all_match_ids = list(all_matches_query.values_list('id', flat=True))
    all_events_query = MatchEvent.objects.filter(match_id__in=all_match_ids)

    all_time_event_counts = all_events_query.aggregate(
        goals=Count(Case(When(event_type='goal', then=1), output_field=IntegerField())),
        points=Count(Case(When(event_type='point', then=1), output_field=IntegerField())),
        misses=Count(Case(When(event_type='miss', then=1), output_field=IntegerField())),
        blocks=Count(Case(When(event_type='block', then=1), output_field=IntegerField())),
    )

    all_time_total_shots = all_time_event_counts['goals'] + all_time_event_counts['points'] + all_time_event_counts['misses']
    all_time_games_count = all_matches_query.count()
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def past_games_view(request):
    user = request.user
    matches = Match.objects.filter(user=user).order_by('-date').select_related('home_team')

    formatted_matches = []
    for match in matches:
        formatted_date = DateFormat(match.date).format('jS F Y')
        formatted_matches.append({
            'id': match.id,
            'team_name': match.home_team.team_name,
            'formatted_date': formatted_date
        })

    return Response(formatted_matches)