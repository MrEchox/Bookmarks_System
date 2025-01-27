from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Workspace(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Bookmark(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, null=False)
    title = models.CharField(max_length=256)
    url = models.URLField(max_length=256)
    tag = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    