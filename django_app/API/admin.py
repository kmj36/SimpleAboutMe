from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

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
    
class PostAdmin(admin.ModelAdmin):
    list_display = ('postid', 'userid', 'categoryid', 'title', 'is_secret', 'is_published', 'published_at', 'created_at', 'updated_at')
    list_filter = ('is_secret', 'published_at', 'created_at', 'updated_at')
    search_fields = ('userid', 'categoryid', 'title', 'content')
    readonly_fields = ('userid', 'published_at', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('userid', 'title', 'content')}),
        ('Post Feature', {'fields': ('categoryid', 'tagid')}),
        ('Post Info', {'fields': ('published_at', 'created_at', 'updated_at')}),
        ('Post Public', {'fields': ('is_secret', 'is_published')}),
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
            
        if not obj.published_at:
            obj.published_at = timezone.now()
            
        obj.save()
        
# Register your models here.
admin.site.register(User, CustomUserAdmin)
admin.site.register(Tag)
admin.site.register(Category)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment)