from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.createUser),
    
    path('workspaces/', views.workspaceOperations),
    path('workspaces/delete/<str:workspace_id>/', views.deleteWorkspace),
    
    path('workspaces/<str:workspace_id>/bookmarks/', views.bookmarkOperations),
    path('workspaces/<str:workspace_id>/bookmarks/delete/<str:bookmark_id>/', views.deleteBookmark),
    path('workspaces/<str:workspace_id>/bookmarks/update/<str:bookmark_id>/', views.updateBookmark),
    
    path('check-url/', views.checkBookmarkStatus),
]