# Generated by Django 4.2.3 on 2023-12-28 01:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0045_imageupload'),
    ]

    operations = [
        migrations.RenameField(
            model_name='imageupload',
            old_name='upload',
            new_name='image',
        ),
    ]