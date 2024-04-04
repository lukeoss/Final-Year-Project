# apps.py
from django.apps import AppConfig

class HstatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'hstat'
    
    def ready(self):
        import hstat.signals
