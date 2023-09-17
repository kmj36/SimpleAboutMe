# Generated by Django 4.2.3 on 2023-08-01 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0017_remove_user_is_staff'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='is_secret',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='comment',
            name='secrected_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]