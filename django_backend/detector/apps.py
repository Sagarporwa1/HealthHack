from django.apps import AppConfig


class DetectorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'detector'
    
    def ready(self):
        """Initialize detector when app is ready"""
        from detector.detector_service import get_detector
        try:
            get_detector()
        except Exception as e:
            print(f"Warning: Could not initialize detector: {e}")
