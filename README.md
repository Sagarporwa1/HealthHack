# OralHealth AI - Oral Cancer Detection & Monitoring 🦷

OralHealth AI is a premium React Native application designed for the early detection and monitoring of oral cancer using AI image analysis. It empowers users to take control of their oral health through quick screenings, educational resources, and secure health tracking.

## ✨ Key Features

- **🚀 AI-Powered Scanning**: Capture or upload images of concerning oral lesions for instant AI-based risk assessment.
- **📊 Medical Analysis**: Detailed diagnostic reports including risk levels, confidence scores, and key findings.
- **📋 Scan History**: Maintain a secure, searchable archive of all past assessments to track changes over time.
- **📚 Learning Center**: Comprehensive educational resources on oral health, risk factors, and preventive care.
- **👤 Secure Profiles**: Personalized user experience with health stats and secure local data management.
- **🎨 Premium UI**: Modern, high-performance design with fluid gradients, glassmorphism, and dynamic safe-area handling.
- **🔒 Privacy First**: All scan data is stored locally on the device, ensuring maximum user privacy.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Stack & Bottom Tabs)
- **Icons**: [Ionicons](https://ionic.io/ionicons)
- **Styling**: Vanilla StyleSheet with a custom Design System
- **State/Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for local history
- **Safe Area**: [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context) for modern device support

## 📂 Project Structure

```text
OralCancerApp/
├── src/
│   ├── components/      # Reusable UI components (Buttons, Cards, Headers)
│   ├── navigation/      # Navigation configuration (AppNavigator)
│   ├── screens/         # Main app screens (Home, Camera, Analysis, etc.)
│   ├── services/        # Business logic (Detection, Storage services)
│   ├── styles/          # Global theme and design tokens
│   ├── utils/           # Constants and helper functions
│   └── assets/          # Static images and icons
├── App.js               # Application entry point
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Mobile device with Expo Go app OR Android/iOS Emulator

### Installation

1. **Clone and Navigate**:
   ```bash
   cd OralCancerApp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Project**:
   ```bash
   npx expo start
   ```

4. **Run on Emulator/Device**:
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.
   - Scan the QR code with your phone using the Expo Go app.

## ⚠️ Medical Disclaimer

**IMPORTANT: This application is for informational and educational purposes only.**
The AI-generated analysis is NOT a professional medical diagnosis. Users should always consult with a qualified dentist, oncologist, or healthcare professional for any concerning lesions or medical questions. Never disregard professional medical advice or delay seeking it because of something you have read or analyzed within this app.

## 🎨 Design System

The app follows a strict **Premium Medical Design System**:
- **Palette**: Deep Trust Blues (`#0F62FE`), Modern Teals, and high-contrast risk indicators.
- **Typography**: Clean system fonts with weighted hierarchy.
- **Feedback**: Dynamic transition animations and haptic-style button states.

---
Built with ❤️ for better Oral Health in 2026.
