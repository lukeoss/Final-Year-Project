@echo off

REM Stop any running Docker containers
docker-compose down

REM Rebuild the Docker images for both frontend and backend services
docker-compose build --no-cache

REM Start the Docker containers
docker-compose up -d

pause