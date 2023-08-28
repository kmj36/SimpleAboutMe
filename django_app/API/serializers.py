from rest_framework import serializers
from rest_framework import status
from .models import User, Tag, Category, Post, Comment
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' 
        read_only_fields = ('created_at', 'updated_at', 'last_login', 'is_active', 'is_admin', 'is_superuser', 'groups', 'user_permissions')
    
    def create(self, validated_data):
        userid = validated_data.get('userid')
        nickname = validated_data.get('nickname')
        email = validated_data.get('email')
        password = validated_data.get('password')
        
        if len(userid) < 5:
            returnjson = {
                "code" : status.HTTP_400_BAD_REQUEST,
                "detail" : "유저 ID 는 5자 이상이어야 합니다.",
            }
            raise serializers.ValidationError(returnjson)
        
        if len(nickname) < 3:
            returnjson = {
                "code" : status.HTTP_400_BAD_REQUEST,
                "detail" : "닉네임은 3자 이상이어야 합니다.",
            }
            raise serializers.ValidationError(returnjson)
        
        try:
            validate_password(user=User, password=password)
        except Exception as e:
            argslen = len(e.args[0])
            errormessage = []
            for i in range(0, argslen):
                errormessage.append(str(e.args[0][i])[2:-2])
            returnjson = {
                "code" : status.HTTP_400_BAD_REQUEST,
                "detail" : errormessage,
            }
            raise serializers.ValidationError(returnjson)
        
        user = User.objects.create_user(
            userid=userid,
            nickname=nickname,
            email=email,
            password=password
        )
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        instance.userid = validated_data.get('userid', instance.userid)
        instance.nickname = validated_data.get('nickname', instance.nickname)
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)
        instance.set_password(instance.password)
        instance.save()
        return instance

class UserDetailSerializer(UserSerializer):
    currentpassword = serializers.CharField(help_text='Type Current Your Password',  write_only=True, required=True)
    changepassword = serializers.CharField(help_text='Type Desired Your Password',  write_only=True, required=True)
    changepassword2 = serializers.CharField(help_text='Type Desired Your Password Again',  write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['nickname', 'email', 'currentpassword', 'changepassword', 'changepassword2']
        read_only_fields = ('userid', 'created_at', 'updated_at', 'last_login', 'is_active', 'is_admin', 'is_superuser', 'groups', 'user_permissions')
    
    def validate(self, data):
        if data['changepassword'] != data['changepassword2']:
            raise serializers.ValidationError("Password fields didn't match.")
        return data
    
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = ('tagid', 'userid', 'created_at', 'updated_at')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('categoryid', 'userid', 'created_at', 'updated_at')

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('postid', 'userid', 'created_at', 'updated_at', 'published_at')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('commentid', 'userid', 'created_at', 'updated_at')