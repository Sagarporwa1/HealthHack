import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class DiseaseDetector:
    """TFLite model wrapper for oral disease detection"""
    
    def __init__(self):
        self.interpreter = None
        self.input_details = None
        self.output_details = None
        self.input_size = 256
        self.threshold = 0.5
        self._load_model()
    
    def _load_model(self):
        """Load TFLite model"""
        try:
            model_path = settings.MODEL_PATH
            
            if not os.path.exists(model_path):
                logger.error(f"Model file not found: {model_path}")
                raise FileNotFoundError(f"Model not found at {model_path}")
            
            self.interpreter = tf.lite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            
            logger.info(f"Model loaded successfully from {model_path}")
            logger.info(f"Input shape: {self.input_details[0]['shape']}")
            logger.info(f"Output shape: {self.output_details[0]['shape']}")
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise
    
    def detect(self, image_base64):
        """
        Detect disease from base64 encoded image
        
        Args:
            image_base64: Base64 encoded image string
        
        Returns:
            dict: Detection results with severity and percentage
        """
        try:
            # Decode image
            image_bytes = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Preprocess
            image_resized = image.resize((self.input_size, self.input_size))
            input_data = np.array(image_resized, dtype=np.float32) / 255.0
            
            # Add batch dimension
            input_data = np.expand_dims(input_data, axis=0)
            
            # Run inference
            self.interpreter.set_tensor(
                self.input_details[0]['index'], 
                input_data
            )
            self.interpreter.invoke()
            
            output = self.interpreter.get_tensor(self.output_details[0]['index'])
            
            # Process results
            results = self._process_output(output)
            
            logger.info(f"Detection completed: {results}")
            return results
            
        except Exception as e:
            logger.error(f"Detection failed: {str(e)}")
            raise
    
    def _process_output(self, output):
        """Process model output and calculate metrics"""
        try:
            # Flatten output
            flat_output = output.flatten()
            
            # Calculate disease percentage
            disease_pixels = np.sum(flat_output > self.threshold)
            total_pixels = len(flat_output)
            disease_percentage = (disease_pixels / total_pixels) * 100
            
            # Determine severity
            severity = self._get_severity(disease_percentage)
            
            # Calculate confidence
            confidence = self._calculate_confidence(disease_percentage)
            
            return {
                'diseasePercentage': float(disease_percentage),
                'severityLevel': severity,
                'hasDiseaseDetected': disease_percentage > 1.0,
                'confidence': float(confidence),
                'thresholdUsed': float(self.threshold),
            }
        except Exception as e:
            logger.error(f"Output processing failed: {str(e)}")
            raise
    
    def _get_severity(self, percentage):
        """Classify severity level based on disease percentage"""
        if percentage < 1.0:
            return 'HEALTHY'
        elif percentage < 5.0:
            return 'MILD'
        elif percentage < 15.0:
            return 'MODERATE'
        elif percentage < 30.0:
            return 'SEVERE'
        else:
            return 'CRITICAL'
    
    def _calculate_confidence(self, percentage):
        """Calculate confidence score"""
        return min(percentage / 100.0, 1.0)


# Global detector instance
_detector = None


def get_detector():
    """Get or create detector instance"""
    global _detector
    if _detector is None:
        _detector = DiseaseDetector()
    return _detector
