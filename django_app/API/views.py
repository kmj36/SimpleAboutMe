# Create your views here.
from .models import User, Tag, Category, Post, Comment
from .serializers import *
from rest_framework import status, authentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.conf import settings

# json count default: 10

class APIRoot(APIView): # API Root
    permission_classes = [AllowAny]
    def get(self, request, format=None): # API Root
        return Response({
            'code' : status.HTTP_200_OK,
            'message' : 'API 경로',
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
        }, status=status.HTTP_200_OK)

class RegisterAPI(APIView): # 회원가입 API 
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    def post(self, request, format=None): # [POST] 회원가입 (Required Fields : userid, nickname, email, password)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.create(validated_data=serializer.validated_data)
        
        token = TokenObtainPairSerializer().get_token(user) # 토큰 발급
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = Response({
            "code" : status.HTTP_201_CREATED,
            "message" : user.userid + " 회원가입에 성공했습니다.",
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
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : "아이디와 비밀번호를 입력해주세요."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authentication.authenticate(userid=userid, password=password)
        
        if user is None:
            return Response({
                "code" : status.HTTP_401_UNAUTHORIZED,
                "message" : "아이디와 비밀번호가 일치하지 않습니다."
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        user.last_login = timezone.now()
        user.save()
        
        token = TokenObtainPairSerializer().get_token(user) # 토큰 발급
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = Response({
            "code" : status.HTTP_200_OK,
            "message" : user.userid + " 로그인 되었습니다.",
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
    serializer_class = UserSerializer
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
            return Response({
                "code": status.HTTP_204_NO_CONTENT,
                "message": "리스트가 비어 있습니다."
            }, status=status.HTTP_204_NO_CONTENT)
        
        serializer = UserSerializer(users, many=True)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "유저 리스트 조회되었습니다.",
            "users" : serializer.data,
        }, status=status.HTTP_200_OK)
    
class UserDetailAPI(APIView): # 유저 디테일 API, 로그인한 자신의 userid 정보만 접근 가능
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get(self, request, userid, format=None): # 유저 정보 가져오기
        try:
            user = User.objects.get(userid=userid)
            if request.user.userid != userid:
                return Response({
                    "code" : status.HTTP_401_UNAUTHORIZED,
                    "message" : "접근 권한이 없습니다."
                }, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message": "존재하지 않는 회원입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(instance=user)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : serializer.data['userid'] + " 유저 조회되었습니다.",
            "user" : {
                "userid": serializer.data['userid'],
                "is_superuser": serializer.data['is_superuser'],
                "nickname": serializer.data['nickname'],
                "email": serializer.data['email'],
                "created_at": serializer.data['created_at'],
                "updated_at": serializer.data['updated_at'],
                "last_login": serializer.data['last_login'],
                "is_active": serializer.data['is_active'],
            },
        }, status=status.HTTP_200_OK)
    serializer_class = UserDetailSerializer
    def put(self, request, userid, format=None): # 유저 정보 수정하기 비밀번호 재확인
        try:
            user = User.objects.get(userid=userid)
            if request.user.userid != userid:
                return Response({
                    "code" : status.HTTP_401_UNAUTHORIZED,
                    "message" : "접근 권한이 없습니다."
                }, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message": "존재하지 않는 회원입니다."
            }, status=status.HTTP_404_NOT_FOUND)
            
        current_password = request.data.get('currentpassword')
        change_password = request.data.get('changepassword')
        change_password2 = request.data.get('changepassword2')
        
        if current_password == None or change_password == None or change_password2 == None:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : "현재 비밀번호와 변경할 비밀번호를 입력해주세요."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authentication.authenticate(userid=userid, password=current_password)

        if user is None:
            return Response({
                "code" : status.HTTP_401_UNAUTHORIZED,
                "message" : "비밀번호가 일치하지 않습니다."
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        modifydata = request.data
        modifydata._mutable = True
        modifydata['userid'] = request.user.userid
        modifydata['password'] = change_password2
        modifydata._mutable = False
        
        UserDetailSerializer(instance=modifydata).validate(data=modifydata)
        
        serializer = UserSerializer(instance=user, data=modifydata)
        if serializer.is_valid() == False:
            return Response({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        changeddata = serializer.update(instance=user, validated_data=serializer.validated_data)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "회원정보가 수정되었습니다.",
            "user" : {
                "userid" : changeddata.userid,
                "nickname" : changeddata.nickname,
                "email" : changeddata.email,
                "updated_at" : changeddata.updated_at,
                "is_active" : changeddata.is_active,
            }
        }, status=status.HTTP_200_OK)
    def post(self, request, userid, format=None): # 유저 정보 삭제하기 비밀번호 재확인
        try:
            user = User.objects.get(userid=userid)
            if request.user.userid != userid:
                return Response({
                    "code" : status.HTTP_401_UNAUTHORIZED,
                    "message" : "접근 권한이 없습니다."
                }, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message": "존재하지 않는 회원입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        if userid == settings.UNIQUE_ADMIN:
            return Response({
                "code" : status.HTTP_403_FORBIDDEN,
                "message" : "최초 관리자 계정은 삭제할 수 없습니다."
            }, status=status.HTTP_403_FORBIDDEN)
        
        checkpassword = request.data.get('currentpassword')
        if checkpassword is None:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : "회원정보를 삭제하려면 현재 비밀번호를 입력해주세요."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authentication.authenticate(userid=userid, password=checkpassword)
        
        if user is None:
            return Response({
                "code" : status.HTTP_401_UNAUTHORIZED,
                "message" : "비밀번호가 일치하지 않습니다."
            }, status=status.HTTP_401_UNAUTHORIZED)

        tempuserid = user.userid
        user.delete()
        return Response({
            "code" : status.HTTP_200_OK,
            "message": tempuserid + " 회원정보가 삭제되었습니다."
        }, status=status.HTTP_200_OK)

class TagListAPI(APIView): # 태그 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = TagSerializer
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
            return Response({
                "code" : status.HTTP_204_NO_CONTENT,
                'message': '리스트가 비어 있습니다.'
            }, status=status.HTTP_204_NO_CONTENT)
        
        serializer = TagSerializer(instance=tags, many=True)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "태그 리스트 조회되었습니다.",
            "tags" : serializer.data
        }, status=status.HTTP_200_OK)
    def post(self, request, format=None): # 태그 생성하기, 누가 태그를 생성했는지 기록
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.validated_data['userid'] = request.user
        serializer.save()
        return Response({
            "code" : status.HTTP_201_CREATED,
            "message" : "태그가 생성되었습니다.",
            "tag" : serializer.data
        }, status=status.HTTP_201_CREATED)

class TagDetailAPI(APIView): # 태그 디테일 API, 자신이 생성한 태그만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = TagSerializer
    def get(self, request, tagid, format=None): # 태그 정보 가져오기
        try:
            tag = Tag.objects.get(tagid=tagid)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 태그입니다."
            }, status.HTTP_404_NOT_FOUND)
        
        serializer = TagSerializer(instance=tag)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "태그 조회되었습니다.",
            "tag" : serializer.data
        }, status=status.HTTP_200_OK)
    def put(self, request, tagid, format=None): # 태그 정보 수정하기
        try:
            tag = Tag.objects.get(tagid=tagid)
            if request.user.userid != tag.userid.userid:
                return Response({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "message" : "접근 권한이 없습니다."
                }, status.HTTP_403_FORBIDDEN)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 태그입니다."
            }, status.HTTP_404_NOT_FOUND)
        
        serializer = TagSerializer(instance=tag, data=request.data)
        if serializer.is_valid() == False:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.update(instance=tag, validated_data=serializer.validated_data)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : str(serializer.data['tagid']) + " 태그가 수정되었습니다.",
            "tag" : serializer.data
        }, status=status.HTTP_200_OK)
    def delete(self, request, tagid, format=None): # 태그 정보 삭제하기
        try:
            tag = Tag.objects.get(tagid=tagid)
            if request.user.userid != tag.userid.userid:
                return Response({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "message" : "접근 권한이 없습니다."
                }, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 태그입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        temptagname = tag.tagname
        tag.delete()
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : str(tagid) + " " + temptagname + " 태그가 삭제되었습니다."
        }, status=status.HTTP_200_OK)

class CategoryListAPI(APIView): # 카테고리 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
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
            return Response({
                "code" : status.HTTP_204_NO_CONTENT,
                "message" : "리스트가 비어 있습니다."
            }, status=status.HTTP_204_NO_CONTENT)
        
        serializer = CategorySerializer(instance=categorys, many=True)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "카테고리 리스트 조회되었습니다.",
            "categories" : serializer.data
        }, status=status.HTTP_200_OK)
    def post(self, request, format=None): # 카테고리 생성하기, 누가 카테고리를 생성했는지 기록
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.validated_data['userid'] = request.user
        serializer.save()
        return Response({
            "code" : status.HTTP_201_CREATED,
            "message": "카테고리가 생성되었습니다.",
            "category" : serializer.data
        }, status=status.HTTP_201_CREATED)
    
class CategoryDetailAPI(APIView): # 카테고리 디테일 API, 자신이 생성한 카테고리만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    def get(self, request, categoryid, format=None): # 카테고리 정보 가져오기
        try:
            category = Category.objects.get(categoryid=categoryid)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 카테고리입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CategorySerializer(instance=category)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "카테고리 조회되었습니다.",
            "category" : serializer.data
        }, status=status.HTTP_200_OK)
    def put(self, request, categoryid, format=None): # 카테고리 정보 수정하기
        try:
            category = Category.objects.get(categoryid=categoryid)
            if request.user.userid != category.userid.userid:
                return Response({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "message" : "접근 권한이 없습니다."
                }, status.HTTP_403_FORBIDDEN)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 카테고리입니다."
            }, status.HTTP_404_NOT_FOUND)
        
        serializer = CategorySerializer(instance=category, data=request.data)
        if serializer.is_valid() == False:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.update(instance=category, validated_data=serializer.validated_data)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : str(serializer.data['categoryid']) + " 카테고리가 수정되었습니다.",
            "tag" : serializer.data
        }, status=status.HTTP_200_OK)
    def delete(self, request, categoryid, format=None): # 카테고리 정보 삭제하기
        try:
            category = Category.objects.get(categoryid=categoryid)
            if request.user.userid != category.userid.userid:
                return Response({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "message" : "접근 권한이 없습니다."
                }, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 카테고리입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        tempcategoryname = category.categoryname
        category.delete()
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : str(categoryid) + " " + tempcategoryname + " 카테고리가 삭제되었습니다."
        }, status=status.HTTP_200_OK)

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
            return Response({
                "code" : status.HTTP_204_NO_CONTENT,
                "message" : "리스트가 비어 있습니다."
            }, status=status.HTTP_204_NO_CONTENT)
        
        serializer = PostSerializer(instance=posts, many=True)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "포스트 리스트 조회되었습니다.",
            "posts" : serializer.data
        }, status=status.HTTP_200_OK)
    def post(self, request, format=None): # 포스트 생성하기
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.validated_data['userid'] = request.user
        if serializer.validated_data.get('is_published') == True and serializer.validated_data.get('published_at') == None:
            serializer.validated_data['published_at'] = timezone.now()
        else:
            serializer.validated_data['published_at'] = None

        if serializer.validated_data.get('is_secret') == True:
            if serializer.validated_data.get('secret_password') == "":
                return Response({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "message" : "비밀글을 작성하려면 비밀번호를 입력해주세요."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not serializer.validated_data.get('secret_password').startswith('pbkdf2_sha256$'):
                serializer.validated_data['secret_password'] = make_password(serializer.validated_data['secret_password'])

        serializer.save()
        return Response({
            "code" : status.HTTP_201_CREATED,
            "message": "포스트가 생성되었습니다.",
            "post" : serializer.data
        }, status=status.HTTP_201_CREATED)
    
class PostDetailAPI(APIView): # 포스트 디테일 API, 자신이 생성한 포스트만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    def get(self, request, postid, format=None): # 포스트 정보 가져오기
        try:
            post = Post.objects.get(postid=postid)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 포스트입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PostSerializer(instance=post)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "포스트 조회되었습니다.",
            "post" : serializer.data
        }, status=status.HTTP_200_OK)
    def put(self, request, postid, format=None): # 포스트 정보 수정하기
        try:
            post = Post.objects.get(postid=postid)
            if request.user.userid != post.userid.userid:
                return Response({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "message" : "접근 권한이 없습니다."
                }, status.HTTP_403_FORBIDDEN)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 포스트입니다."
            }, status.HTTP_404_NOT_FOUND)
        
        serializer = PostSerializer(instance=post, data=request.data)
        if serializer.is_valid() == False:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer.validated_data['userid'] = request.user
        if serializer.validated_data.get('is_published') == True and serializer.validated_data.get('published_at') == None:
            serializer.validated_data['published_at'] = timezone.now()
        else:
            serializer.validated_data['published_at'] = None

        if serializer.validated_data.get('is_secret') == True:
            if serializer.validated_data.get('secret_password') == "":
                return Response({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "message" : "비밀글을 작성하려면 비밀번호를 입력해주세요."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not serializer.validated_data.get('secret_password').startswith('pbkdf2_sha256$'):
                serializer.validated_data['secret_password'] = make_password(serializer.validated_data['secret_password'])
        
        serializer.update(instance=post, validated_data=serializer.validated_data)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : str(serializer.data['postid']) + " 포스트가 수정되었습니다.",
            "post" : serializer.data
        }, status=status.HTTP_200_OK)
    def delete(self, request, postid, format=None): # 포스트 정보 삭제하기
        try:
            post = Post.objects.get(postid=postid)
            if request.user.userid != post.userid.userid:
                return Response({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "message" : "접근 권한이 없습니다."
                }, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 포스트입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        tempposttitle = post.title
        post.delete()
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : str(postid) + " " + tempposttitle + " 포스트가 삭제되었습니다."
        }, status=status.HTTP_200_OK)

class CommentListAPI(APIView): # 댓글 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
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
            return Response({
                "code" : status.HTTP_204_NO_CONTENT,
                "message" : "리스트가 비어 있습니다."
            }, status=status.HTTP_204_NO_CONTENT)
        
        serializer = CommentSerializer(instance=comments, many=True)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "댓글 리스트 조회되었습니다.",
            "comment" : serializer.data
        }, status=status.HTTP_200_OK)
    def post(self, request, format=None): # 댓글 생성하기
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.validated_data['userid'] = request.user
        serializer.save()
        return Response({
            "code" : status.HTTP_201_CREATED,
            "message": "댓글이 생성되었습니다.",
            "category" : serializer.data
        }, status=status.HTTP_201_CREATED)
    
class CommentDetailAPI(APIView): # 댓글 디테일 API, 자신이 생성한 댓글만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    def get(self, request, commentid, format=None): # 댓글 정보 가져오기
        try:
            comment = Comment.objects.get(commentid=commentid)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 댓글입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CommentSerializer(instance=comment)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : "댓글 조회되었습니다.",
            "comment" : serializer.data
        }, status=status.HTTP_200_OK)
    def put(self, request, commentid, format=None): # 댓글 정보 수정하기
        try:
            comment = Comment.objects.get(commentid=commentid)
            if request.user.userid != comment.userid.userid:
                return Response({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "message" : "접근 권한이 없습니다."
                }, status.HTTP_403_FORBIDDEN)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 댓글입니다."
            }, status.HTTP_404_NOT_FOUND)
        
        serializer = CommentSerializer(instance=comment, data=request.data)
        if serializer.is_valid() == False:
            return Response({
                "code" : status.HTTP_400_BAD_REQUEST,
                "message" : serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.update(instance=comment, validated_data=serializer.validated_data)
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : str(serializer.data['commentid']) + " 댓글이 수정되었습니다.",
            "comment" : serializer.data
        }, status=status.HTTP_200_OK)
    def delete(self, request, commentid, format=None): # 댓글 정보 삭제하기
        try:
            comment = Comment.objects.get(commentid=commentid)
            if request.user.userid != comment.userid.userid:
                return Response({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "message" : "접근 권한이 없습니다."
                }, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({
                "code" : status.HTTP_404_NOT_FOUND,
                "message" : "존재하지 않는 댓글입니다."
            }, status=status.HTTP_404_NOT_FOUND)
        
        tempcommentcontent = comment.content
        comment.delete()
        return Response({
            "code" : status.HTTP_200_OK,
            "message" : str(commentid) + " " + tempcommentcontent + " 포스트가 삭제되었습니다."
        }, status=status.HTTP_200_OK)
