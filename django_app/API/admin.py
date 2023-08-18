from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.hashers import make_password

from .models import *
from django.utils import timezone

class CustomUserAdmin(UserAdmin):
    list_display = ('userid', 'nickname', 'email', 'is_active', 'is_admin', 'is_superuser', 'created_at', 'updated_at', 'last_login')
    list_filter = ('is_active', 'is_admin', 'is_superuser', 'created_at', 'updated_at', 'last_login')
    search_fields = ('userid', 'nickname', 'email')
    readonly_fields = ('created_at', 'updated_at', 'last_login')
    ordering = ('userid',)
    
    fieldsets = (
        (None, {'fields': ('userid', 'password')}),
        ('Personal Info', {'fields': ('nickname', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_admin', 'is_superuser')}),
        ('Important Dates', {'fields': ('created_at', 'updated_at', 'last_login')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('userid', 'nickname', 'email', 'password1', 'password2', 'is_admin'),
        }),
    )
    
    ordering = ('userid',)
    filter_horizontal = ()

class TagAdmin(admin.ModelAdmin):
    list_display = ('tagid', 'tagname', 'userid', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('tagid', 'tagname', 'userid__userid')
    readonly_fields = ('userid', 'created_at', 'updated_at')

    fieldsets = (
        (None, {'fields': ('userid', 'tagname',)}),
        ('Tag Info', {'fields': ('created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('userid', 'tagname',),
        }),
    )

    ordering = ('tagid',)
    filter_horizontal = ()

    def save_model(self, request, obj, form, change):
        if not obj.userid:
            obj.userid = request.user
        obj.save()

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('categoryid', 'categoryname', 'userid', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('categoryid', 'categoryname', 'userid__userid')
    readonly_fields = ('userid', 'created_at', 'updated_at')

    fieldsets = (
        (None, {'fields': ('userid', 'categoryname',)}),
        ('Category Info', {'fields': ('created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('userid', 'categoryname',),
        }),
    )

    ordering = ('categoryid',)
    filter_horizontal = ()

    def save_model(self, request, obj, form, change):
        if not obj.userid:
            obj.userid = request.user
        obj.save()
    
class PostAdmin(admin.ModelAdmin):
    list_display = ('postid', 'title', 'userid', 'categoryid', 'is_secret', 'is_published', 'published_at', 'created_at', 'updated_at')
    list_filter = ('is_secret', 'is_published', 'published_at', 'created_at', 'updated_at')
    search_fields = ('postid', 'userid__userid', 'categoryid__categoryid', 'tagid__tagid', 'title', 'content')
    readonly_fields = ('userid', 'published_at', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('userid', 'title', 'content')}),
        ('Post Feature', {'fields': ('categoryid', 'tagid')}),
        ('Post Info', {'fields': ('published_at', 'created_at', 'updated_at')}),
        ('Post Public', {'fields': ('is_secret', 'secret_password', 'is_published')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('userid', 'title', 'content', 'categoryid', 'tagid', 'is_secret', 'is_published'),
        }),
    )
    
    ordering = ('postid',)
    filter_horizontal = ()
    
    def save_model(self, request, obj, form, change):
        if not obj.userid:
            obj.userid = request.user
            
        if obj.is_published is True and obj.published_at is None:
            obj.published_at = timezone.now()
        else:
            obj.published_at = None

        if obj.is_secret is True and not obj.secret_password.startswith('pbkdf2_sha256'):
            obj.secret_password = make_password(obj.secret_password)
            
        obj.save()

class CommentAdmin(admin.ModelAdmin):
    list_display = ('commentid', 'postid', 'userid', 'is_secret', 'created_at', 'updated_at')
    list_filter = ('is_secret', 'created_at', 'updated_at')
    search_fields = ('commentid', 'postid__postid', 'userid__userid', 'content')
    readonly_fields = ('userid', 'created_at', 'updated_at')

    fieldsets = (
        (None, {'fields': ('userid', 'postid', 'content')}),
        ('Comment Info', {'fields': ('created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('userid', 'postid', 'content'),
        }),
    )

    ordering = ('commentid',)
    filter_horizontal = ()

    def save_model(self, request, obj, form, change):
        if not obj.userid:
            obj.userid = request.user
        obj.save()
        
# Register your models here.
admin.site.register(User, CustomUserAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)