# models.py
from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    team_name = models.CharField(max_length=100)
    user = models.ForeignKey(User, related_name='teams', on_delete=models.CASCADE)

    def __str__(self):
        return self.team_name

class Player(models.Model):
    player_first_name = models.CharField(max_length=100)
    player_last_name = models.CharField(max_length=100)
    player_number = models.IntegerField()
    player_team = models.ForeignKey(Team, related_name='players', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='players', on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.player_first_name} {self.player_last_name}"

class Match(models.Model):
    date = models.DateTimeField()
    home_team = models.ForeignKey(Team, related_name='home_matches', on_delete=models.CASCADE)
    away_team = models.ForeignKey(Team, related_name='away_matches', on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    competition = models.CharField(max_length=255)
    user = models.ForeignKey(User, related_name='matches', on_delete=models.CASCADE)

    def __str__(self):
        return f"Match on {self.date} at {self.location}"

class MatchEvent(models.Model):
    match = models.ForeignKey(Match, related_name='events', on_delete=models.CASCADE)
    event_type = models.CharField(max_length=255)
    coord_x = models.FloatField()
    coord_y = models.FloatField()
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    time = models.TimeField()
    play_direction = models.CharField(max_length=50)
    user = models.ForeignKey(User, related_name='match_events', on_delete=models.CASCADE)

    def __str__(self):
        return f"Event {self.event_type} at {self.time} in Match {self.match.id}"