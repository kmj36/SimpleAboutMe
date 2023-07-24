from django.db import models

# Create your models here.
class User(models.Model): # User 테이블 정의, 1:N 관계
    userid = models.CharField(max_length=20, primary_key=True)
    password = models.CharField(max_length=30)
    nickname = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.userid

class Tag(models.Model): # Tag 테이블 정의, N:M 관계
    tagid = models.AutoField(primary_key=True)
    tagname = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.tagname

class Category(models.Model): # Category 테이블 정의, 1:N 관계
    categoryid = models.AutoField(primary_key=True)
    categoryname = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
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
    def __str__(self):
        return self.title

class Comment(models.Model): # Comment 테이블 정의, 1:N 관계
    commentid = models.AutoField(primary_key=True)
    userid = models.ForeignKey(User, on_delete=models.CASCADE)
    postid = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.content