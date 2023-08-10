# Create your views here.
from .models import User, Tag, Category, Post, Comment
from .serializers import *
from rest_framework import status, authentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
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
                'auth': {
                    'auth' : 'POST /auth/',
                    'register': 'POST /auth/register/',
                    'login': 'POST /auth/login/',
                    'logout': 'POST /auth/logout/',
                    'refresh': 'POST /auth/refresh/',
                },
                'user': {
                    'list': 'GET /user/',
                    'detail': 'GET /user/<str:userid>/',
                    'update': 'PUT /user/<str:userid>/',
                    'delete': 'POST /user/<str:userid>/',
                },
                'tag': {
                    'list': 'GET /tag/',
                    'detail': 'GET /tag/<int:tagid>/',
                    'create': 'POST /tag/',
                    'update': 'PUT /tag/<int:tagid>/',
                    'delete': 'DELETE /tag/<int:tagid>/',
                },
                'category': {
                    'list': 'GET /category/',
                    'detail': 'GET /category/<int:categoryid>/',
                    'create': 'POST /category/',
                    'update': 'PUT /category/<int:categoryid>/',
                    'delete': 'DELETE /category/<int:categoryid>/',
                },
                'post': {
                    'list': 'GET /post/',
                    'detail': 'GET /post/<int:postid>/',
                    'create': 'POST /post/',
                    'update': 'PUT /post/<int:postid>/',
                    'delete': 'DELETE /post/<int:postid>/',
                },
                'comment': {
                    'list': 'GET /comment/',
                    'detail': 'GET /comment/<int:commentid>/',
                    'create': 'POST /comment/',
                    'update': 'PUT /comment/<int:commentid>/',
                    'delete': 'DELETE /comment/<int:commentid>/',
                },
            }
        })

class TokenAuthAPI(APIView): # 토큰 인증 API
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None): # 토큰 인증
        JWT_authenticator = JWTAuthentication()
        response = JWT_authenticator.authenticate(request)
        
        user , token = response
        return Response({
            'user': UserSerializer(user).data,
            'token': str(token)
        }, status=status.HTTP_200_OK)

class RegisterAPI(APIView): # 회원가입 API
    permission_classes = [AllowAny]
    def post(self, request, format=None): # 회원가입 (필수 필드값: userid, nickname, email, password)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        user = serializer.save()
        
        token = TokenObtainPairSerializer().get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = Response({
            "user" : serializer.data,
            "message" : "회원가입에 성공했습니다.",
            "token": {
                "refresh": refresh_token,
                "access": access_token,
            }
        }, status=status.HTTP_201_CREATED)
        res.set_cookie('refresh_token', refresh_token, httponly=True)   
        res.set_cookie('access_token', access_token, httponly=True)
        return res

class LoginAPI(APIView): # 로그인 API
    permission_classes = [AllowAny]
    def post(self, request, format=None): # 로그인
        try:
            userid = request.data['userid']
            password = request.data['password']
        except:
            return Response({'message': '아이디와 비밀번호를 입력해주세요.'})
        
        user = authentication.authenticate(userid=userid, password=password)
        
        if user is None:
            return Response({'message': '아이디와 비밀번호가 일치하지 않습니다.'})
        user.last_login = timezone.now()
        user.save()

        serializer = UserSerializer(user)
        token = TokenObtainPairSerializer().get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = Response({
            "user" : serializer.data,
            "message" : "로그인에 성공했습니다.",
            "token" : {
                "access": access_token,
                "refresh": refresh_token,
                },
            },
        status=status.HTTP_200_OK)
        res.set_cookie('refresh_token', refresh_token, httponly=True)
        res.set_cookie('access_token', access_token, httponly=True)
        return res
    
class UserListAPI(APIView): # 유저 리스트 API
    permission_classes = [IsAdminUser]
    def get(self, request, format=None): # 유저 리스트 가져오기
        try:
            users = User.objects.all()
            if request.query_params != {}: # 쿼리 파라미터가 있을 경우
                nickname = request.query_params.get('nickname')
                email = request.query_params.get('email')
                created_at = request.query_params.get('created_at')

                if nickname != None:
                    if nickname.find('*') != -1:
                        if nickname[0] == '*' and nickname[-1] == '*':
                            nickname = nickname[1:-1]
                            users = users.filter(nickname__contains=nickname)
                        if nickname[0] == '*':
                            nickname = nickname[1:]
                            users = users.filter(nickname__endswith=nickname)
                        if nickname[-1] == '*':
                            nickname = nickname[:-1]
                            users = users.filter(nickname__startswith=nickname)       
                    else:
                        users = users.filter(nickname=nickname)
                        
                if email != None:
                    if email.find('*') != -1:
                        if email[0] == '*' and email[-1] == '*':
                            email = email[1:-1]
                            users = users.filter(email__contains=email)
                        if email[0] == '*':
                            email = email[1:]
                            users = users.filter(email__endswith=email)
                        if email[-1] == '*':
                            email = email[:-1]
                            users = users.filter(email__startswith=email)       
                    else:
                        users = users.filter(email=email)
                        
                if created_at != None:
                    users = users.filter(created_at__startswith=created_at)

            elif request.query_params.get('getall') == None:
                users = users[:10]
        except:
            return Response({'message': '리스트를 가져오는데 실패했습니다.'})
        
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
        
        serializer = UserModifySerializer(user, data=request.data)
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
        try:
            tags = Tag.objects.all()
            if request.query_params != {}: # 쿼리 파라미터가 있을 경우
                tagname = request.query_params.get('tagname')
                created_at = request.query_params.get('created_at')

                if tagname != None:
                    if tagname.find('*') != -1:
                        if tagname[0] == '*' and tagname[-1] == '*':
                            tagname = tagname[1:-1]
                            tags = tags.filter(tagname__contains=tagname)
                        if tagname[0] == '*':
                            tagname = tagname[1:]
                            tags = tags.filter(tagname__endswith=tagname)
                        if tagname[-1] == '*':
                            tagname = tagname[:-1]
                            tags = tags.filter(tagname__startswith=tagname)       
                    else:
                        tags = tags.filter(tagname=tagname)
                    
                if created_at != None:
                    tags = tags.filter(created_at__startswith=created_at)

            elif request.query_params.get('getall') == None:
                tags = tags[:10]
        except:
            return Response({'message': '리스트를 가져오는데 실패했습니다.'})
        
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
        try:
            categories = Category.objects.all()
            if request.query_params != {}: # 쿼리 파라미터가 있을 경우
                categoryname = request.query_params.get('categoryname')
                created_at = request.query_params.get('created_at')

                if categoryname != None:
                    if categoryname.find('*') != -1:
                        if categoryname[0] == '*' and categoryname[-1] == '*':
                            categoryname = categoryname[1:-1]
                            categories = categories.filter(categoryname__contains=categoryname)
                        if categoryname[0] == '*':
                            categoryname = categoryname[1:]
                            categories = categories.filter(categoryname__endswith=categoryname)
                        if categoryname[-1] == '*':
                            categoryname = categoryname[:-1]
                            categories = categories.filter(categoryname__startswith=categoryname)       
                    else:
                        categories = categories.filter(categoryname=categoryname)
                    
                if created_at != None:
                    categories = categories.filter(created_at__startswith=created_at)
            
            elif request.query_params.get('getall') == None:
                categories = categories[:10]
        except:
            return Response({'message': '리스트를 가져오는데 실패했습니다.'})
        
        if categories.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})
        
        serializer = CategorySerializer(categories, many=True)
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
    def get(self, request, format=None): # 포스트 리스트 가져오기
        try:
            posts = Post.objects.all()
            if request.query_params != {}: # 쿼리 파라미터가 있을 경우
                userid = request.query_params.get('userid')
                categoryid = request.query_params.get('categoryid')
                title = request.query_params.get('title')
                content = request.query_params.get('content')
                created_at = request.query_params.get('created_at')

                if userid != None:
                    posts = posts.filter(userid=userid)
                if categoryid != None:
                    categoryid = Category.objects.get(categoryid=categoryid)
                    
                if title != None:
                    if title.find('*') != -1:
                        if title[0] == '*' and title[-1] == '*':
                            title = title[1:-1]
                            posts = posts.filter(title__contains=title)
                        if title[0] == '*':
                            title = title[1:]
                            posts = posts.filter(title__endswith=title)
                        if title[-1] == '*':
                            title = title[:-1]
                            posts = posts.filter(title__startswith=title)       
                    else:
                        posts = posts.filter(title=title)
                        
                if content != None:
                    if content.find('*') != -1:
                        if content[0] == '*' and content[-1] == '*':
                            content = content[1:-1]
                            posts = posts.filter(content__contains=content)
                        if content[0] == '*':
                            content = content[1:]
                            posts = posts.filter(content__endswith=content)
                        if content[-1] == '*':
                            content = content[:-1]
                            posts = posts.filter(content__startswith=content)       
                    else:
                        posts = posts.filter(content=content)
                    
                if created_at != None:
                    posts = posts.filter(created_at__startswith=created_at)
            
            elif request.query_params.get('getall') == None:
                posts = posts[:10]
        except:
            return Response({'message': '리스트를 가져오는데 실패했습니다.'})
        
        if posts.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data) 
    def post(self, request, format=None): # 포스트 생성하기
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
            if request.user.userid != post.userid:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 포스트입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
            user = User.objects.get(userid=request.data['userid'])
        except:
            return Response({'message': '포스트를 수정하려면 비밀번호를 입력해주세요.'})
        
        if user.password != checkpassword:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)
        
        serializer.save()
        return Response({'message': '포스트가 수정되었습니다.'})
    def delete(self, request, postid, format=None): # 포스트 정보 삭제하기
        try:
            post = Post.objects.get(postid=postid)
            if request.user.userid != post.userid:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 포스트입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
            user = User.objects.get(userid=request.data['userid'])
        except:
            return Response({'message': '포스트를 삭제하려면 비밀번호를 입력해주세요.'})
        
        if user.password != checkpassword:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        post.delete()
        return Response({'message': '포스트가 삭제되었습니다.'})

class CommentListAPI(APIView): # 댓글 리스트 API
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None): # 댓글 리스트 가져오기
        try:
            Comments = Comment.objects.all()
            if request.query_params != {}: # 쿼리 파라미터가 있을 경우
                userid = request.query_params.get('userid')
                postid = request.query_params.get('postid')
                content = request.query_params.get('content')
                creted_at = request.query_params.get('created_at')
                
                if userid != None:
                    Comments = Comments.filter(userid=userid)
                if postid != None:
                    Comments = Comments.filter(postid=postid)
                    
                if content != None:
                    if content.find('*') != -1:
                        if content[0] == '*' and content[-1] == '*':
                            content = content[1:-1]
                            Comments = Comments.filter(content__contains=content)
                        if content[0] == '*':
                            content = content[1:]
                            Comments = Comments.filter(content__endswith=content)
                        if content[-1] == '*':
                            content = content[:-1]
                            Comments = Comments.filter(content__startswith=content)       
                    else:
                        Comments = Comments.filter(content=content)
                    
                if creted_at != None:
                    Comments = Comments.filter(creted_at__startswith=creted_at)
                    
            elif request.query_params.get('getall') == None:
                Comments = Comments[:10]
        except:
            return Response({'message': '리스트를 가져오는데 실패했습니다.'})
        
        if Comments.count() == 0:
            return Response({'message': '리스트가 비어 있습니다.'})
        
        serializer = CommentSerializer(Comments, many=True)
        return Response(serializer.data)
    def post(self, request, format=None): # 댓글 생성하기
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
    def put(self, request, commentid, format=None):
        try:
            Comment = Comment.objects.get(commentid=commentid)
            if request.user.userid != Comment.userid:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 댓글입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
            user = User.objects.get(userid=request.data['userid'])
        except:
            return Response({'message': '댓글을 수정하려면 비밀번호를 입력해주세요.'})

        if user.password != checkpassword:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})

        serializer = CommentSerializer(Comment, data=request.data)
        if serializer.is_valid() == False:
            return Response(serializer.errors)

        serializer.save()
        return Response({'message': '댓글이 수정되었습니다.'})
    def delete(self, request, commentid, format=None):
        try:
            Comment = Comment.objects.get(commentid=commentid)
            if request.user.userid != Comment.userid:
                return Response({'message': '접근 권한이 없습니다.'})
        except:
            return Response({'message': '존재하지 않는 댓글입니다.'})
        
        try:
            checkpassword = request.data['checkpassword']
            user = User.objects.get(userid=request.data['userid'])
        except:
            return Response({'message': '댓글을 삭제하려면 비밀번호를 입력해주세요.'})
        
        if user.password != checkpassword:
            return Response({'message': '비밀번호가 일치하지 않습니다.'})
        
        Comment.delete()
        return Response({'message': '댓글이 삭제되었습니다.'})
