# Generated by Django 5.1.5 on 2025-01-25 15:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bookmarksystem', '0002_remove_bookmark_description_alter_bookmark_tags'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bookmark',
            old_name='tags',
            new_name='tag',
        ),
    ]
