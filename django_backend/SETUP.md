# Django Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd django_backend
pip install -r requirements.txt
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# For development:
# - DEBUG=True
# - SECRET_KEY=your-secret-key
# - ALLOWED_HOSTS=localhost,127.0.0.1,192.168.x.x
# - CORS_ALLOWED_ORIGINS=http://localhost:8000,http://192.168.x.x:8081
```

### 3. Create Database
```bash
python manage.py migrate
```

### 4. Run Django Server
```bash
# Development
python manage.py runserver 0.0.0.0:8000

# Or production with gunicorn
gunicorn config.wsgi --bind 0.0.0.0:8000
```

Server will be available at:
- Local: `http://localhost:8000`
- Network: `http://192.168.x.x:8000` (replace with your IP)

### 5. Test API Endpoint
```bash
# Health check
curl http://localhost:8000/api/health/

# Test detection (with base64 image)
curl -X POST http://localhost:8000/api/detect/ \
  -H "Content-Type: application/json" \
  -d '{"image": "your_base64_image_here"}'
```

## Project Structure
```
django_backend/
├── manage.py              # Django management
├── requirements.txt       # Python dependencies
├── .env.example          # Environment template
├── config/               # Django config
│   ├── settings.py       # Settings
│   ├── urls.py          # URL routing
│   └── wsgi.py          # WSGI app
└── detector/            # Main app
    ├── detector_service.py  # TFLite model service
    ├── views.py            # API endpoints
    └── apps.py             # App config
```

## API Endpoints

### POST /api/detect/
Detect disease from image

**Request:**
```json
{
  "image": "base64_encoded_image_string"
}
```

**Response:**
```json
{
  "diseasePercentage": 15.5,
  "severityLevel": "MODERATE",
  "hasDiseaseDetected": true,
  "confidence": 0.155,
  "thresholdUsed": 0.5
}
```

### GET /api/health/
Health check endpoint

**Response:**
```json
{
  "status": "ok"
}
```

## Configuration

### Model Path
Set in `.env`:
```
MODEL_PATH=../ml_model/oral_segmentation_quantized.tflite
```

### CORS Settings
Update `CORS_ALLOWED_ORIGINS` in `.env` to allow your React Native app:
```
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://192.168.1.100:8081
```

### React Native Configuration
Update your React Native app to point to Django server:

```javascript
// In src/services/djangoDetectionService.js
const DJANGO_API_URL = 'http://YOUR_SERVER_IP:8000/api/detect/';
```

To find your server IP:
- **Windows**: `ipconfig` → Look for IPv4 Address
- **macOS/Linux**: `ifconfig` or `hostname -I`

## Troubleshooting

### Model Not Found
- Check `.env` MODEL_PATH is correct
- Ensure `oral_segmentation_quantized.tflite` exists
- Run from django_backend directory

### Connection Refused from React Native
- Check Django server is running: `curl http://localhost:8000/api/health/`
- Use correct IP address (not localhost)
- Ensure firewall allows port 8000
- Check CORS_ALLOWED_ORIGINS includes your React Native app IP

### CORS Errors
Add your React Native app origin to `.env`:
```
CORS_ALLOWED_ORIGINS=http://192.168.1.100:8081
```

### TensorFlow Import Errors
- Reinstall TensorFlow: `pip install --upgrade tensorflow`
- On ARM64 (Apple Silicon): Use `tensorflow-macos`
- Check Python version: `python --version` (need 3.8+)

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn config.wsgi --bind 0.0.0.0:8000 --workers 4
```

### Using Docker
```bash
docker build -t oral-detector-api .
docker run -p 8000:8000 oral-detector-api
```

### Using Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Environment Variables
Update before deployment:
- `DEBUG=False`
- `SECRET_KEY=generate-strong-key`
- `ALLOWED_HOSTS=yourdomain.com`
- `CORS_ALLOWED_ORIGINS=https://yourdomain.com`

## Performance Tips

1. **Increase Workers**: In production, use multiple gunicorn workers
2. **Add Caching**: Cache model in memory (already done)
3. **Image Optimization**: Compress images before sending
4. **Connection Pooling**: Use persistent connections
5. **Load Balancing**: Use Nginx in front of Django

## Monitoring

Monitor Django logs:
```bash
# View logs
tail -f logs/django.log

# Check memory usage
python manage.py shell
>>> from detector.detector_service import get_detector
>>> detector = get_detector()
```

## Next Steps

1. ✅ Set up Django backend
2. ✅ Configure environment variables
3. ✅ Update React Native service
4. ⬜ Test detection with sample images
5. ⬜ Deploy to production
