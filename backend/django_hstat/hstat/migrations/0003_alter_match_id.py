# Generated by Django 5.0.2 on 2024-04-03 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hstat', '0002_match_matchevent_player_team_delete_useraccount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
