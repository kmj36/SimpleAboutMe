from rest_framework import serializers
from rest_framework import status
from .models import *
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .literals import literals
from django.utils import timezone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' 
        read_only_fields = ('created_at', 'updated_at', 'last_login', 'is_active', 'is_admin', 'is_superuser', 'is_reported', 'is_banned', 'groups', 'user_permissions')
    
    def create(self, validated_data):
        userid = validated_data.get('userid')
        nickname = validated_data.get('nickname')
        email = validated_data.get('email')
        password = validated_data.get('password')
        
        if len(userid) < 5:
            returnjson = {
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : "유저 ID 는 5자 이상이어야 합니다.",
                "detail" : "userid is too short",
            }
            raise serializers.ValidationError(returnjson, code=status.HTTP_400_BAD_REQUEST)
        
        if len(nickname) < 3:
            returnjson = {
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : "닉네임은 3자 이상이어야 합니다.",
                "detail" : "nickname is too short",
            }
            raise serializers.ValidationError(returnjson, code=status.HTTP_400_BAD_REQUEST)
        
        try:
            validate_password(user=User, password=password)
        except Exception as e:
            argslen = len(e.args[0])
            errormessage = []
            for i in range(0, argslen):
                errormessage.append(str(e.args[0][i])[2:-2])
            returnjson = {
                "code" : status.HTTP_400_BAD_REQUEST,
                "request_time" : timezone.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
                "status" : literals.ERROR,
                "message" : "비밀번호가 유효하지 않습니다.",
                "detail" : errormessage,
            }
            raise serializers.ValidationError(returnjson, code=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            userid=userid,
            nickname=nickname,
            email=email,
            password=password
        )
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data, is_adminmodify):
        instance.userid = validated_data.get('userid', instance.userid)
        instance.nickname = validated_data.get('nickname', instance.nickname)
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)
        if is_adminmodify == False:
            instance.set_password(instance.password)
        instance.save()
        return instance

class UserDetailSerializer(UserSerializer):
    currentpassword = serializers.CharField(help_text='Type Current Your Password',  write_only=True, required=True)
    changepassword = serializers.CharField(help_text='Type New Password',  write_only=True, required=True)
    changepassword2 = serializers.CharField(help_text='Type New Password Again',  write_only=True, required=True)
    reason = serializers.CharField(help_text='Type Reason',  write_only=True, required=False)
    class Meta:
        model = User
        fields = ['nickname', 'email', 'currentpassword', 'changepassword', 'changepassword2', 'reason']
        read_only_fields = ('userid', 'created_at', 'updated_at', 'last_login', 'is_active', 'is_admin', 'is_superuser', 'groups', 'user_permissions')
    
class UserReportDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReportDetail
        fields = '__all__'
        read_only_fields = ('reportid', 'userid', 'reportat')
        
class UserBanDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBanDetail
        fields = '__all__'
        read_only_fields = ('banid', 'userid', 'bannedby', 'bannedat')
        
class ForcedControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForcedControl
        fields = '__all__'
        read_only_fields = ('controlid', 'modified_at')
    
class TagSerializer(serializers.ModelSerializer):
    reason = serializers.CharField(help_text='Type Reason',  write_only=True, required=False)
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = ('userid', 'created_at', 'updated_at')

class CategorySerializer(serializers.ModelSerializer):
    reason = serializers.CharField(help_text='Type Reason',  write_only=True, required=False)
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('userid', 'created_at', 'updated_at')

class PostSerializer(serializers.ModelSerializer):
    reason = serializers.CharField(help_text='Type Reason',  write_only=True, required=False)
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('postid', 'userid', 'views', 'created_at', 'updated_at', 'published_at')

class CommentSerializer(serializers.ModelSerializer):
    reason = serializers.CharField(help_text='Type Reason',  write_only=True, required=False)
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('commentid', 'userid', 'created_at', 'updated_at')