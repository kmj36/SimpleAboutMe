from django.urls import path

from API.views import *
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView, TokenVerifyView

urlpatterns = [
    path('', APIRoot.as_view()),
    path('auth/', TokenVerifyView.as_view()),
    path('auth/register/', RegisterAPI.as_view()),
    path('auth/login/', LoginAPI.as_view()),
    path('auth/logout/', TokenBlacklistView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('user/', UserListAPI.as_view()),
    path('user/<str:userid>/', UserDetailAPI.as_view()),
    path('tag/', TagListAPI.as_view()),
    path('tag/<int:tagid>/', TagDetailAPI.as_view()),
    path('category/', CategoryListAPI.as_view()),
    path('category/<int:categoryid>/', CategoryDetailAPI.as_view()),
    path('post/', PostListAPI.as_view()),
    path('post/<int:postid>/', PostDetailAPI.as_view()),
    path('comment/', CommentListAPI.as_view()),
    path('comment/<int:commentid>', CommentDetailAPI.as_view()),
]