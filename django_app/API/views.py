# Create your views here.
from .models import User, Tag, Category, Post, Comment
from .serializers import *
from rest_framework import status, authentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from django.utils import timezone
from django.conf import settings

# json count default: 10

class APIRoot(APIView): # API Root
    permission_classes = [AllowAny]
    def get(self, request, format=None): # API Root
        return Response({
            'v1': {
                'token-auth': {
                    'method' : ['POST'],
                    'url' : '/api/v1/auth/',
                },
                'register': {
                    'method' : ['POST'],
                    'url' : '/api/v1/auth/register/',
                },
                'login' : {
                    'method' : ['POST'],
                    'url' : '/api/v1/auth/login/',
                },
                'logout' : {
                    'method' : ['POST'],
                    'url' : '/api/v1/auth/logout/', 
                },
                'refresh' : {
                    'method' : ['POST'],
                    'url' : '/api/v1/auth/refresh/',
                },
                'userlist' : {
                    'method' : ['GET'],
                    'url' : '/api/v1/user/',
                },
                'userdetail' : {
                    'method' : ['GET', 'PUT', 'POST'],
                    'url' : '/api/v1/user/<str:userid>/',
                },
                'taglist' : {
                    'method' : ['GET', 'POST'],
                    'url' : '/api/v1/tag/',
                },
                'tagdetail' : {
                    'method' : ['GET', 'PUT', 'DELETE'],
                    'url' : '/api/v1/tag/<int:tagid>/',
                },
                'categorylist' : {
                    'method' : ['GET', 'POST'],
                    'url' : '/api/v1/category/',
                },
                'categorydetail' : {
                    'method' : ['GET', 'PUT', 'DELETE'],
                    'url' : '/api/v1/category/<int:categoryid>/',
                },
                'postlist' : {
                    'method' : ['GET', 'POST'],
                    'url' : '/api/v1/post/',
                },
                'postdetail' : {
                    'method' : ['GET', 'PUT', 'DELETE'],
                    'url' : '/api/v1/post/<int:postid>/',
                },
                'commentlist' : {
                    'method' : ['GET', 'POST'],
                    'url' : '/api/v1/comment/',
                },
                'commentdetail' : {
                    'method' : ['GET', 'PUT', 'DELETE'],
                    'url' : '/api/v1/comment/<int:commentid>/',
                },
            }
        })

class RegisterAPI(APIView): # 회원가입 API
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    def post(self, request, format=None): # [POST] 회원가입 (Required Fields : userid, nickname, email, password)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        user = serializer.save()
        
        token = TokenObtainPairSerializer().get_token(user) # 토큰 발급
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = Response({
            "code" : status.HTTP_201_CREATED,
            "message" : "회원가입에 성공했습니다.",
            "user" : {
                "userid" : user.userid,
                "nickname" : user.nickname,
                "email" : user.email,
                "created_at" : user.created_at,
                "is_active" : user.is_active,
            },
            "token": {
                "refresh": refresh_token,
                "access": access_token,
            }
        }, status=status.HTTP_201_CREATED)
        res.set_cookie('access_token', access_token, httponly=True)
        res.set_cookie('refresh_token', refresh_token, httponly=True)
        return res

class LoginAPI(APIView): # 로그인 API
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    def post(self, request, format=None): # 로그인
        userid = request.data.get('userid')
        password = request.data.get('password')
        
        if(userid == None or password == None):
            return Response({'message': '아이디와 비밀번호를 입력해주세요.'})
        
        user = authentication.authenticate(userid=userid, password=password)
        
        if user is None:
            return Response({'message': '아이디와 비밀번호가 일치하지 않습니다.'})
        
        user.last_login = timezone.now()
        user.save()
        
        token = TokenObtainPairSerializer().get_token(user) # 토큰 발급
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = Response({
            "code" : status.HTTP_200_OK,
            "message" : "로그인 되었습니다.",
            "user" : {
                "userid" : user.userid,
                "nickname" : user.nickname,
                "email" : user.email,
                "updated_at" : user.updated_at,
                "last_login" : user.last_login,
                "is_active" : user.is_active,
            },
            "token": {
                "refresh": refresh_token,
                "access": access_token,
            }
        }, status=status.HTTP_200_OK)
        res.set_cookie('access_token', access_token, httponly=True)
        res.set_cookie('refresh_token', refresh_token, httponly=True)
        return res
    
class UserListAPI(APIView): # 유저 리스트 API
    permission_classes = [IsAdminUser]
    def get(self, request, format=None): # 유저 리스트 가져오기
        filtervalue = {}
        
        nickname = request.query_params.get('nickname')
        email = request.query_params.get('email')
        created_at = request.query_params.get('created_at')
        updated_at = request.query_params.get('updated_at')
        last_login = request.query_params.get('last_login')
        is_active = request.query_params.get('is_active')
        is_admin = request.query_params.get('is_admin')
        
        if nickname != None:
            filtervalue['nickname__contains'] = nickname
        if email != None:
            filtervalue['email__contains'] = email
        if created_at != None:
            filtervalue['created_at__startswith'] = created_at
        if updated_at != None:
            filtervalue['updated_at__startswith'] = updated_at
        if last_login != None:
            filtervalue['last_login__startswith'] = last_login
        if is_active != None:
            filtervalue['is_active'] = is_active
        if is_admin != None:
            filtervalue['is_admin'] = is_admin
        
        if filtervalue == []:
            users = User.objects.all()[:10]
        else:
            users = User.objects.all().filter(**filtervalue)
        
        if users.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})
        
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class UserDetailAPI(APIView): # 유저 디테일 API, 로그인한 자신의 userid 정보만 접근 가능
    permission_classes = [IsAuthenticated]
    def get(self, request, userid, format=None): # 유저 정보 가져오기
        try:
            if request.user.userid == userid:
                user = User.objects.get(userid=userid)
            else:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 회원입니다.'})
        
        serializer = UserExcludePasswordSerializer(user)
        return Response(serializer.data)
    def put(self, request, userid, format=None): # 유저 정보 수정하기 비밀번호 재확인
        try:
            if request.user.userid == userid:
                user = User.objects.get(userid=userid)
            else:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 회원입니다.'})
         
        try:
            checkpassword = request.data['checkpassword']
        except:
            return Response({'message': '회원정보를 수정하려면 비밀번호를 입력해주세요.'})
        
        user = authentication.authenticate(userid=userid, password=checkpassword)

        if user is None:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        request.data['userid'] = userid
        
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.update(user, serializer.validated_data)
        return Response({'message': '회원정보가 수정되었습니다.'})
    def post(self, request, userid, format=None): # 유저 정보 삭제하기 비밀번호 재확인
        try:
            if request.user.userid == userid:
                user = User.objects.get(userid=userid)
            else:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 회원입니다.'})
        
        if userid == settings.UNIQUE_ADMIN:
            return Response({'message': '최초 관리자 계정은 삭제할 수 없습니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
        except:
            return Response({'message': '회원정보를 삭제하려면 비밀번호를 입력해주세요.'})
        
        user = authentication.authenticate(userid=userid, password=checkpassword)
        
        if user is None:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})

        user.delete()
        return Response({'message': '회원정보가 삭제되었습니다.'})

class TagListAPI(APIView): # 태그 리스트 API, 
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None): # 태그 리스트 가져오기
        filtervalue = {}
        
        userid = request.query_params.get('userid')
        tagname = request.query_params.get('tagname')
        created_at = request.query_params.get('created_at')
        updated_at = request.query_params.get('updated_at')
        
        if userid != None:
            filtervalue['userid'] = userid
        if tagname != None:
            filtervalue['tagname__icontains'] = tagname
        if created_at != None:
            filtervalue['created_at__startswith'] = created_at
        if updated_at != None:
            filtervalue['updated_at__startswith'] = updated_at
        
        if filtervalue == []:
            tags = Tag.objects.all()[:10]
        else:
            tags = Tag.objects.all().filter(**filtervalue)
        
        if tags.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})
        
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)
    def post(self, request, format=None): # 태그 생성하기, 누가 태그를 생성했는지 기록
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.validated_data['madeby'] = request.user.userid
        serializer.save()
        return Response({'message': '태그가 생성되었습니다.'})

class TagDetailAPI(APIView): # 태그 디테일 API, 자신이 생성한 태그만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, tagid, format=None): # 태그 정보 가져오기
        try:
            tag = Tag.objects.get(tagid=tagid)
        except:
            return Response({'message': '존재하지 않는 태그입니다.'})
        
        serializer = TagSerializer(tag)
        return Response(serializer.data)
    def put(self, request, tagid, format=None): # 태그 정보 수정하기
        try:
            tag = Tag.objects.get(tagid=tagid)
            if request.user.userid != tag.madeby:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 태그입니다.'})
        
        serializer = TagSerializer(tag, data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.save()
        return Response({'message': '태그가 수정되었습니다.'})
    def delete(self, request, tagid, format=None): # 태그 정보 삭제하기
        try:
            tag = Tag.objects.get(tagid=tagid)
            if request.user.userid != tag.madeby:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 태그입니다.'})
        
        tag.delete()
        return Response({'message': '태그가 삭제되었습니다.'})

class CategoryListAPI(APIView): # 카테고리 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None): # 카테고리 리스트 가져오기
        filtervalue = {}
        
        userid = request.query_params.get('userid')
        categoryname = request.query_params.get('categoryname')
        created_at = request.query_params.get('created_at')
        updated_at = request.query_params.get('updated_at')
        
        if userid != None:
            filtervalue['userid'] = userid
        if categoryname != None:
            filtervalue['categoryname__icontains'] = categoryname
        if created_at != None:
            filtervalue['created_at__startswith'] = created_at
        if updated_at != None:
            filtervalue['updated_at__startswith'] = updated_at
        
        if filtervalue == []:
            categorys = Category.objects.all()[:10]
        else:
            categorys = Category.objects.all().filter(**filtervalue)
        
        if categorys.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})
        
        serializer = CategorySerializer(categorys, many=True)
        return Response(serializer.data)
    def post(self, request, format=None): # 카테고리 생성하기, 누가 카테고리를 생성했는지 기록
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.validated_data['madeby'] = request.user.userid
        serializer.save()
        return Response({'message': '카테고리가 생성되었습니다.'})
    
class CategoryDetailAPI(APIView): # 카테고리 디테일 API, 자신이 생성한 카테고리만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, categoryid, format=None): # 카테고리 정보 가져오기
        try:
            category = Category.objects.get(categoryid=categoryid)
        except:
            return Response({'message': '존재하지 않는 카테고리입니다.'})
        
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    def put(self, request, categoryid, format=None): # 카테고리 정보 수정하기
        try:
            category = Category.objects.get(categoryid=categoryid)
            if request.user.userid != category.madeby:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 카테고리입니다.'})
        
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.save()
        return Response({'message': '카테고리가 수정되었습니다.'})
    def delete(self, request, categoryid, format=None): # 카테고리 정보 삭제하기
        try:
            category = Category.objects.get(categoryid=categoryid)
            if request.user.userid != category.madeby:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 카테고리입니다.'})
        
        category.delete()
        return Response({'message': '카테고리가 삭제되었습니다.'})

class PostListAPI(APIView): # 포스트 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    def get(self, request, format=None): # 포스트 리스트 가져오기
        filtervalue = {}
        
        userid = request.query_params.get('userid')
        categoryid = request.query_params.get('categoryid')
        tagid = request.query_params.get('tagid')
        title = request.query_params.get('title')
        content = request.query_params.get('content')
        created_at = request.query_params.get('created_at')
        updated_at = request.query_params.get('updated_at')
        published_at = request.query_params.get('published_at')
        is_published = request.query_params.get('is_published')
        is_secret = request.query_params.get('is_secret')
        
        if userid != None:
            filtervalue['userid'] = userid
        if categoryid != None:
            filtervalue['categoryid'] = categoryid
        if tagid != None:
            filtervalue['tagid'] = tagid
        if title != None:
            filtervalue['title__icontains'] = title
        if content != None:
            filtervalue['content__icontains'] = content
        if created_at != None:
            filtervalue['created_at__startswith'] = created_at
        if updated_at != None:
            filtervalue['updated_at__startswith'] = updated_at
        if published_at != None:
            filtervalue['published_at__startswith'] = published_at
        if is_published != None:
            filtervalue['is_published'] = is_published
        if is_secret != None:
            filtervalue['is_secret'] = is_secret
        
        if filtervalue == []:
            posts = Post.objects.all()[:10]
        else:
            posts = Post.objects.all().filter(**filtervalue)
        
        if posts.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})
        
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    def post(self, request, format=None): # 포스트 생성하기
        request.data['userid'] = request.user.userid
        serializer = PostSerializer(data=request.data)

        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.save()
        return Response({'message': '포스트가 생성되었습니다.'})
    
class PostDetailAPI(APIView): # 포스트 디테일 API, 자신이 생성한 포스트만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, postid, format=None): # 포스트 정보 가져오기
        try:
            post = Post.objects.get(postid=postid)
        except:
            return Response({'message': '존재하지 않는 포스트입니다.'})
        
        serializer = PostSerializer(post)
        return Response(serializer.data)
    def put(self, request, postid, format=None): # 포스트 정보 수정하기
        try:
            post = Post.objects.get(postid=postid)
            if request.user.userid != post.userid.userid:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 포스트입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
        except:
            return Response({'message': '포스트를 수정하려면 비밀번호를 입력해주세요.'})
        
        user = authentication.authenticate(userid=request.user.userid, password=checkpassword)

        if user is None:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.save()
        return Response({'message': '포스트가 수정되었습니다.'})
    def delete(self, request, postid, format=None): # 포스트 정보 삭제하기
        try:
            post = Post.objects.get(postid=postid)
            if request.user.userid != post.userid.userid:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 포스트입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
        except:
            return Response({'message': '포스트를 삭제하려면 비밀번호를 입력해주세요.'})
        
        user = authentication.authenticate(userid=request.user.userid, password=checkpassword)

        if user is None:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        post.delete()
        return Response({'message': '포스트가 삭제되었습니다.'})

class CommentListAPI(APIView): # 댓글 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None): # 댓글 리스트 가져오기
        filtervalue = {}
        
        userid = request.query_params.get('userid')
        postid = request.query_params.get('postid')
        content = request.query_params.get('content')
        created_at = request.query_params.get('created_at')
        updated_at = request.query_params.get('updated_at')
        is_secret = request.query_params.get('is_secret')
        
        if userid != None:
            filtervalue['userid'] = userid
        if postid != None:
            filtervalue['postid'] = postid
        if content != None:
            filtervalue['content__icontains'] = content
        if created_at != None:
            filtervalue['created_at__startswith'] = created_at
        if updated_at != None:
            filtervalue['updated_at__startswith'] = updated_at
        if is_secret != None:
            filtervalue['is_secret'] = is_secret
        
        if filtervalue == []:
            comments = Comment.objects.all()[:10]
        else:
            comments = Comment.objects.all().filter(**filtervalue)
        
        if comments.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})
        
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    def post(self, request, format=None): # 댓글 생성하기
        request.data['userid'] = request.user.userid
        serializer = CommentSerializer(data=request.data)
        
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.save()
        return Response({'message': '댓글이 생성되었습니다.'})
    
class CommentDetailAPI(APIView): # 댓글 디테일 API, 자신이 생성한 댓글만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, commentid, format=None): # 댓글 정보 가져오기
        try:
            comment = Comment.objects.get(commentid=commentid)
        except:
            return Response({'message': '존재하지 않는 댓글입니다.'})
        
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    def put(self, request, commentid, format=None): # 댓글 정보 수정하기
        try:
            comment = Comment.objects.get(commentid=commentid)
            if request.user.userid != comment.userid.userid:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 댓글입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
        except:
            return Response({'message': '댓글을 수정하려면 비밀번호를 입력해주세요.'})
        
        user = authentication.authenticate(userid=request.user.userid, password=checkpassword)

        if user is None:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.save()
        return Response({'message': '댓글이 수정되었습니다.'})
    def delete(self, request, commentid, format=None): # 댓글 정보 삭제하기
        try:
            comment = Comment.objects.get(commentid=commentid)
            if request.user.userid != comment.userid.userid:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 댓글입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
        except:
            return Response({'message': '댓글을 삭제하려면 비밀번호를 입력해주세요.'})
        
        user = authentication.authenticate(userid=request.user.userid, password=checkpassword)

        if user is None:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        comment.delete()
        return Response({'message': '댓글이 삭제되었습니다.'})
