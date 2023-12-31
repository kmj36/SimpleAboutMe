from django.urls import path

from . import views
from API.views import *

urlpatterns = [
    path('', APIRoot.as_view()),
    path('user/', UserListAPI.as_view()),
    path('user/<str:userid>/', UserDetailAPI.as_view()),
    path('tag/', TagListAPI.as_view()),
    path('tag/<int:tagid>/', TagDetailAPI.as_view()),
    path('category/', CategoryListAPI.as_view()),
    path('category/<int:categoryid>/', CategoryDetailAPI.as_view()),
    path('post/', PostListAPI.as_view()),
    path('post/<int:postid>/', PostDetailAPI.as_view()),
    path('comment/', CommentListAPI.as_view()),
    path('comment/<int:commentid>/', CommentDetailAPI.as_view()),
]