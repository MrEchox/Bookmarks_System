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
    
    path('workspaces/get', views.getWorkspaces),
    path('workspaces/create', views.createWorkspace),
    path('workspaces/delete/<str:pk>', views.deleteWorkspace),
    
    path('bookmarks/get', views.getBookmarks),
    path('bookmarks/create', views.createBookmark),
    path('bookmarks/update', views.updateBookmark),
    path('bookmarks/delete/<str:pk>', views.deleteBookmark),
]