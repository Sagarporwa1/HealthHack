from django.urls import path, include
from rest_framework.routers import DefaultRouter
from detector.views import DetectDiseaseView

router = DefaultRouter()

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/detect/', DetectDiseaseView.as_view(), name='detect-disease'),
    path('api/health/', lambda request: __import__('django.http', fromlist=['JsonResponse']).JsonResponse({'status': 'ok'}), name='health-check'),
]
