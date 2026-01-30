# Setup Checklist - Django + React Native

## Pre-Setup
- [ ] Django backend folder created: `django_backend/`
- [ ] Python 3.8+ installed on your system
- [ ] React Native project already running
- [ ] TFLite model exists: `ml_model/oral_segmentation_quantized.tflite`

---

## 1️⃣ Django Backend Setup (30 min)

### Install Python Dependencies
- [ ] Navigate to `django_backend/` folder
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate venv:
  - Windows: `venv\Scripts\activate`
  - Mac/Linux: `source venv/bin/activate`
- [ ] Install packages: `pip install -r requirements.txt`

### Setup Configuration
- [ ] Copy environment file: `copy .env.example .env`
- [ ] Edit `.env` file:
  - [ ] Keep `DEBUG=True` for now
  - [ ] `SECRET_KEY` - any value for dev
  - [ ] `ALLOWED_HOSTS` - set to `localhost,127.0.0.1`
- [ ] Create database: `python manage.py migrate`
- [ ] (Optional) Create superuser: `python manage.py createsuperuser`

### Run Django Server
- [ ] Start server: `python manage.py runserver 0.0.0.0:8000`
- [ ] Test health endpoint: `curl http://localhost:8000/api/health/`
- [ ] Should return: `{"status": "ok"}`
- [ ] Keep terminal open (Django running)

---

## 2️⃣ Find Your Server IP (5 min)

### Windows
- [ ] Open Command Prompt
- [ ] Run: `ipconfig`
- [ ] Find: "IPv4 Address" under your network adapter
- [ ] Copy the IP (e.g., `192.168.1.100`)

### Mac/Linux
- [ ] Open Terminal
- [ ] Run: `ifconfig` or `hostname -I`
- [ ] Find: Your local IP address

### Note
- [ ] Write down your IP: `____________`
- [ ] This is YOUR_IP in next steps

---

## 3️⃣ Update React Native (10 min)

### Edit Django Detection Service
- [ ] Open `src/services/djangoDetectionService.js`
- [ ] Find line 7: `const DJANGO_API_URL = ...`
- [ ] Replace with your IP:
  ```javascript
  const DJANGO_API_URL = 'http://YOUR_IP:8000/api/detect/';
  // Example: const DJANGO_API_URL = 'http://192.168.1.100:8000/api/detect/';
  ```
- [ ] Save file

### Verify Camera Screen Updates
- [ ] Check `src/screens/CameraScreen.js` imported `djangoDetectionService`
- [ ] Connection status badge should show in header
- [ ] File should handle Django API calls

---

## 4️⃣ Network Configuration (5 min)

### Same Network Check
- [ ] Phone/emulator WiFi = Computer WiFi ✓
- [ ] Not on guest network ✓
- [ ] No network restrictions ✓

### Firewall Check
- [ ] Windows: Allow Django port 8000 through firewall
- [ ] Mac: System Preferences → Security & Privacy
- [ ] Linux: `sudo ufw allow 8000` (if using UFW)

### (Android Emulator Only)
- [ ] Use `10.0.2.2` instead of `localhost`
- [ ] Update `.env`: `CORS_ALLOWED_ORIGINS=http://10.0.2.2:8081`

---

## 5️⃣ Environment Configuration (5 min)

### Django `.env` File
- [ ] `DEBUG=True` ✓
- [ ] `SECRET_KEY=your-key-here` ✓
- [ ] `ALLOWED_HOSTS=localhost,127.0.0.1,YOUR_IP` ✓
- [ ] `CORS_ALLOWED_ORIGINS=http://YOUR_IP:8081` ✓
- [ ] `MODEL_PATH=../ml_model/oral_segmentation_quantized.tflite` ✓

---

## 6️⃣ Run React Native App (5 min)

### Start App
- [ ] In project root (not django_backend)
- [ ] Run: `npm start` (or `expo start`)
- [ ] Wait for bundler to finish
- [ ] On emulator/device: Press appropriate key

### Check Connection Status
- [ ] App should show in header:
  - [ ] 🟢 **✓ Connected** (green) - Everything good
  - [ ] 🔴 **✗ Offline** (red) - Check setup

### Connection Test
- [ ] Tap "Check Connection" button
- [ ] Should verify Django server
- [ ] If fails, debug using troubleshooting guide

---

## 7️⃣ Test Detection (5 min)

### With Sample Image
- [ ] Tap camera icon in app
- [ ] Take a photo (any image for now)
- [ ] Or select from gallery
- [ ] App sends to Django
- [ ] Results should display with:
  - [ ] Disease percentage
  - [ ] Severity level (HEALTHY/MILD/MODERATE/SEVERE/CRITICAL)
  - [ ] Confidence score
  - [ ] Recommendations

### Expected Results
- [ ] No errors in console
- [ ] Results display on screen
- [ ] Severity badge shows correct color
- [ ] Recommendations shown

---

## 8️⃣ Troubleshooting (As Needed)

### Connection Issues
- [ ] Django running? `python manage.py runserver 0.0.0.0:8000`
- [ ] Correct IP in React Native? (Check `djangoDetectionService.js`)
- [ ] Same network? (Check WiFi)
- [ ] Firewall allowed? (Check Windows Defender/Mac Security)
- [ ] Port 8000 free? (`netstat -ano | findstr :8000` on Windows)

### Model Issues
- [ ] File exists? `ml_model/oral_segmentation_quantized.tflite`
- [ ] `.env` path correct? `MODEL_PATH=../ml_model/oral_segmentation_quantized.tflite`
- [ ] Django running from correct directory? (`django_backend/`)

### Image Issues
- [ ] Image size: Should auto-resize to 256x256
- [ ] Format: JPG/PNG supported
- [ ] Encoding: Automatic base64 conversion
- [ ] If error: Check React Native console

### CORS Issues
- [ ] Update `.env`: `CORS_ALLOWED_ORIGINS=http://YOUR_IP:8081`
- [ ] Restart Django
- [ ] Clear app cache if needed

---

## 9️⃣ Verification Checklist

### Django Backend
- [ ] ✅ Django running on `http://0.0.0.0:8000`
- [ ] ✅ Health endpoint works: `http://localhost:8000/api/health/`
- [ ] ✅ Model loaded (check console for "Model loaded successfully")
- [ ] ✅ No errors in Django console

### React Native
- [ ] ✅ App starts without errors
- [ ] ✅ Connection status shows (✓ or ✗)
- [ ] ✅ Can capture/select images
- [ ] ✅ Results display correctly

### Network
- [ ] ✅ Phone/emulator on same WiFi as computer
- [ ] ✅ Firewall allows port 8000
- [ ] ✅ Correct IP in React Native app

---

## 🔟 Documentation Reference

| Question | File |
|----------|------|
| Quick overview? | `README_SETUP.md` |
| Fast setup? | `DJANGO_SETUP.md` (5 min) |
| Detailed network? | `CONNECTION_GUIDE.md` |
| Project structure? | `PROJECT_STRUCTURE.md` |
| Django specific? | `django_backend/SETUP.md` |
| Troubleshooting? | `CONNECTION_GUIDE.md` (Issues section) |
| Original React Native? | `REACT_NATIVE_INTEGRATION.md` |

---

## ✅ Final Checklist

- [ ] Django installed and running
- [ ] Your IP address found and noted
- [ ] React Native updated with correct IP
- [ ] `.env` files configured
- [ ] Network on same WiFi
- [ ] Firewall allows port 8000
- [ ] App shows connection status
- [ ] Test image detection works
- [ ] Results display correctly
- [ ] No errors in any console

---

## 🎉 Success Criteria

### ✅ You're Done When:

1. **Django Server**
   - Running without errors
   - `http://localhost:8000/api/health/` returns `{"status": "ok"}`
   - Console shows "Model loaded successfully"

2. **React Native App**
   - Shows 🟢 **✓ Connected** badge
   - Can capture image
   - Results display with disease percentage
   - No console errors

3. **Network**
   - Phone can ping computer IP
   - App reaches Django on network IP
   - Image transfers without timeout

---

## 🚀 What's Next

1. ✅ Test with real oral images
2. ⬜ Adjust detection threshold if needed
3. ⬜ Add user authentication
4. ⬜ Store results in database
5. ⬜ Deploy to production
6. ⬜ Add advanced features

---

## 📞 Need Help?

**Check Console Logs:**
- Django: Console output from `python manage.py runserver`
- React Native: Expo console or Android Logcat

**Test Endpoints:**
```bash
# Health check
curl http://YOUR_IP:8000/api/health/

# Test with image (using cURL on Windows PowerShell)
curl -X POST http://YOUR_IP:8000/api/detect/ `
  -H "Content-Type: application/json" `
  -d '{"image": "iVBORw..."}'
```

**Common Commands:**
```bash
# Find port usage
netstat -ano | findstr :8000

# Kill process
taskkill /PID <pid> /F

# Find IP
ipconfig
```

---

## 📝 Notes

```
Server IP: ________________
Today's Date: ________________
Status: ________________
Notes: 

________________
________________
________________
```

---

**Good luck! You've got this! 🚀**
