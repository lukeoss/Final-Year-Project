# utils.py
from .models import Player, MatchEvent

def get_player_statistics(player_id):
    player = Player.objects.get(id=player_id)
    total_shots = player.total_shots_taken()

    return {
        "total_shots": total_shots,
        # Add more statistics as needed
    }
