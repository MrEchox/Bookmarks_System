# Generated by Django 5.1.5 on 2025-01-27 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookmarksystem', '0005_rename_user_bookmark_workspace'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmark',
            name='url',
            field=models.URLField(blank=True, max_length=256, null=True),
        ),
    ]
