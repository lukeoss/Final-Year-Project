# local_settings.py
from .settings import *

DEBUG = True

SECRET_KEY = 'django-insecure-8*#5b1klp(o0ts3y14d$d@463xcc52fmws_ga(*zcnjpnq_b74'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hurlingstat_db',
        'USER': 'django',
        'PASSWORD': 'q98#946,nFwC$~Oxhc@',
        'HOST': 'localhost',    # Docker service name as host
        'PORT': '3306',         # Default MySQL port
    }
}

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CORS_ALLOW_CREDENTIALS = True

SSL_CERTIFICATE_PATH = 'C:/Users/lukeo/Desktop/ProjectFolder/certs/localhost.crt'
SSL_KEY_PATH = 'C:/Users/lukeo/Desktop/ProjectFolder/certs/localhost.key'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']

CORS_ALLOWED_ORIGINS = [
    "https://localhost:3000",
]

CORS_ORIGIN_WHITELIST = [
    "https://localhost:3000",
]



# import urllib.parse

# username = 'django'
# password = 'q98#946,nFwC$~Oxhc@'
# host = 'db'
# port = 3306
# database_name = 'hurlingstat_db'
# encoded_password = urllib.parse.quote(password)

# DATABASE_URL = f'mysql://{username}:{encoded_password}@{host}:{port}/{database_name}'

# DATABASES = {
#     'default': dj_database_url.config(default=DATABASE_URL)
# }

