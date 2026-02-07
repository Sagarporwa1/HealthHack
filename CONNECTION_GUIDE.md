# Django + React Native Connection Guide

## Files Modified/Created

### New Files
✅ `django_backend/` - Complete Django project
- `requirements.txt` - Python dependencies
- `.env.example` - Environment template
- `config/settings.py` - Django settings
- `config/urls.py` - URL routing
- `detector/detector_service.py` - TFLite model wrapper
- `detector/views.py` - API endpoints

### Updated Files
✅ `src/services/djangoDetectionService.js` - Django API client
✅ `src/screens/CameraScreen.js` - Connection status & Django integration
✅ `DJANGO_SETUP.md` - This setup guide

---

## Installation Steps

### 1. Backend Setup

```bash
cd django_backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment file
copy .env.example .env
# Or on macOS/Linux:
cp .env.example .env

# Run migrations (creates database)
python manage.py migrate

# Start server
python manage.py runserver 0.0.0.0:8000
```

✅ Django now running at `http://localhost:8000`

### 2. Get Your Server IP

**For Network Access from React Native:**

**Windows:**
```cmd
ipconfig
```
Look for `IPv4 Address` under your network adapter (e.g., `192.168.1.100`)

**macOS/Linux:**
```bash
ifconfig
# or
hostname -I
```

### 3. Update React Native

Edit `src/services/djangoDetectionService.js` line 7:

```javascript
// BEFORE
const DJANGO_API_URL = 'http://192.168.x.x:8000/api/detect/';

// AFTER - Replace with YOUR IP
const DJANGO_API_URL = 'http://192.168.1.100:8000/api/detect/';
```

### 4. Run React Native App

```bash
npm start
# or
expo start
```

The app will show:
- 🟢 **✓ Connected** - Everything working
- 🔴 **✗ Offline** - Check IP and network

---

## Testing

### Test Django Directly

```bash
# Health check
curl http://localhost:8000/api/health/

# Should respond: {"status": "ok"}
```

### Test with Image

1. In React Native app
2. Tap "Take Photo" or "Choose from Gallery"
3. Select an oral image
4. App sends to Django → Analyzes → Returns results

---

## Key Files Explained

### `django_backend/detector/detector_service.py`
- Loads TFLite model on startup
- `detect()` method processes base64 images
- Calculates disease percentage & severity
- Returns JSON response

### `src/services/djangoDetectionService.js`
- Sends images to Django as base64
- Handles network errors gracefully
- Provides helper methods for severity descriptions

### `src/screens/CameraScreen.js`
- Shows connection status in header
- "Check Connection" button to test
- Calls Django API when image is selected

---

## Network Architecture

```
┌─────────────────────────────────────┐
│   React Native App                  │
│   (Camera, Gallery, UI)             │
│                                     │
│  User captures image → Base64       │
│         ↓                           │
│  HTTP POST to Django API            │
│         ↓                           │
│  Display results                    │
└─────────────────────────────────────┘
         ↕ (Network)
┌─────────────────────────────────────┐
│   Django Backend                    │
│   (http://IP:8000)                  │
│                                     │
│  Receive image → Load TFLite model  │
│         ↓                           │
│  Inference → Calculate severity     │
│         ↓                           │
│  Return JSON response               │
└─────────────────────────────────────┘
```

---

## Common Issues

### ❌ "Cannot connect to Django server"

**Check:**
1. Django running? 
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   
2. Correct IP?
   ```bash
   ipconfig  # Find your IP
   ```
   
3. Updated djangoDetectionService.js?
   ```javascript
   const DJANGO_API_URL = 'http://YOUR_IP:8000/api/detect/';
   ```
   
4. Same network?
   - Phone/emulator WiFi = Computer WiFi
   - Android emulator: Use `10.0.2.2` instead of `localhost`
   
5. Firewall?
   - Windows: Allow Django port 8000
   - macOS: System Preferences → Security & Privacy

### ❌ "Model file not found"

**Check:**
1. File exists: `ml_model/oral_segmentation_quantized.tflite`
2. Run Django from correct directory (django_backend/)
3. Check `.env` MODEL_PATH is correct

### ❌ "CORS error"

**Fix:**
Edit `.env`:
```
CORS_ALLOWED_ORIGINS=http://YOUR_IP:8081,http://localhost:8000
```

Then restart Django.

### ❌ "Port 8000 already in use"

```bash
# Kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

---

## Environment Variables (.env)

```bash
# Debug mode (change to False for production)
DEBUG=True

# Security
SECRET_KEY=your-secret-key-change-in-production

# Allowed hosts
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100

# CORS for React Native
CORS_ALLOWED_ORIGINS=http://192.168.1.100:8081,http://localhost:8000

# Model location
MODEL_PATH=../ml_model/oral_segmentation_quantized.tflite
```

---

## Production Deployment

### Option 1: Cloud (Heroku, AWS, etc.)

```bash
# Create requirements.txt (already done)
# Create Procfile
echo "web: gunicorn config.wsgi" > Procfile

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### Option 2: Docker

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi", "--bind", "0.0.0.0:8000"]
```

```bash
docker build -t oral-detector .
docker run -p 8000:8000 oral-detector
```

### Option 3: Local Server

```bash
pip install gunicorn
gunicorn config.wsgi --bind 0.0.0.0:8000 --workers 4
```

---

## Performance Optimization

1. **Model Caching**: Loaded once on startup
2. **Async Processing**: Handle multiple requests
3. **Image Compression**: Optimize before sending
4. **Database Indexing**: If adding history
5. **Load Balancing**: Multiple servers

---

## Next Steps

1. ✅ Start Django server
2. ✅ Update React Native IP
3. ✅ Test connection
4. ✅ Capture & analyze images
5. ⬜ Add user authentication
6. ⬜ Store results in database
7. ⬜ Deploy to production

---

## Support Files

- `DJANGO_SETUP.md` - Detailed setup guide
- `django_backend/SETUP.md` - Django-specific documentation
- `REACT_NATIVE_INTEGRATION.md` - Original integration guide
- `REACT_NATIVE_SUMMARY.md` - React Native reference
