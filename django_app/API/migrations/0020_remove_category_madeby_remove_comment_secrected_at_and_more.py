# Generated by Django 4.2.3 on 2023-08-17 01:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0019_remove_category_lastupdated_at_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='madeby',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='secrected_at',
        ),
        migrations.RemoveField(
            model_name='post',
            name='published_at',
        ),
        migrations.RemoveField(
            model_name='post',
            name='secrected_at',
        ),
        migrations.RemoveField(
            model_name='tag',
            name='madeby',
        ),
        migrations.AddField(
            model_name='category',
            name='userid',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Category Creator'),
        ),
        migrations.AddField(
            model_name='tag',
            name='userid',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Tag Creator'),
        ),
        migrations.AlterField(
            model_name='category',
            name='categoryid',
            field=models.AutoField(primary_key=True, serialize=False, verbose_name='Category ID'),
        ),
        migrations.AlterField(
            model_name='category',
            name='categoryname',
            field=models.CharField(max_length=64, unique=True, verbose_name='Category ID'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='commentid',
            field=models.AutoField(primary_key=True, serialize=False, verbose_name='Comment ID'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='content',
            field=models.CharField(max_length=1024, null=True, verbose_name='Comment Content'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='postid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.post', verbose_name='Comment Post ID'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='userid',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Comment Creator'),
        ),
        migrations.AlterField(
            model_name='post',
            name='categoryid',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='API.category', verbose_name='Post Category'),
        ),
        migrations.AlterField(
            model_name='post',
            name='content',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='postid',
            field=models.AutoField(primary_key=True, serialize=False, verbose_name='Post ID'),
        ),
        migrations.AlterField(
            model_name='post',
            name='tagid',
            field=models.ManyToManyField(blank=True, to='API.tag', verbose_name='Post Tags'),
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(max_length=128, verbose_name='Post Title'),
        ),
        migrations.AlterField(
            model_name='post',
            name='userid',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Post Creator'),
        ),
        migrations.AlterField(
            model_name='tag',
            name='tagid',
            field=models.AutoField(primary_key=True, serialize=False, verbose_name='Tag ID'),
        ),
        migrations.AlterField(
            model_name='tag',
            name='tagname',
            field=models.CharField(max_length=32, unique=True, verbose_name='Tag Name'),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=256, unique=True, verbose_name='User Email'),
        ),
        migrations.AlterField(
            model_name='user',
            name='nickname',
            field=models.CharField(max_length=64, unique=True, verbose_name='User Nickname'),
        ),
    ]
