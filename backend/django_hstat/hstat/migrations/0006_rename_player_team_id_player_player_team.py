# Generated by Django 5.0.2 on 2024-03-26 09:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hstat', '0005_rename_player_team_player_player_team_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='player_team_id',
            new_name='player_team',
        ),
    ]
