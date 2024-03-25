# Generated by Django 5.0.2 on 2024-03-25 21:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hstat', '0003_rename_player_players_rename_team_teams'),
    ]

    operations = [
        migrations.CreateModel(
            name='Team',
            fields=[
                ('team_id', models.AutoField(primary_key=True, serialize=False)),
                ('team_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('player_id', models.AutoField(primary_key=True, serialize=False)),
                ('player_first_name', models.CharField(max_length=100)),
                ('player_last_name', models.CharField(max_length=100)),
                ('player_number', models.IntegerField()),
                ('player_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='players', to='hstat.team')),
            ],
        ),
        migrations.DeleteModel(
            name='Players',
        ),
        migrations.DeleteModel(
            name='Teams',
        ),
    ]
