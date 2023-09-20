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

class User(AbstractBaseUser, PermissionsMixin): # 유저 테이블 정의, 1:N 관계
    userid = models.CharField(verbose_name='User ID', max_length=32, primary_key=True) # userid를 기본키로 설정
    password = models.CharField(verbose_name='User Password', max_length=128)
    nickname = models.CharField(verbose_name='User Nickname', max_length=64, unique=True)
    email = models.EmailField(verbose_name='User Email', max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True) # 생성 시간
    updated_at = models.DateTimeField(auto_now=True) # 수정 시간
    last_login = models.DateTimeField(null=True) # 마지막 로그인 시간
    is_active = models.BooleanField(default=True) # 계정 활성화 여부
    is_admin = models.BooleanField(default=False) # 관리자 여부
    is_reported = models.BooleanField(default=False) # 신고됨 여부
    is_banned = models.BooleanField(default=False) # 차단됨 여부
    
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

class UserReportDetail(models.Model): # 유저신고 테이블 정의, 1:N 관계
    reportid = models.AutoField(verbose_name='Report ID', primary_key=True)
    userid = models.ForeignKey(User, verbose_name='User ID', on_delete=models.SET_NULL, null=True, blank=True, related_name='reporter')
    targetid = models.ForeignKey(User, verbose_name='Reporter ID', on_delete=models.CASCADE, null=True, blank=True)
    reportreason = models.CharField(verbose_name='Report Reason', max_length=128)
    reportat = models.DateTimeField(auto_now_add=True)
    evidence_type = models.CharField(verbose_name='Evidence Type', max_length=32, null=True, blank=True)
    evidence_targetid = models.IntegerField(verbose_name='Evidence Target ID')
    evidence_url = models.CharField(verbose_name='Evidence URL', max_length=256, null=True, blank=True)
    def __str__(self):
        return self.reportreason
    
class UserBanDetail(models.Model): # 유저 밴 테이블 정의, 1:N 관계
    banid = models.AutoField(verbose_name='Ban ID', primary_key=True)
    userid = models.ForeignKey(User, verbose_name='User ID', on_delete=models.CASCADE, null=True, blank=True, related_name='banneduser')
    bannedby = models.ForeignKey(User, verbose_name='Blocker ID', on_delete=models.SET_NULL, null=True, blank=True)
    bannedreason = models.CharField(verbose_name='Block Reason', max_length=128)
    bannedat = models.DateTimeField(auto_now_add=True)
    banneduntil = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.bannedreason

class ForcedControl(models.Model): # 강제 콘텐츠 제어 테이블 정의, 1:N 관계
    controlid = models.AutoField(verbose_name='Control ID', primary_key=True)
    adminid = models.ForeignKey(User, verbose_name='Admin ID', on_delete=models.SET_NULL, null=True, blank=True, related_name='admin')
    targetid = models.ForeignKey(User, verbose_name='Target ID', on_delete=models.SET_NULL, null=True, blank=True, related_name='target')
    contenttype = models.CharField(verbose_name='Content Type', max_length=32)
    contentid = models.CharField(verbose_name='Content ID', max_length=32)
    reason = models.CharField(verbose_name='Reason', max_length=128)
    modified_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    def __str__(self):
        return self.reason

class Tag(models.Model): # 게시물 태그 테이블 정의, N:M 관계
    tagid = models.AutoField(verbose_name='Tag ID', primary_key=True)
    userid = models.ForeignKey(User, verbose_name='Tag Creator', on_delete=models.SET_NULL, null=True, blank=True)
    tagname = models.CharField(verbose_name='Tag Name', max_length=32, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.tagname

class Category(models.Model): # 게시물 카테고리 테이블 정의, 1:N 관계
    categoryid = models.AutoField(verbose_name='Category ID', primary_key=True)
    userid = models.ForeignKey(User, verbose_name='Category Creator', on_delete=models.SET_NULL, null=True, blank=True)
    categoryname = models.CharField(verbose_name='Category Name', max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.categoryname

class Post(models.Model): # 게시물 테이블 정의, 1:N 관계
    postid = models.AutoField(verbose_name='Post ID', primary_key=True)
    userid = models.ForeignKey(User, verbose_name='Post Creator', on_delete=models.CASCADE, null=True, blank=True)
    categoryid = models.ForeignKey(Category, verbose_name='Post Category', on_delete=models.SET_NULL, null=True, blank=True)
    tagid = models.ManyToManyField(Tag, verbose_name='Post Tags', blank=True)
    title = models.CharField(verbose_name='Post Title', max_length=128)
    content = models.TextField(verbose_name='Post Content')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(verbose_name='Published', default=True)
    secret_password = models.CharField(verbose_name='Secret Password', max_length=128, null=True, blank=True)
    is_secret = models.BooleanField(verbose_name='Secret', default=False)
    def __str__(self):
        return self.title

class Comment(models.Model): # 댓글 테이블 정의, 1:N 관계
    commentid = models.AutoField(verbose_name='Comment ID', primary_key=True)
    postid = models.ForeignKey(Post, verbose_name='Comment Post ID', on_delete=models.CASCADE, null=True, blank=True)
    userid = models.ForeignKey(User, verbose_name='Comment Creator', on_delete=models.CASCADE, null=True, blank=True)
    content = models.CharField(verbose_name='Comment Content', max_length=1024)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_secret = models.BooleanField(default=False)
    def __str__(self):
        return self.content