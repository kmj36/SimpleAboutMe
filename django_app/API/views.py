from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework.response import Response
from .models import User, Tag, Category, Post, Comment
from .serializers import UserSerializer, TagSerializer, CategorySerializer, PostSerializer, CommentSerializer
from rest_framework.views import APIView

class UserListAPI(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class TagListAPI(APIView):
    def get(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

class CategoryListAPI(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class PostListAPI(APIView):
    def get(self, request):
        page = request.GET.get('page')
        if page:
            post = Post.objects.get(postid=page)
            serializer = PostSerializer(post)
        else:
            posts = Post.objects.all()
            serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

class CommentListAPI(APIView):
    def get(self, request):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)