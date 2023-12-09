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
from .privatejson import PrivateJSON
from .literals import literals
from urllib import parse

# json count default: 10

class APIRoot(APIView): # API Root
    permission_classes = [AllowAny]
    def get(self, request, format=None): # API Root
        return Response(PrivateJSON({
            "code": status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message": "API 버전별 경로입니다.",
            "detail" : "API Root",
            "v1": {
                "token-auth": {
                    "method": [
                        "POST"
                    ],
                    "url": "/api/v1/auth/"
                },
                "register": {
                    "method": [
                        "POST"
                    ],
                    "url": "/api/v1/auth/register/"
                },
                "login": {
                    "method": [
                        "POST"
                    ],
                    "url": "/api/v1/auth/login/"
                },
                "logout": {
                    "method": [
                        "POST"
                    ],
                    "url": "/api/v1/auth/logout/"
                },
                "refresh": {
                    "method": [
                        "POST"
                    ],
                    "url": "/api/v1/auth/refresh/"
                },
                "userlist": {
                    "method": [
                        "GET"
                    ],
                    "url": "/api/v1/user/"
                },
                "userdetail": {
                    "method": [
                        "GET",
                        "PUT",
                        "POST"
                    ],
                    "url": "/api/v1/user/<str:userid>/"
                },
                "taglist": {
                    "method": [
                        "GET",
                        "POST"
                    ],
                    "url": "/api/v1/tag/"
                },
                "tagdetail": {
                    "method": [
                        "GET",
                        "PUT",
                        "DELETE"
                    ],
                    "url": "/api/v1/tag/<str:tagid>/"
                },
                "categorylist": {
                    "method": [
                        "GET",
                        "POST"
                    ],
                    "url": "/api/v1/category/"
                },
                "categorydetail": {
                    "method": [
                        "GET",
                        "PUT",
                        "DELETE"
                    ],
                    "url": "/api/v1/category/<str:categoryid>/"
                },
                "postlist": {
                    "method": [
                        "GET",
                        "POST"
                    ],
                    "url": "/api/v1/post/"
                },
                "postdetail": {
                    "method": [
                        "GET",
                        "PUT",
                        "DELETE"
                    ],
                    "url": "/api/v1/post/<int:postid>/"
                },
                "commentlist": {
                    "method": [
                        "GET",
                        "POST"
                    ],
                    "url": "/api/v1/comment/"
                },
                "commentdetail": {
                    "method": [
                        "GET",
                        "PUT",
                        "DELETE"
                    ],
                    "url": "/api/v1/comment/<int:commentid>/"
                }
            }
        }).get(), status=status.HTTP_200_OK)

class RegisterAPI(APIView): # 회원가입 API
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    def post(self, request, format=None): # [POST] 회원가입 (Required Fields : userid, nickname, email, password)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code": status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.create(validated_data=serializer.validated_data)
        
        returnserializer = UserSerializer(instance=user)
   
        token = TokenObtainPairSerializer().get_token(user) # 토큰 발급
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = Response(PrivateJSON({
            "code" : status.HTTP_201_CREATED,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.REGISTER_SUCCESS,
            "detail" : returnserializer.data.get("userid") + " User Register Success",
            "user" : {
                "userid" : returnserializer.data.get("userid"),
                "nickname" : returnserializer.data.get("nickname"),
                "email" : returnserializer.data.get("email"),
                "created_at" : returnserializer.data.get("created_at"),
                "updated_at" : returnserializer.data.get("updated_at"),
                "is_active" : returnserializer.data.get("is_active"),
                "is_admin" : returnserializer.data.get("is_admin"),
            },
            "token": {
                "refresh": refresh_token,
                "access": access_token,
            }
        }).get(), status=status.HTTP_201_CREATED)
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
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : "userid is None or password is None"
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        user = authentication.authenticate(userid=userid, password=password)
        
        if user is None:
            return Response(PrivateJSON({
                "code" : status.HTTP_401_UNAUTHORIZED,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.AUTH_FAILED,
                "detail" : "userid and password is not match"
            }).get(), status=status.HTTP_401_UNAUTHORIZED)
            
        if user.is_banned == True:
            return Response(PrivateJSON({
                "code" : status.HTTP_401_UNAUTHORIZED,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.AUTH_FAILED,
                "detail" : user.pk + " User is banned"
            }).get(), status=status.HTTP_401_UNAUTHORIZED)
            
        user.last_login = timezone.now()
        user.save()
        
        serializer = UserSerializer(instance=user)
        
        token = TokenObtainPairSerializer().get_token(user) # 토큰 발급
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.LOGIN_SUCCESS,
            "detail" : serializer.data.get("userid") + " User Login Success",
            "user" : {
                "userid" : serializer.data.get("userid"),
                "nickname" : serializer.data.get("nickname"),
                "email" : serializer.data.get("email"),
                "created_at" : serializer.data.get("created_at"),
                "updated_at" : serializer.data.get("updated_at"),
                "last_login" : serializer.data.get("last_login"),
                "is_active" : serializer.data.get("is_active"),
                "is_admin" : serializer.data.get("is_admin"),
            },
            "token": {
                "refresh": refresh_token,
                "access": access_token,
            }
        }).get(), status=status.HTTP_200_OK)
        res.set_cookie('access_token', access_token, httponly=True)
        res.set_cookie('refresh_token', refresh_token, httponly=True)
        return res

class ControlHistroyAPI(APIView): # [관리자] 컨트롤 히스토리 API
    permission_classes = [IsAdminUser]
    serializer_class = ForcedControlSerializer
    def get(self, request, format=None):
        filtervalue = {}
        
        adminid = request.query_params.get('adminid')
        targetid = request.query_params.get('targetid')
        contenttype = request.query_params.get('contenttype')
        contentid = request.query_params.get('contentid')
        reason = request.query_params.get('reason')
        modified_at = request.query_params.get('modified_at')
        is_deleted = request.query_params.get('is_deleted')
        
        if adminid != None:
            filtervalue['adminid'] = adminid
        if targetid != None:
            filtervalue['targetid'] = targetid
        if contenttype != None:
            filtervalue['contenttype'] = contenttype
        if contentid != None:
            filtervalue['contentid'] = contentid
        if reason != None:
            filtervalue['reason__icontains'] = reason
        if modified_at != None:
            filtervalue['modified_at__startswith'] = modified_at
        if is_deleted != None:
            filtervalue['is_deleted'] = is_deleted
        
        if filtervalue == []:
            histories = ForcedControl.objects.all()[:2500]
        else:
            histories = ForcedControl.objects.all().filter(**filtervalue)
        
        serializer = ForcedControlSerializer(histories, many=True)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.LIST_RESPONSE,
            "detail" : "User List",
            "histories" : serializer.data,
        }).get(), status=status.HTTP_200_OK)

class UserListAPI(APIView): # [관리자] 유저 리스트 API (2500 기본값)
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
            users = User.objects.all()[:2500]
        else:
            users = User.objects.all().filter(**filtervalue)
        
        serializer = UserSerializer(users, many=True)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.LIST_RESPONSE,
            "detail" : "User List",
            "users" : serializer.data,
        }).get(), status=status.HTTP_200_OK)
    
class UserDetailAPI(APIView): # 유저 디테일 API, 로그인한 자신의 userid 정보만 접근 가능
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get(self, request, userid, format=None): # 유저 정보 가져오기
        try:
            user = User.objects.get(userid=userid)
            if request.user.userid != user.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status=status.HTTP_403_FORBIDDEN)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` User is not exist.".format(userid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(instance=user)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.INFO_RESPONSE,
            "detail" : serializer.data.get('userid') + " User Detail",
            "user" : {
                "userid" : serializer.data.get("userid"),
                "nickname" : serializer.data.get("nickname"),
                "email" : serializer.data.get("email"),
                "created_at" : serializer.data.get("created_at"),
                "updated_at" : serializer.data.get("updated_at"),
                "last_login" : serializer.data.get("last_login"),
                "is_active" : serializer.data.get("is_active"),
                "is_admin" : serializer.data.get("is_admin"),
            },
        }).get(), status=status.HTTP_200_OK)
    serializer_class = UserDetailSerializer
    def put(self, request, userid, format=None): # 유저 정보 수정하기 비밀번호 재확인
        try:
            user = User.objects.get(userid=userid)
            if request.user.userid != user.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_401_UNAUTHORIZED,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` User is not exist.".format(userid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
            
        if userid == settings.UNIQUE_ADMIN:
            return Response(PrivateJSON({
                "code" : status.HTTP_403_FORBIDDEN,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.CANNOTMODIFY_SUPERUSER,
                "detail" : request.user.userid + " don't have permission to this access.",
                "requester" : request.user.userid,
            }).get(), status=status.HTTP_403_FORBIDDEN)
            
        if user.is_active == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_403_FORBIDDEN,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.FORBIDDEN_RESPONSE,
                "detail" : user.userid + " User is not active."
            }).get(), status=status.HTTP_403_FORBIDDEN)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            print(request.user.userid)
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : user.userid,
                "contenttype" : "user",
                "contentid" : user.userid,
                "reason" : request.data.get("reason"),
                "modified_at" : timezone.now(),
                "is_deleted" : False
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            modifydata = request.data
            modifydata._mutable = True
            modifydata['userid'] = user.userid
            modifydata['password'] = user.password
            modifydata._mutable = False
            
            serializer = UserSerializer(instance=user, data=modifydata)
            if serializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : serializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
                
            serializer.update(instance=user, validated_data=serializer.validated_data, is_adminmodify=request.user.is_admin)
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.MODIFY_SUCCESS,
                "detail" : serializer.data.get('userid') + " User Modify Success by" + request.user.userid,
                "user" : {
                    "userid" : serializer.data.get('userid'),
                    "nickname" : serializer.data.get('nickname'),
                    "email" : serializer.data.get('email'),
                    "created_at" : serializer.data.get('created_at'),
                    "updated_at" : serializer.data.get('updated_at'),
                    "last_login" : serializer.data.get('last_login'),
                    "is_active" : serializer.data.get('is_active'),
                    "is_admin" : serializer.data.get('is_admin'),
                }
            }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
            
        current_password = request.data.get('currentpassword')
        change_password = request.data.get('changepassword')
        change_password2 = request.data.get('changepassword2')
        
        if current_password == None or change_password == None or change_password2 == None:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : "current_password or change_password is None."
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        if change_password != change_password2:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : "change_password and change_password2 is not match."
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        
        userauth = authentication.authenticate(userid=user.userid, password=current_password)

        if userauth is None:
            return Response(PrivateJSON({
                "code" : status.HTTP_401_UNAUTHORIZED,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.AUTH_FAILED,
                "detail" : "current_password is not match."
            }).get(), status=status.HTTP_401_UNAUTHORIZED)
            
        modifydata = request.data
        modifydata._mutable = True
        modifydata['userid'] = userauth.userid
        modifydata['password'] = change_password
        modifydata._mutable = False
        
        serializer = UserSerializer(instance=user, data=modifydata)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.INVALID_REQUEST,
                    "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)
            
        serializer.update(instance=user, validated_data=serializer.validated_data)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.MODIFY_SUCCESS,
            "detail" : serializer.data.get('userid') + " User Modify Success",
            "user" : {
                "userid" : serializer.data.get('userid'),
                "nickname" : serializer.data.get('nickname'),
                "email" : serializer.data.get('email'),
                "created_at" : serializer.data.get('created_at'),
                "updated_at" : serializer.data.get('updated_at'),
                "last_login" : serializer.data.get('last_login'),
                "is_active" : serializer.data.get('is_active'),
                "is_admin" : serializer.data.get('is_admin'),
            }
        }).get(), status=status.HTTP_200_OK)
    def post(self, request, userid, format=None): # 유저 정보 삭제하기 비밀번호 재확인
        try:
            user = User.objects.get(userid=userid)
            if request.user.userid != userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_401_UNAUTHORIZED,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` User is not exist.".format(userid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
        
        if userid == settings.UNIQUE_ADMIN:
            return Response(PrivateJSON({
                "code" : status.HTTP_403_FORBIDDEN,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.CANNOTDELETE_SUPERUSER,
                "detail" : request.user.userid + " don't have permission to this access.",
                "requester" : request.user.userid,
            }).get(), status=status.HTTP_403_FORBIDDEN)
            
        if user.is_active == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_403_FORBIDDEN,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.FORBIDDEN_RESPONSE,
                "detail" : user.userid + " User is not active."
            }).get(), status=status.HTTP_403_FORBIDDEN)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : user.userid,
                "contenttype" : "user",
                "contentid" : user.userid,
                "reason" : request.data.get("reason"),
                "modified_at" : timezone.now(),
                "is_deleted" : True
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.INVALID_REQUEST,
                    "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            tempuserid = user.userid
            user.is_active = False
            user.save()
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.DELETE_SUCCESS,
                "detail" : tempuserid + " User Delete Success by" + request.user.userid,
            }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        checkpassword = request.data.get('currentpassword')
        if checkpassword is None:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : "currentpassword is None."
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        user = authentication.authenticate(userid=userid, password=checkpassword)
        
        if user is None:
            return Response(PrivateJSON({
                "code" : status.HTTP_401_UNAUTHORIZED,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.AUTH_FAILED,
                "detail" : "current_password is not match."
            }).get(), status=status.HTTP_401_UNAUTHORIZED)

        tempuserid = user.userid
        user.is_active = False
        user.save()
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.DELETE_SUCCESS,
            "detail" : tempuserid + " User Delete Success",
        }).get(), status=status.HTTP_200_OK)

class TagListAPI(APIView): # 태그 리스트 API (2500 기본값)
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = TagSerializer
    def get(self, request, format=None): # 태그 리스트 가져오기
        filtervalue = {}
        
        userid = request.query_params.get('userid')
        tagid = request.query_params.get('tagid')
        created_at = request.query_params.get('created_at')
        updated_at = request.query_params.get('updated_at')
        
        if userid != None:
            filtervalue['userid'] = userid
        if tagid != None:
            filtervalue['tagid__icontains'] = tagid
        if created_at != None:
            filtervalue['created_at__startswith'] = created_at
        if updated_at != None:
            filtervalue['updated_at__startswith'] = updated_at
        
        if filtervalue == []:
            tags = Tag.objects.all()[:2500]
        else:
            tags = Tag.objects.all().filter(**filtervalue)
        
        serializer = TagSerializer(instance=tags, many=True)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.LIST_RESPONSE,
            "detail" : "Tag List",
            "tags" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def post(self, request, format=None): # 태그 생성하기, 누가 태그를 생성했는지 기록
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        serializer.validated_data['userid'] = request.user
        serializer.save()
        return Response(PrivateJSON({
            "code" : status.HTTP_201_CREATED,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.CREATE_SUCCESS,
            "detail" : "{0} Tag Create Success".format(serializer.data.get('tagid')),
            "tag" : serializer.data
        }).get(), status=status.HTTP_201_CREATED)

class TagDetailAPI(APIView): # 태그 디테일 API, 자신이 생성한 태그만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = TagSerializer
    def get(self, request, tagid, format=None): # 태그 정보 가져오기
        try:
            tag = Tag.objects.get(tagid=tagid)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Tag ID is not exist.".format(tagid),
            }).get(), status.HTTP_404_NOT_FOUND)
        
        serializer = TagSerializer(instance=tag)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.INFO_RESPONSE,
            "detail" : "{0} Tag Detail".format(serializer.data.get('tagid')),
            "tag" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def put(self, request, tagid, format=None): # 태그 정보 수정하기
        try:
            tag = Tag.objects.get(tagid=tagid)
            if request.user.userid != tag.userid.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status.HTTP_403_FORBIDDEN)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Tag ID is not exist.".format(tagid),
            }).get(), status.HTTP_404_NOT_FOUND)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : tag.userid.userid,
                "contenttype" : "tag",
                "contentid" : tag.tagid,
                "reason" : request.data.get("reason"),
                "modified_at" : timezone.now(),
                "is_deleted" : False
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
                
            serializer = TagSerializer(instance=tag, data=request.data)
            if serializer.is_valid() == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.INVALID_REQUEST,
                    "detail" : serializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            serializer.update(instance=tag, validated_data=serializer.validated_data)
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.MODIFY_SUCCESS,
                "detail" :  "{0} Tag Modify Success by {1}".format(serializer.data.get('tagid'), request.user.userid),
                "tag" : serializer.data
        }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        serializer = TagSerializer(instance=tag, data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        serializer.update(instance=tag, validated_data=serializer.validated_data)
        
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.MODIFY_SUCCESS,
            "detail" :  "{0} Tag Modify Success".format(serializer.data.get('tagid')),
            "tag" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def delete(self, request, tagid, format=None): # 태그 정보 삭제하기
        try:
            tag = Tag.objects.get(tagid=tagid)
            if request.user.userid != tag.userid.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status=status.HTTP_403_FORBIDDEN)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Tag ID is not exist.".format(tagid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : tag.userid.userid,
                "contenttype" : "tag",
                "contentid" : tag.tagid,
                "reason" : "관리자에 의해 {0} 태그가 삭제됨".format(tag.tagid),
                "modified_at" : timezone.now(),
                "is_deleted" : True
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            temptagid = tag.tagid
            tag.delete()
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.DELETE_SUCCESS,
                "detail" : "{0} Tag Delete Success by {1}".format(temptagid, request.user.userid),
            }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        temptagid = tag.tagid
        tag.delete()
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.DELETE_SUCCESS,
            "detail" : "{0} Tag Delete Success".format(temptagid),
        }).get(), status=status.HTTP_200_OK)

class CategoryListAPI(APIView): # 카테고리 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    def get(self, request, format=None): # 카테고리 리스트 가져오기
        filtervalue = {}
        
        userid = request.query_params.get('userid')
        categoryid = request.query_params.get('categoryid')
        created_at = request.query_params.get('created_at')
        updated_at = request.query_params.get('updated_at')
        
        if userid != None:
            filtervalue['userid'] = userid
        if categoryid != None:
            filtervalue['categoryid__icontains'] = categoryid
        if created_at != None:
            filtervalue['created_at__startswith'] = created_at
        if updated_at != None:
            filtervalue['updated_at__startswith'] = updated_at
        
        if filtervalue == []:
            categorys = Category.objects.all()[:2500]
        else:
            categorys = Category.objects.all().filter(**filtervalue)
        
        serializer = CategorySerializer(instance=categorys, many=True)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.LIST_RESPONSE,
            "detail" : "Category List",
            "categories" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def post(self, request, format=None): # 카테고리 생성하기, 누가 카테고리를 생성했는지 기록
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors,
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        serializer.validated_data['userid'] = request.user
        serializer.save()
        return Response(PrivateJSON({
            "code" : status.HTTP_201_CREATED,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message": literals.CREATE_SUCCESS,
            "detail" : "{0} Category Create Success".format(serializer.data.get('categoryid')),
            "category" : serializer.data
        }).get(), status=status.HTTP_201_CREATED)
    
class CategoryDetailAPI(APIView): # 카테고리 디테일 API, 자신이 생성한 카테고리만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    def get(self, request, categoryid, format=None): # 카테고리 정보 가져오기
        try:
            category = Category.objects.get(categoryid=categoryid)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Category ID is not exist.".format(categoryid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
        
        serializer = CategorySerializer(instance=category)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.INFO_RESPONSE,
            "detail" : "{0} Category Detail".format(serializer.data.get('categoryid')),
            "category" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def put(self, request, categoryid, format=None): # 카테고리 정보 수정하기
        try:
            category = Category.objects.get(categoryid=categoryid)
            if request.user.userid != category.userid.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "requst_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status.HTTP_403_FORBIDDEN)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Category ID is not exist.".format(categoryid),
            }).get(), status.HTTP_404_NOT_FOUND)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : category.userid.userid,
                "contenttype" : "category",
                "contentid" : category.categoryid,
                "reason" : request.data.get("reason"),
                "modified_at" : timezone.now(),
                "is_deleted" : False
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
                
            serializer = CategorySerializer(instance=category, data=request.data)
            if serializer.is_valid() == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "requst_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.INVALID_REQUEST,
                    "detail" : serializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            serializer.update(instance=category, validated_data=serializer.validated_data)
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.MODIFY_SUCCESS,
                "detail" :  "{0} Category Modify Success by {1}".format(serializer.data.get('categoryid'), request.user.userid),
                "tag" : serializer.data
        }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        serializer = CategorySerializer(instance=category, data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "requst_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        serializer.update(instance=category, validated_data=serializer.validated_data)
        
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "requst_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.MODIFY_SUCCESS,
            "detail" : "{0} Category Modify Success".format(serializer.data.get('categoryid')),
            "tag" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def delete(self, request, categoryid, format=None): # 카테고리 정보 삭제하기
        try:
            category = Category.objects.get(categoryid=categoryid)
            if request.user.userid != category.userid.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status=status.HTTP_403_FORBIDDEN)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message": literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Category ID is not exist.".format(categoryid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : category.userid.userid,
                "contenttype" : "category",
                "contentid" : category.categoryid,
                "reason" : "관리자에 의해 {0} 카테고리가 삭제됨".format(category.categoryid),
                "modified_at" : timezone.now(),
                "is_deleted" : True
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
                
            tempcategoryid = category.categoryid
            category.delete()
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.DELETE_SUCCESS,
                "detail" : "{0} Category Delete Success {1}".format(tempcategoryid, request.user.userid),
            }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        tempcategoryid = category.categoryid
        category.delete()
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.DELETE_SUCCESS,
            "detail" : "{0} Category Delete Success".format(tempcategoryid),
        }).get(), status=status.HTTP_200_OK)

class PostListAPI(APIView): # 포스트 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    def get(self, request, format=None): # 포스트 리스트 가져오기 (2500 기본값)
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
        
        order = request.query_params.get('order')
        
        tagid = str(tagid).split(',')
        
        if userid != None:
            filtervalue['userid'] = userid
        if categoryid != None:
            filtervalue['categoryid'] = categoryid
        if tagid[0] != 'None' and len(tagid) > 0:
            filtervalue['tagid__in'] = tagid
        if title != None:
            filtervalue['title__contains'] = title
        if content != None:
            filtervalue['content__contains'] = content
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
            posts = Post.objects.all()[:2500]
        else:
            posts = Post.objects.all().filter(**filtervalue)
            
        if order == 'recent':
            posts = posts.order_by('-created_at')
            
        if order == 'old':
            posts = posts.order_by('created_at')
            
        if order == 'review':
            posts = posts.order_by('-views')
            
        for post in posts:
            if not post.is_published:
                post.title = "[비공개글]"
                post.content = "[비공개글]"
                post.thumbnailurl = ""
                post.views = 0
                post.created_at = None
                post.updated_at = None
                post.userid = None
                post.categoryid = None
                post.tagid.set([])
                post.secret_password = ""
            if post.is_secret:
                post.content = "[비밀글]"
        
        serializer = PostSerializer(instance=posts, many=True)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.LIST_RESPONSE,
            "detail" : "Post List",
            "posts" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def post(self, request, format=None): # 포스트 생성하기
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        serializer.validated_data['userid'] = request.user
        if serializer.validated_data.get('is_published') == True and serializer.validated_data.get('published_at') == None:
            serializer.validated_data['published_at'] = timezone.now()
        else:
            serializer.validated_data['published_at'] = None

        if serializer.validated_data.get('is_secret') == True:
            if serializer.validated_data.get('secret_password') == "":
                return Response(PrivateJSON({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.REQUIRED_FIELD,
                    "detail" : "secret_password is required field."
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            if not serializer.validated_data.get('secret_password').startswith('pbkdf2_sha256$'):
                serializer.validated_data['secret_password'] = make_password(serializer.validated_data['secret_password'])

        serializer.save()
        return Response(PrivateJSON({
            "code" : status.HTTP_201_CREATED,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.CREATE_SUCCESS,
            "detail" : "{0} Post Create Success".format(serializer.data.get('postid')),
            "post" : serializer.data
        }).get(), status=status.HTTP_201_CREATED)
    
class PostDetailAPI(APIView): # 포스트 디테일 API, 자신이 생성한 포스트만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    def get(self, request, postid, format=None): # 포스트 정보 가져오기
        try:
            post = Post.objects.get(postid=postid)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Post ID is not exist.".format(postid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
        
        is_prevent = False
        if not post.is_published:
            if not request.user.is_authenticated or request.user.userid != post.userid.userid and request.user.is_admin == False:
                post.title = "[비공개글]"
                post.content = "[비공개글]"
                post.thumbnailurl = ""
                post.views = 0
                post.created_at = None
                post.updated_at = None
                post.userid = None
                post.categoryid = None
                post.tagid.set([])
                post.secret_password = ""
                is_prevent = True
        if post.is_secret:
            post.content = "[비밀글]"
            is_prevent = True

        if not is_prevent:
            if int(request.COOKIES.get('postid')) != int(postid):
                post.views += 1
                post.save()
            
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
            
        ip = ip.split('.')
        ip[2] = '***'
        ip[3] = '***'
        
        ip = '.'.join(ip)
        
        serializer = PostSerializer(instance=post)
        res = Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.INFO_RESPONSE,
            "detail" : "{0} Post Detail".format(serializer.data.get('postid')),
            "requestor" : ip,
            "post" : serializer.data
        }).get(), status=status.HTTP_200_OK)
        res.set_cookie('postid', postid)
        return res
    def put(self, request, postid, format=None): # 포스트 정보 수정하기
        try:
            post = Post.objects.get(postid=postid)
            if request.user.userid != post.userid.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status.HTTP_403_FORBIDDEN)
                
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Post ID is not exist.".format(postid),
            }).get(), status.HTTP_404_NOT_FOUND)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : post.userid.userid,
                "contenttype" : "post",
                "contentid" : str(post.postid),
                "reason" : request.data.get("reason"),
                "modified_at" : timezone.now(),
                "is_deleted" : False
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
                
            serializer = PostSerializer(instance=post, data=request.data)
            if serializer.is_valid() == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.INVALID_REQUEST,
                    "detail" : serializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)

            serializer.validated_data['userid'] = request.user
            if serializer.validated_data.get('is_published') == True and serializer.validated_data.get('published_at') == None:
                serializer.validated_data['published_at'] = timezone.now()
            else:
                serializer.validated_data['published_at'] = None

            if serializer.validated_data.get('is_secret') == True:
                if serializer.validated_data.get('secret_password') == "":
                    return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.REQUIRED_FIELD,
                        "detail" : "secret_password is required field."
                    }).get(), status=status.HTTP_400_BAD_REQUEST)
                
                if not serializer.validated_data.get('secret_password').startswith('pbkdf2_sha256$'):
                    serializer.validated_data['secret_password'] = make_password(serializer.validated_data['secret_password'])
            
            serializer.update(instance=post, validated_data=serializer.validated_data)
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.MODIFY_SUCCESS,
                "detail" :  "{0} Post Modify Success by {1}".format(serializer.data.get('postid'), request.user.userid),
                "post" : serializer.data
        }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        serializer = PostSerializer(instance=post, data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)

        serializer.validated_data['userid'] = request.user
        if serializer.validated_data.get('is_published') == True and serializer.validated_data.get('published_at') == None:
            serializer.validated_data['published_at'] = timezone.now()
        else:
            serializer.validated_data['published_at'] = None

        if serializer.validated_data.get('is_secret') == True:
            if serializer.validated_data.get('secret_password') == "":
                return Response(PrivateJSON({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.REQUIRED_FIELD,
                    "detail" : "secret_password is required field."
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            if not serializer.validated_data.get('secret_password').startswith('pbkdf2_sha256$'):
                serializer.validated_data['secret_password'] = make_password(serializer.validated_data['secret_password'])
        
        serializer.update(instance=post, validated_data=serializer.validated_data)
        
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.MODIFY_SUCCESS,
            "detail" : "{0} Post Modify Success".format(serializer.data.get('postid')),
            "post" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def delete(self, request, postid, format=None): # 포스트 정보 삭제하기
        try:
            post = Post.objects.get(postid=postid)
            if request.user.userid != post.userid.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status=status.HTTP_403_FORBIDDEN)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Post ID is not exist.".format(postid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : post.userid.userid,
                "contenttype" : "post",
                "contentid" : str(post.postid),
                "reason" : "관리자에 의해 {0} 포스트가 삭제됨".format(post.title),
                "modified_at" : timezone.now(),
                "is_deleted" : True
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            tempposttitle = post.title
            post.delete()
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.DELETE_SUCCESS,
                "detail" : "{0} Post Delete Success {1}".format(tempposttitle, request.user.userid),
            }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        tempposttitle = post.title
        post.delete()
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.DELETE_SUCCESS,
            "detail" : "{0} Post Delete Success".format(tempposttitle),
        }).get(), status=status.HTTP_200_OK)

class CommentListAPI(APIView): # 댓글 리스트 API
    permission_classes = [AllowAny]
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
        
        serializer = CommentSerializer(instance=comments, many=True)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.LIST_RESPONSE,
            "detail" : "Comment List",
            "comments" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def post(self, request, format=None): # 댓글 생성하기
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)
            
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
            
        ip = ip.split('.')
        ip[2] = '***'
        ip[3] = '***'
        
        ip = '.'.join(ip)
        
        serializer.validated_data['userid'] = request.user if request.user.is_authenticated else None
        serializer.validated_data['created_ip'] = ip
        serializer.save()
        return Response(PrivateJSON({
            "code" : status.HTTP_201_CREATED,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message": literals.CREATE_SUCCESS,
            "detail" : "{0} Comment Create Success".format(serializer.data.get('commentid')),
            "category" : serializer.data
        }).get(), status=status.HTTP_201_CREATED)
    
class CommentDetailAPI(APIView): # 댓글 디테일 API, 자신이 생성한 댓글만 수정, 삭제 가능
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    def get(self, request, commentid, format=None): # 댓글 정보 가져오기
        try:
            comment = Comment.objects.get(commentid=commentid)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : "존재하지 않는 댓글입니다.",
                "detail" : "`{0}` Comment ID is not exist.".format(commentid)
            }).get(), status=status.HTTP_404_NOT_FOUND)
        
        serializer = CommentSerializer(instance=comment)
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.INFO_RESPONSE,
            "detail" : "{0} Comment Detail".format(serializer.data.get('commentid')),
            "comment" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def put(self, request, commentid, format=None): # 댓글 정보 수정하기
        try:
            comment = Comment.objects.get(commentid=commentid)
            if request.user.userid != comment.userid.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status.HTTP_403_FORBIDDEN)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Comment ID is not exist.".format(commentid),
            }).get(), status.HTTP_404_NOT_FOUND)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : comment.userid.userid,
                "contenttype" : "comment",
                "contentid" : str(comment.commentid),
                "reason" : request.data.get("reason"),
                "modified_at" : timezone.now(),
                "is_deleted" : False
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
                
            serializer = CommentSerializer(instance=comment, data=request.data)
            if serializer.is_valid() == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_400_BAD_REQUEST,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.INVALID_REQUEST,
                    "detail" : serializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            serializer.update(instance=comment, validated_data=serializer.validated_data)
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.MODIFY_SUCCESS,
                "detail" :  "{0} Comment Modify Success by {1}".format(serializer.data.get('commentid'), request.user.userid),
                "comment" : serializer.data
        }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        serializer = CommentSerializer(instance=comment, data=request.data)
        if serializer.is_valid() == False:
            return Response(PrivateJSON({
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.INVALID_REQUEST,
                "detail" : serializer.errors
            }).get(), status=status.HTTP_400_BAD_REQUEST)
        
        serializer.update(instance=comment, validated_data=serializer.validated_data)
        
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.MODIFY_SUCCESS,
            "detail" : "{0} Comment Modify Success".format(serializer.data.get('commentid')),
            "comment" : serializer.data
        }).get(), status=status.HTTP_200_OK)
    def delete(self, request, commentid, format=None): # 댓글 정보 삭제하기
        try:
            comment = Comment.objects.get(commentid=commentid)
            if request.user.userid != comment.userid.userid and request.user.is_admin == False:
                return Response(PrivateJSON({
                    "code" : status.HTTP_403_FORBIDDEN,
                    "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                    "status" : literals.ERROR,
                    "message" : literals.FORBIDDEN_RESPONSE,
                    "detail" : request.user.userid + " don't have permission to this access.",
                }).get(), status=status.HTTP_403_FORBIDDEN)
        except:
            return Response(PrivateJSON({
                "code" : status.HTTP_404_NOT_FOUND,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : literals.NOTFOUND_RESPONSE,
                "detail" : "`{0}` Comment ID is not exist.".format(commentid),
            }).get(), status=status.HTTP_404_NOT_FOUND)
            
        ''' ADMIN '''
        if request.user.is_admin == True:
            adminserializer = ForcedControlSerializer(data={
                "adminid" : request.user.userid,
                "targetid" : comment.userid.userid,
                "contenttype" : "comment",
                "contentid" : str(comment.commentid),
                "reason" : "관리자에 의해 {0} 댓글이 삭제됨".format(comment.content),
                "modified_at" : timezone.now(),
                "is_deleted" : True
            })
            
            if adminserializer.is_valid() == False:
                return Response(PrivateJSON({
                        "code" : status.HTTP_400_BAD_REQUEST,
                        "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                        "status" : literals.ERROR,
                        "message" : literals.INVALID_REQUEST,
                        "detail" : adminserializer.errors
                }).get(), status=status.HTTP_400_BAD_REQUEST)
            
            tempcommentcontent = comment.content
            comment.delete()
            adminserializer.save()
            
            return Response(PrivateJSON({
                "code" : status.HTTP_200_OK,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.SUCCESS,
                "message" : request.user.userid + " 으로 인해 " + literals.DELETE_SUCCESS,
                "detail" : "{0} Comment Delete Success {1}".format(tempcommentcontent, request.user.userid),
            }).get(), status=status.HTTP_200_OK)
        ''' ADMIN '''
        
        tempcommentcontent = comment.content
        comment.delete()
        return Response(PrivateJSON({
            "code" : status.HTTP_200_OK,
            "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
            "status" : literals.SUCCESS,
            "message" : literals.DELETE_SUCCESS,
            "detail" : "{0} Comment Delete Success".format(tempcommentcontent),
        }).get(), status=status.HTTP_200_OK)
