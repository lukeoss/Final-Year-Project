# serializers.py
from rest_framework import serializers
from .models import Team, Player, Match, MatchEvent

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'player_first_name', 'player_last_name', 'player_number', 'player_team']

class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'team_name', 'players']

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'date', 'home_team', 'away_team', 'location', 'competition', 'user']
        read_only_fields = ['user']

class MatchEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchEvent
        fields = '__all__'
        read_only_fields = ['user']