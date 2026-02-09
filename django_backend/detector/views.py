from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework import status, permissions
from detector.detector_service import get_detector
import logging

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class DetectDiseaseView(APIView):
    """API endpoint for disease detection"""
    permission_classes = [permissions.AllowAny]
    authentication_classes = [] # Disable authentication for testing
    
    def post(self, request):
        logger.info(f"Received POST request to /api/detect/. Data keys: {list(request.data.keys()) if hasattr(request, 'data') else 'No data'}")
        """
        Detect oral disease from uploaded image
        
        Expected request format:
        {
            "image": "base64_encoded_image_string"
        }
        """
        try:
            # Validate input
            if 'image' not in request.data:
                return Response(
                    {'error': 'Missing "image" field in request'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            image_base64 = request.data.get('image')
            
            # Validate image is not empty
            if not image_base64 or len(image_base64) == 0:
                return Response(
                    {'error': 'Image data is empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get detector instance
            detector = get_detector()
            
            # Run detection
            results = detector.detect(image_base64)
            
            return Response(results, status=status.HTTP_200_OK)
        
        except ValueError as e:
            logger.error(f"Invalid image data: {str(e)}")
            return Response(
                {'error': f'Invalid image data: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Detection error: {str(e)}")
            return Response(
                {'error': f'Detection failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request):
        """Health check endpoint"""
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)
