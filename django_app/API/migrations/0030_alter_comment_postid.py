# Generated by Django 4.2.3 on 2023-09-18 19:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0029_user_is_banned_user_is_reported_alter_comment_userid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='postid',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='API.post', verbose_name='Comment Post ID'),
        ),
    ]