# signals.py
import logging
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from hstat.models import Team, Player

logger = logging.getLogger(__name__)

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        
@receiver(post_save, sender=User)
def create_default_team_for_new_user(sender, instance, created, **kwargs):
    if created:
        player_data = [
            {'player_first_name': 'Áine', 'player_last_name': 'Bridget', 'player_number': 1},
            {'player_first_name': 'Séarlait', 'player_last_name': 'Eilish', 'player_number': 2},
            {'player_first_name': 'Tríona', 'player_last_name': 'Erin', 'player_number': 3},
            {'player_first_name': 'Bride', 'player_last_name': 'Nóirín', 'player_number': 4},
            {'player_first_name': 'Maura', 'player_last_name': 'Laoise', 'player_number': 5},
            {'player_first_name': 'Ráichéal', 'player_last_name': 'Sibéal', 'player_number': 6},
            {'player_first_name': 'Ríonach', 'player_last_name': 'Aoibhe', 'player_number': 7},
            {'player_first_name': 'Saoirse', 'player_last_name': 'Honora', 'player_number': 8},
            {'player_first_name': 'Síofra', 'player_last_name': 'Órlaith', 'player_number': 9},
            {'player_first_name': 'Dearbhla', 'player_last_name': 'Bridget', 'player_number': 10},
            {'player_first_name': 'Majella', 'player_last_name': 'Fionnuala', 'player_number': 11},
            {'player_first_name': 'Aoibhinn', 'player_last_name': 'Dáirine', 'player_number': 12},
            {'player_first_name': 'Ailís', 'player_last_name': 'Ethna', 'player_number': 13},
            {'player_first_name': 'Clodagh', 'player_last_name': 'Síle', 'player_number': 14},
            {'player_first_name': 'Meave', 'player_last_name': 'Concepta', 'player_number': 15},
            {'player_first_name': 'Máire', 'player_last_name': 'Nuala', 'player_number': 16},
            {'player_first_name': 'Siobhán', 'player_last_name': 'Gráinne', 'player_number': 17},
            {'player_first_name': 'Caitríona', 'player_last_name': 'Róisín', 'player_number': 18},
            {'player_first_name': 'Eimear', 'player_last_name': 'Sorcha', 'player_number': 19},
            {'player_first_name': 'Aisling', 'player_last_name': 'Niamh', 'player_number': 20},
            {'player_first_name': 'Caoimhe', 'player_last_name': 'Síofra', 'player_number': 21},
            {'player_first_name': 'Síle', 'player_last_name': 'Niamh', 'player_number': 22},
        ]

        try:
            with transaction.atomic():
                team = Team.objects.create(team_name='Default Team', user=instance)
                players = [Player(player_first_name=data['player_first_name'], player_last_name=data['player_last_name'], player_number=data['player_number'], player_team=team, user=instance) for data in player_data]
                Player.objects.bulk_create(players)
        except Exception as e:
            logger.exception("An error occurred while creating default team and players: %s", str(e))
