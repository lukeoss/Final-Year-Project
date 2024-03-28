from rest_framework import serializers
from .models import Team, Player, Match, MatchEvent

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['player_id', 'player_first_name', 'player_last_name', 'player_number', 'player_team_id']

class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['team_id', 'team_name', 'players']

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

class MatchEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchEvent
        fields = '__all__'