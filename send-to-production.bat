@echo off
SETLOCAL ENABLEEXTENSIONS

rem Build the frontend project
cd C:\Users\lukeo\Desktop\ProjectFolder\frontend
call npm run build

rem Remove the old build directory
PowerShell -Command "Remove-Item -Path '..\backend\django_hstat\django_hstat\build' -Recurse -Force"

rem Move the new build folder
PowerShell -Command "Move-Item -Path 'build' -Destination '..\backend\django_hstat\django_hstat\'"

rem Login to Heroku (This part may require interactive input or be previously logged in)
call heroku container:login

rem Navigate to the backend project folder
cd C:\Users\lukeo\Desktop\ProjectFolder\backend

rem Push and release the container to Heroku (assuming you're already logged in and your session is active)
call heroku container:push web --app gaastat
call heroku container:release web --app gaastat

ENDLOCAL