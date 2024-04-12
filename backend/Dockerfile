FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code 

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt
COPY ./django_hstat /code 

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD gunicorn django_hstat.wsgi:application --bind 0.0.0.0:$PORT