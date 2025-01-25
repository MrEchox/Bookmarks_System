from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import BookmarkSerializer, RegsiterUserSerializer, WorkspaceSerializer
from bookmarksystem.models import Bookmark, Workspace

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    
    return Response(routes)

# Bookmark API

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBookmarks(request):
    user = request.user
    bookmarks = user.bookmark_set.all()
    serializer = BookmarkSerializer(bookmarks, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateBookmark(request):
    user = request.user
    data = request.data
    bookmark = Bookmark.objects.get(id=data['id'])
    if bookmark.user == user:
        serializer = BookmarkSerializer(instance=bookmark, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'You are not authorized to update this bookmark'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createBookmark(request):
    user = request.user
    data = request.data
    data['user'] = user.id
    serializer = BookmarkSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteBookmark(request, pk):
    user = request.user
    bookmark = Bookmark.objects.get(id=pk)
    if bookmark.user == user:
        bookmark.delete()
        return Response({'message': 'Bookmark deleted'}, status=status.HTTP_204_NO_CONTENT)
    return Response({'message': 'You are not authorized to delete this bookmark'}, status=status.HTTP_401_UNAUTHORIZED)

# Workspace API

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWorkspaces(request):
    user = request.user
    workspaces = user.workspace_set.all()
    serializer = WorkspaceSerializer(workspaces, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createWorkspace(request):
    user = request.user
    data = request.data
    data['user'] = user.id
    serializer = WorkspaceSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteWorkspace(request, pk):
    user = request.user
    workspace = Workspace.objects.get(id=pk)
    if workspace.user == user:
        workspace.delete()
        return Response({'message': 'Workspace deleted'}, status=status.HTTP_204_NO_CONTENT)
    return Response({'message': 'You are not authorized to delete this workspace'}, status=status.HTTP_401_UNAUTHORIZED)

# User API

@api_view(['POST'])
def createUser(request):
    serializer = RegsiterUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'User Created'}, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

