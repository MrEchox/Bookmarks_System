from django.contrib import admin

# Register your models here.

from .models import Bookmark, Workspace
admin.site.register(Bookmark)
admin.site.register(Workspace)