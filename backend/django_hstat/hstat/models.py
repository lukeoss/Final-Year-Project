# models.py
from django.db import models

class UserAccount(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return self.email
    
class Team(models.Model):
    team_id = models.AutoField(primary_key=True)
    team_name = models.CharField(max_length=100)

    def __str__(self):
        return self.team_name

class Player(models.Model):
    player_id = models.AutoField(primary_key=True)
    player_first_name = models.CharField(max_length=100)
    player_last_name = models.CharField(max_length=100)
    player_number = models.IntegerField()
    player_team = models.ForeignKey(Team, related_name='players', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.player_first_name} {self.player_last_name}"

class Match(models.Model):
    match_id = models.AutoField(primary_key=True)
    date = models.DateField()
    home_team = models.ForeignKey(Team, related_name='home_matches', on_delete=models.CASCADE)
    away_team = models.ForeignKey(Team, related_name='away_matches', on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    competition = models.CharField(max_length=255)

    def __str__(self):
        return f"Match {self.match_id} on {self.date}"

class MatchEvent(models.Model):
    event_id = models.AutoField(primary_key=True)
    match = models.ForeignKey(Match, related_name='events', on_delete=models.CASCADE)
    event_type = models.CharField(max_length=255)
    coord_x = models.FloatField()
    coord_y = models.FloatField()
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    time = models.TimeField()
    play_direction = models.CharField(max_length=50)

    def __str__(self):
        return f"Event {self.event_type} at {self.time} in Match {self.match.match_id}"
