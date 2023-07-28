from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# Create your models here.

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, userid, password, nickname, email):
        user = self.model(
            userid=userid,
            password=password,
            nickname=nickname,
            email=email,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, userid, password, nickname, email):
        superuser = self.create_user(
            userid=userid,
            password=password,
            nickname=nickname,
            email=email,
        )
        superuser.is_admin = True
        superuser.is_active = True
        superuser.save(using=self._db)
        return superuser

class User(AbstractBaseUser, PermissionsMixin): # User 테이블 정의, 1:N 관계
    userid = models.CharField(max_length=20, primary_key=True)
    password = models.CharField(max_length=30)
    nickname = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'userid'
    REQUIRED_FIELDS = ['password', 'nickname', 'email']

    class Meta:
        db_table = 'API_user'

class Tag(models.Model): # Tag 테이블 정의, N:M 관계
    tagid = models.AutoField(primary_key=True)
    tagname = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    lastupdated_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return self.tagname

class Category(models.Model): # Category 테이블 정의, 1:N 관계
    categoryid = models.AutoField(primary_key=True)
    categoryname = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    lastupdated_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return self.categoryname

class Post(models.Model): # Post 테이블 정의, 1:N 관계
    postid = models.AutoField(primary_key=True)
    userid = models.ForeignKey(User, on_delete=models.CASCADE)
    categoryid = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    tagid = models.ManyToManyField(Tag, blank=True)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return self.title

class Comment(models.Model): # Comment 테이블 정의, 1:N 관계
    commentid = models.AutoField(primary_key=True)
    userid = models.ForeignKey(User, on_delete=models.CASCADE)
    postid = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.content