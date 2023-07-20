from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpResponse
from .models import User, Tag, Category, Post, Comment
from .serializers import UserSerializer, TagSerializer, CategorySerializer, PostSerializer, CommentSerializer
from rest_framework.views import APIView

class Home(APIView):
    def get(self, request, format=None):
        return Response({
                'v1' : '/api/',
            })

class APIRoot(APIView):
    def get(self, request, format=None): # API Root
        return Response({
            'user': '/api/user/',
            'tag': '/api/tag/',
            'category': '/api/category/',
            'post': '/api/post/',
            'postDetail': '/api/post/[postid]/',
            'comment': '/api/comment/',
        })

class UserListAPI(APIView): # 유저 리스트 API
    def get(self, request, format=None): # 유저 리스트 가져오기
        try:
            users = User.objects.all()
        except:
            return Response({'message': '리스트를 가져오는데 실패했습니다.'})
        
        if users.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})
        
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    def post(self, request, format=None): # 유저 생성하기
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.save()
        return Response({'message': '회원가입이 완료되었습니다.'})
    
class UserDetailAPI(APIView): # 유저 디테일 API
    def get(self, request, userid, format=None): # 유저 정보 가져오기
        try:
            user = User.objects.get(userid=userid)
        except:
            return Response({'message': '존재하지 않는 회원입니다.'})
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
    def put(self, request, userid, format=None): # 유저 정보 수정하기 비밀번호 재확인
        try:
            user = User.objects.get(userid=userid)
        except:
            return Response({'message': '존재하지 않는 회원입니다.'})
         
        try:
            checkpassword = request.data['checkpassword']
        except:
            return Response({'message': '회원정보를 수정하려면 비밀번호를 입력해주세요.'})
        
        if user.password != checkpassword:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)

        serializer.save()
        return Response({'message': '회원정보가 수정되었습니다.'})
    def post(self, request, userid, format=None): # 유저 정보 삭제하기 비밀번호 재확인
        try:
            user = User.objects.get(userid=userid)
        except:
            return Response({'message': '존재하지 않는 회원입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
        except:
            return Response({'message': '회원정보를 삭제하려면 비밀번호를 입력해주세요.'})
        
        if user.password != checkpassword:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})

        user.delete()
        return Response({'message': '회원정보가 삭제되었습니다.'})

class TagListAPI(APIView):
    def get(self, request, format=None): # 태그 리스트 가져오기
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

class CategoryListAPI(APIView):
    def get(self, request, format=None): # 카테고리 리스트 가져오기
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class PostListAPI(APIView):
    def get(self, request, format=None): # 포스트 리스트 가져오기
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
class PostDetailAPI(APIView):
    def get(self, request, postid, format=None):
        post = Post.objects.get(postid=postid)
        serializer = PostSerializer(post)
        return Response(serializer.data)

class CommentListAPI(APIView):
    def get(self, request, format=None): # 댓글 리스트 가져오기
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)