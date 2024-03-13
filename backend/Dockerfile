FROM python:3.10.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . ./

RUN pip install --upgrade pip \
    && pip install -r requirements.txt

CMD python django_hstat/manage.py migrate --noinput && python django_hstat/manage.py runserver 0.0.0.0:8000