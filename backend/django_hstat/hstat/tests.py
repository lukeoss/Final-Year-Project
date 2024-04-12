from datetime import datetime
from django.test import TestCase
from hstat.models import *


class TeamModelTests(TestCase):

    def setUp(self):
        self.test_user = User.objects.create_user(username='testuser', password='secret')

    def test_team_creation(self):
        team = Team.objects.create(team_name='Test Team', user=self.test_user)
        self.assertEqual(str(team), 'Test Team')


class PlayerModelTests(TestCase):

    def setUp(self):
        self.test_user = User.objects.create_user(username='testuser', password='secret')

    def test_player_creation(self):
        team = Team.objects.create(team_name='Test Team', user=self.test_user)
        
        player = Player.objects.create(
            player_first_name='Ferchar',
            player_last_name='Eógan',
            player_number=10,
            player_team=team,
            user=self.test_user   
        )
        
        self.assertEqual(player.player_first_name, 'Ferchar')
        self.assertEqual(player.player_last_name, 'Eógan')
        self.assertEqual(player.player_number, 10)
        self.assertEqual(player.player_team, team)


class MatchModelTests(TestCase):

    def setUp(self):
        self.test_user = User.objects.create_user(username='testuser', password='secret')

    def test_match_creation(self):
        team1 = Team.objects.create(team_name='Home Team', user=self.test_user)
        team2 = Team.objects.create(team_name='Away Team', user=self.test_user)

        match = Match.objects.create(
            date=datetime.now(), 
            home_team=team1,
            away_team=team2,
            location='Stadium',
            competition='League',
            user=self.test_user   
        )

        self.assertEqual(match.home_team, team1)
        self.assertEqual(match.away_team, team2)
        self.assertEqual(match.location, 'Stadium')
        self.assertEqual(match.competition, 'League')
        self.assertEqual(str(match), f"Match on {match.date} at Stadium") 


class MatchEventModelTests(TestCase):

    def setUp(self):
        self.test_user = User.objects.create_user(username='testuser', password='secret')

    def test_match_event_creation(self):
        team = Team.objects.create(team_name='Test Team', user=self.test_user)
        player = Player.objects.create(player_first_name='Ferchar', player_last_name='Eógan', player_number=10, player_team=team, user=self.test_user)
        match = Match.objects.create(date=datetime.now(), location='Pitch', competition='Friendly', home_team=team, away_team=team, user=self.test_user)
        
        event = MatchEvent.objects.create(
            match=match,
            event_type='Goal',
            coord_x=40.0,
            coord_y=80.0,
            player=player,
            time=datetime.now(),
            play_direction='left_to_right',
            user=self.test_user 
        )

        self.assertEqual(event.match, match)
        self.assertEqual(event.player, player)
        self.assertEqual(event.event_type, 'Goal')
