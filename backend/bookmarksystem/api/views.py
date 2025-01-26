from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .utils import check_url_status
from .serializers import BookmarkSerializer, RegsiterUserSerializer, WorkspaceSerializer, URLSerializer
from bookmarksystem.models import Bookmark, Workspace

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
        'api/register/',
        
        'api/workspaces/',
        'api/workspaces/delete/<str:workspace_id>/',
        'api/workspaces/<str:workspace_id>/bookmarks/',
        'api/workspaces/<str:workspace_id>/bookmarks/delete/<str:bookmark_id>/',
        'api/workspaces/<str:workspace_id>/bookmarks/update/<str:bookmark_id>/',
        
        'api/check-url',
    ]
    
    return Response(routes)

# Bookmark API
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bookmarkOperations(request, workspace_id):
    user = request.user

    if request.method == 'GET':
        try:
            workspace = Workspace.objects.get(id=workspace_id, user=user)
        except Workspace.DoesNotExist:
            return Response({'message': 'Workspace not found'}, status=status.HTTP_404_NOT_FOUND)
        
        bookmarks = Bookmark.objects.filter(workspace=workspace)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)
            

    elif request.method == 'POST':
        try :
            workspace = Workspace.objects.get(id=workspace_id, user=user)
        except Workspace.DoesNotExist:
            return Response({'message': 'Workspace not found'}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        data['workspace'] = workspace.id
        serializer = BookmarkSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateBookmark(request, workspace_id, bookmark_id):
    user = request.user
    bookmark = Bookmark.objects.get(id=bookmark_id)
    workspace = Workspace.objects.get(id=workspace_id)
    if workspace.user == user:
        if bookmark.workspace == workspace:
            serializer = BookmarkSerializer(instance=bookmark, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'You are not authorized to update this bookmark'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteBookmark(request, workspace_id, bookmark_id):
    user = request.user
    bookmark = Bookmark.objects.get(id=bookmark_id)
    workspace = Workspace.objects.get(id=workspace_id)
    if workspace.user == user:
        if bookmark.workspace == workspace:
            bookmark.delete()
            return Response({'message': 'Bookmark deleted'}, status=status.HTTP_204_NO_CONTENT)
    return Response({'message': 'You are not authorized to delete this bookmark'}, status=status.HTTP_401_UNAUTHORIZED)


# Workspace API

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def workspaceOperations(request):
    user = request.user

    if request.method == 'GET':
        workspaces = user.workspace_set.all()
        serializer = WorkspaceSerializer(workspaces, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        data['user'] = user.id
        serializer = WorkspaceSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteWorkspace(request, workspace_id):
    user = request.user
    workspace = Workspace.objects.get(id=workspace_id)
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

# Util API

@api_view(['GET'])
def checkBookmarkStatus(request):
    url = URLSerializer(data=request.data)
    if not url:
        return JsonResponse({'message': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)
    urlStatus = check_url_status(url)
    return JsonResponse({'status': urlStatus}, status=status.HTTP_200_OK)
        