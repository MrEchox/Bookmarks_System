from rest_framework.serializers import ModelSerializer
from bookmarksystem.models import Bookmark, Workspace
from django.contrib.auth.models import User

class BookmarkSerializer(ModelSerializer):
    class Meta:
        model = Bookmark
        fields = '__all__'
        
class WorkspaceSerializer(ModelSerializer):
    class Meta:
        model = Workspace
        fields = '__all__'
        
class RegsiterUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user
    
class URLSerializer(ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['url']