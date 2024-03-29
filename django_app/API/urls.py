from django.urls import path, include

from API.views import *
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView, TokenVerifyView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', APIRoot.as_view()),
    path('image/', ImageUploadAPI.as_view()),
    path('serverinfo/', ServerInfoAPI.as_view()),
    path('health/', include('health_check.urls')),
    path('control/history/', ControlHistroyAPI.as_view()),
    path('auth/', TokenVerifyView.as_view()),
    path('auth/register/', RegisterAPI.as_view()),
    path('auth/login/', LoginAPI.as_view()),
    path('auth/logout/', TokenBlacklistView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('user/', UserListAPI.as_view()),
    path('user/<str:userid>/', UserDetailAPI.as_view()),
    path('tag/', TagListAPI.as_view()),
    path('tag/<str:tagid>/', TagDetailAPI.as_view()),
    path('category/', CategoryListAPI.as_view()),
    path('category/<str:categoryid>/', CategoryDetailAPI.as_view()),
    path('post/', PostListAPI.as_view()),
    path('post/<int:postid>/', PostDetailAPI.as_view()),
    path('comment/', CommentListAPI.as_view()),
    path('comment/<int:commentid>', CommentDetailAPI.as_view()),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)