"""
URL configuration for django_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path
from API.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Home.as_view()),
    path('api/', APIRoot.as_view()),
    path('api/user/', UserListAPI.as_view()),
    path('api/user/<str:userid>/', UserDetailAPI.as_view()),
    path('api/tag/', TagListAPI.as_view()),
    path('api/tag/<int:tagid>/', TagDetailAPI.as_view()),
    path('api/category/', CategoryListAPI.as_view()),
    path('api/category/<int:categoryid>/', CategoryDetailAPI.as_view()),
    path('api/post/', PostListAPI.as_view()),
    path('api/post/<int:postid>/', PostDetailAPI.as_view()),
    path('api/comment/', CommentListAPI.as_view()),
]
