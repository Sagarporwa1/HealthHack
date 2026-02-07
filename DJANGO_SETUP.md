# Quick Start: Django + React Native Setup

## Project Structure
```
HealthHack/
├── django_backend/           # Django API server
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── detector/
│   │   ├── detector_service.py  # TFLite model
│   │   ├── views.py            # API endpoints
│   │   └── apps.py
│   └── SETUP.md             # Detailed Django setup
│
├── src/
│   ├── services/
│   │   └── djangoDetectionService.js  # Updated to use Django
│   └── screens/
│       └── CameraScreen.js            # Updated UI
│
└── ml_model/
    └── oral_segmentation_quantized.tflite
```

## 🚀 Quick Setup (5 minutes)

### Step 1: Setup Django Backend
```bash
cd django_backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver 0.0.0.0:8000
```

Server running at: `http://localhost:8000`

### Step 2: Configure React Native

Find your Django server IP:
```bash
# Windows
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)

# macOS/Linux
ifconfig
# or
hostname -I
```

Edit [src/services/djangoDetectionService.js](src/services/djangoDetectionService.js):
```javascript
// Line 7 - Change IP address
const DJANGO_API_URL = 'http://192.168.1.100:8000/api/detect/';  // Your IP here
```

### Step 3: Test Connection

In React Native:
- App will show connection status (✓ or ✗) in camera header
- Press "Check Connection" button to verify
- If offline, check IP address and firewall

### Step 4: Run App
```bash
# From project root
npm start  # or expo start
```

## 🔌 API Endpoints

### Health Check
```bash
GET http://localhost:8000/api/health/
```

### Detect Disease
```bash
POST http://localhost:8000/api/detect/
Content-Type: application/json

{
  "image": "base64_encoded_image"
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

## 🐛 Troubleshooting

### "Cannot connect to Django server"
- ✅ Django running? `python manage.py runserver 0.0.0.0:8000`
- ✅ Correct IP in djangoDetectionService.js?
- ✅ Firewall allows port 8000?
- ✅ Same network? (Not different WiFi networks)

### "Model not found"
- ✅ File exists: `ml_model/oral_segmentation_quantized.tflite`
- ✅ Check `.env` MODEL_PATH points to correct location

### "CORS error"
- Update `.env`: `CORS_ALLOWED_ORIGINS=http://192.168.1.100:8081`
- Restart Django

## 📱 Testing with Postman/cURL

```bash
# Get image as base64
base64 -i test.jpg > base64_image.txt

# Test detection
curl -X POST http://localhost:8000/api/detect/ \
  -H "Content-Type: application/json" \
  -d @test_payload.json
```

## 📊 How It Works

1. **React Native**: User captures image → Converts to base64
2. **Network**: Sends to Django at `http://server:8000/api/detect/`
3. **Django**: Receives image → Loads TFLite model
4. **Inference**: Processes image → Calculates disease percentage
5. **Response**: Returns severity level & confidence
6. **Display**: Shows results in React Native UI

## 🔒 Production Checklist

- [ ] Change Django `SECRET_KEY` in `.env`
- [ ] Set `DEBUG=False` in `.env`
- [ ] Use HTTPS (SSL certificate)
- [ ] Restrict `CORS_ALLOWED_ORIGINS`
- [ ] Add authentication/API keys
- [ ] Use proper database (PostgreSQL)
- [ ] Deploy with Gunicorn + Nginx
- [ ] Set proper `ALLOWED_HOSTS`

## 📚 Documentation

- [Django Setup Details](django_backend/SETUP.md)
- [Original Integration Guide](REACT_NATIVE_INTEGRATION.md)

## 💡 Next Steps

1. Test with sample oral images
2. Adjust confidence thresholds if needed
3. Add user authentication to Django
4. Store detection history in database
5. Add admin dashboard for analytics

---

**Questions?** Check logs:
- Django: `python manage.py runserver` (console output)
- React Native: Check `Expo` / `Android Logcat` / `Xcode` console
