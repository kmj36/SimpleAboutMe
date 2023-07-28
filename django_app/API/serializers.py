from rest_framework import serializers
from .models import User, Tag, Category, Post, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('userid', 'password', 'nickname', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            userid=validated_data['userid'],
            password=validated_data['password'],
            nickname=validated_data['nickname'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'