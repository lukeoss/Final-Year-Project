"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# from hstat.views import test_api
from hstat import views
# from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('hello/', views.hello, name='hello'),
    path('admin/', admin.site.urls),
    # path('test-api/', test_api),
    path('create-account/', views.create_account, name='create_account'),
    path('check-email-exists/', views.check_email_exists, name='check_email_exists'),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/user-info/',views.get_user_info, name='user_info'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
]
