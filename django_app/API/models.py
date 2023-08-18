from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from dotenv import load_dotenv
import os
# Create your models here.

load_dotenv(verbose=True)

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, userid, password, nickname, email):
        
        if not userid:
            raise ValueError('Users must have an userid')
        
        if not password:
            raise ValueError('Users must have an password')
        
        if not nickname:
            raise ValueError('Users must have an nickname')
        
        if not email:
            raise ValueError('Users must have an email')
        
        user = self.model(
            userid=userid,
            nickname=nickname,
            email=email,
            password=password,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, userid=None, password=None, nickname=None, email=None):
        
        if not userid:
            raise ValueError('SuperUsers must have an userid')
        
        if not password:
            raise ValueError('SuperUsers must have an password')
        
        if not nickname:
            raise ValueError('SuperUsers must have an nickname')
        
        if not email:
            raise ValueError('SuperUsers must have an email')
        
        superuser = self.create_user(
            userid=userid,
            nickname=nickname,
            email=email,
            password=password,
        )
        superuser.is_admin = True
        if userid == os.environ.get('DJANGO_ADMIN_ID'):
            superuser.is_superuser = True
        superuser.is_active = True
        superuser.save(using=self._db)
        return superuser

class User(AbstractBaseUser, PermissionsMixin): # User 테이블 정의, 1:N 관계
    userid = models.CharField(verbose_name='User ID', max_length=32, primary_key=True) # userid를 기본키로 설정
    password = models.CharField(verbose_name='User Password', max_length=128)
    nickname = models.CharField(verbose_name='User Nickname', max_length=64, unique=True)
    email = models.EmailField(verbose_name='User Email', max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True) # 생성 시간
    updated_at = models.DateTimeField(auto_now=True) # 수정 시간
    last_login = models.DateTimeField(null=True) # 마지막 로그인 시간
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'userid'
    REQUIRED_FIELDS = ['password', 'nickname', 'email']

    class Meta:
        db_table = 'API_user'
        
    def __str__(self):
        return self.userid
    
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

class Tag(models.Model): # Tag 테이블 정의, N:M 관계
    tagid = models.AutoField(verbose_name='Tag ID', primary_key=True)
    userid = models.ForeignKey(User, verbose_name='Tag Creator', on_delete=models.SET_NULL, null=True, blank=True)
    tagname = models.CharField(verbose_name='Tag Name', max_length=32, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.tagname

class Category(models.Model): # Category 테이블 정의, 1:N 관계
    categoryid = models.AutoField(verbose_name='Category ID', primary_key=True)
    userid = models.ForeignKey(User, verbose_name='Category Creator', on_delete=models.SET_NULL, null=True, blank=True)
    categoryname = models.CharField(verbose_name='Category Name', max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.categoryname

class Post(models.Model): # Post 테이블 정의, 1:N 관계
    postid = models.AutoField(verbose_name='Post ID', primary_key=True)
    userid = models.ForeignKey(User, verbose_name='Post Creator', on_delete=models.SET_NULL, null=True, blank=True)
    categoryid = models.ForeignKey(Category, verbose_name='Post Category', on_delete=models.SET_NULL, null=True, blank=True)
    tagid = models.ManyToManyField(Tag, verbose_name='Post Tags', blank=True)
    title = models.CharField(verbose_name='Post Title', max_length=128)
    content = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    secret_password = models.CharField(verbose_name='Secret Password', max_length=128, null=True, blank=True)
    is_secret = models.BooleanField(default=False)
    def __str__(self):
        return self.title

class Comment(models.Model): # Comment 테이블 정의, 1:N 관계
    commentid = models.AutoField(verbose_name='Comment ID', primary_key=True)
    postid = models.ForeignKey(Post, verbose_name='Comment Post ID', on_delete=models.CASCADE)
    userid = models.ForeignKey(User, verbose_name='Comment Creator', on_delete=models.SET_NULL, null=True, blank=True)
    content = models.CharField(verbose_name='Comment Content', max_length=1024, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_secret = models.BooleanField(default=False)
    def __str__(self):
        return self.content