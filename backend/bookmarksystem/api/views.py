from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import BookmarkSerializer
from bookmarksystem.models import Bookmark

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    
    return Response(routes)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBookmarks(request):
    user = request.user
    bookmarks = user.bookmark_set.all()
    serializer = BookmarkSerializer(bookmarks, many=True)
    return Response(serializer.data)

