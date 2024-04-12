cd C:\Users\lukeo\Desktop\ProjectFolder\frontend
call npm run build
PowerShell -Command "Remove-Item -Path '..\backend\django_hstat\django_hstat\build' -Recurse -Force"
PowerShell -Command "Move-Item -Path 'build' -Destination '..\backend\django_hstat\django_hstat\'"
call heroku container:login
cd C:\Users\lukeo\Desktop\ProjectFolder\backend
call heroku container:push web --app gaastat
call heroku container:release web --app gaastat
pause