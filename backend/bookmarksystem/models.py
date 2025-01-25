from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null = True)
    title = models.CharField(max_length=256)
    url = models.URLField(max_length=256)
    tags = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title