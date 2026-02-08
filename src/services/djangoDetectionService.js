import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabaseClient';

// Configure this based on your Django server location
const DJANGO_BASE_URL = 'http://172.25.244.109:8000';
const DJANGO_API_URL = `${DJANGO_BASE_URL}/api/detect/`;
const DJANGO_HEALTH_URL = `${DJANGO_BASE_URL}/api/health/`;
const TIMEOUT = 30000; // 30 seconds

const axiosInstance = axios.create({
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the Supabase JWT
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Error getting Supabase session for API call:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class DjangoDetectionService {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Test connection to Django backend
   */
  async testConnection() {
    try {
      const response = await axiosInstance.get(DJANGO_HEALTH_URL);
      this.isConnected = response.status === 200;
      return this.isConnected;
    } catch (error) {
      console.error('Connection test failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Send image to Django backend for disease detection
   * @param {string} imagePath - Path to image file
   * @returns {Promise<object>} Detection results
   */
  async detectDisease(imagePath) {
    try {
      // Check connection first
      const connected = await this.testConnection();
      if (!connected) {
        throw new Error('Cannot connect to Django backend. Check server URL and network.');
      }

      // Read image file and convert to base64
      const imageBase64 = await FileSystem.readAsStringAsync(imagePath, {
        encoding: 'base64',
      });

      // Send to Django backend
      const response = await axiosInstance.post(DJANGO_API_URL, {
        image: imageBase64,
      });

      // Validate response
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      return {
        hasDiseaseDetected: response.data.hasDiseaseDetected,
        diseasePercentage: response.data.diseasePercentage,
        severityLevel: response.data.severityLevel,
        confidence: response.data.confidence,
        thresholdUsed: response.data.thresholdUsed,
      };
    } catch (error) {
      console.error('Disease detection failed:', error.message);
      throw this._formatError(error);
    }
  }

  /**
   * Format error message for user display
   */
  _formatError(error) {
    if (error.response) {
      // Server responded with error status
      return new Error(
        error.response.data?.error ||
        `Server error: ${error.response.status}`
      );
    } else if (error.request) {
      // Request sent but no response
      return new Error('No response from server. Check Django server is running.');
    } else {
      // Something happened with the request setup
      return error;
    }
  }

  /**
   * Get severity description
   */
  getSeverityDescription(severity) {
    const descriptions = {
      HEALTHY: 'No disease detected. Oral health is good.',
      MILD: 'Mild signs detected. Consider dental consultation.',
      MODERATE: 'Moderate disease detected. Dental visit recommended.',
      SEVERE: 'Severe disease detected. Urgent dental care needed.',
      CRITICAL: 'Critical condition detected. Seek immediate dental attention.',
    };
    return descriptions[severity] || 'Unable to determine status';
  }

  /**
   * Get recommendations based on severity
   */
  getRecommendations(severity) {
    const recommendations = {
      HEALTHY: [
        'Continue regular oral hygiene',
        'Brush twice daily with fluoride toothpaste',
        'Floss daily',
        'Visit dentist every 6 months',
      ],
      MILD: [
        'Increase oral hygiene frequency',
        'Use antimicrobial mouthwash',
        'Schedule dentist appointment',
        'Avoid tobacco and alcohol',
      ],
      MODERATE: [
        'Schedule dentist appointment immediately',
        'Implement strict oral hygiene routine',
        'Use prescribed medications',
        'Monitor changes closely',
      ],
      SEVERE: [
        'Contact dentist urgently',
        'Follow all prescribed treatments',
        'May require specialist consultation',
        'Regular monitoring essential',
      ],
      CRITICAL: [
        'Seek immediate dental care',
        'May require hospitalization',
        'Follow emergency protocols',
        'Specialist treatment likely needed',
      ],
    };
    return recommendations[severity] || [];
  }
}

export default new DjangoDetectionService();
