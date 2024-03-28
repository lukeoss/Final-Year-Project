# Generated by Django 5.0.2 on 2024-03-28 11:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hstat', '0006_rename_player_team_id_player_player_team'),
    ]

    operations = [
        migrations.CreateModel(
            name='Match',
            fields=[
                ('match_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('location', models.CharField(max_length=255)),
                ('competition', models.CharField(max_length=255)),
                ('away_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='away_matches', to='hstat.team')),
                ('home_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='home_matches', to='hstat.team')),
            ],
        ),
        migrations.CreateModel(
            name='MatchEvent',
            fields=[
                ('event_id', models.AutoField(primary_key=True, serialize=False)),
                ('event_type', models.CharField(max_length=255)),
                ('coord_x', models.FloatField()),
                ('coord_y', models.FloatField()),
                ('time', models.TimeField()),
                ('play_direction', models.CharField(max_length=50)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='hstat.match')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hstat.player')),
            ],
        ),
    ]
