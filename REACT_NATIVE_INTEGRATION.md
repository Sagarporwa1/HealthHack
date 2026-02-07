"""
REACT NATIVE + TENSORFLOW LITE INTEGRATION GUIDE
Complete procedure for Oral Disease Detection App
"""

# ============================================================
# 1. PROJECT SETUP
# ============================================================

SETUP_GUIDE = """
═══════════════════════════════════════════════════════════════════════════════
REACT NATIVE + TENSORFLOW LITE INTEGRATION
═══════════════════════════════════════════════════════════════════════════════

PREREQUISITES:
==============
- Node.js >= 14.0
- React Native CLI or Expo CLI
- Android Studio (for Android)
- Xcode (for iOS)
- TensorFlow Lite model: oral_segmentation_quantized.tflite

PROJECT STRUCTURE:
==================
react-native-app/
├── android/
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── assets/models/
│   │   │   │   │   └── oral_segmentation_quantized.tflite
│   │   │   │   └── java/com/oraldetector/
│   │   │   │       └── TFLiteModule.java
│   │   │   └── build.gradle
│   │   └── build.gradle
│   └── build.gradle
├── ios/
│   ├── OralDetector/
│   │   ├── Models/
│   │   │   └── oral_segmentation_quantized.tflite
│   │   └── TFLiteModule.swift
│   └── Podfile
├── src/
│   ├── components/
│   │   ├── CameraScreen.js
│   │   ├── ResultsScreen.js
│   │   └── HomeScreen.js
│   ├── services/
│   │   ├── tfliteService.js
│   │   └── imageProcessor.js
│   ├── models/
│   │   └── DetectionResult.js
│   └── App.js
├── package.json
└── README.md


STEP 1: CREATE REACT NATIVE PROJECT
====================================
$ npx react-native init OralDiseaseDetector --version 0.72.0
$ cd OralDiseaseDetector

OR with Expo:
$ npx create-expo-app OralDiseaseDetector
$ cd OralDiseaseDetector


STEP 2: INSTALL DEPENDENCIES
=============================
$ npm install
$ npm install react-native-tflite-react-native
$ npm install react-native-camera
$ npm install react-native-image-picker
$ npm install @react-native-camera-roll/camera-roll
$ npm install react-native-reanimated
$ npm install react-native-gesture-handler
$ npm install axios

OR with Yarn:
$ yarn add react-native-tflite-react-native react-native-camera react-native-image-picker


STEP 3: LINK NATIVE MODULES
============================
For React Native < 0.60:
$ react-native link react-native-tflite-react-native
$ react-native link react-native-camera

For React Native >= 0.60:
Auto-linking should work, but verify:
$ npx react-native doctor


STEP 4: ANDROID SETUP
=====================
Edit: android/app/build.gradle

android {
    compileSdkVersion 33
    
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
    }
    
    packagingOptions {
        exclude 'lib/x86/libtensorflowlite_jni.so'
        exclude 'lib/arm64-v8a/libtensorflowlite_jni.so'
    }
}

dependencies {
    implementation 'org.tensorflow:tensorflow-lite:2.13.0'
    implementation 'org.tensorflow:tensorflow-lite-gpu:2.13.0'
}

Edit: android/build.gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
}


STEP 5: iOS SETUP
=================
Edit: ios/Podfile

Add to Podfile:
target 'OralDiseaseDetector' do
  pod 'TensorFlowLiteSwift'
  pod 'TensorFlowLiteObjC'
  
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      flutter_additional_ios_build_settings(target)
      target.build_configurations.each do |config|
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= [
          '$(inherited)',
          'TF_LITE_DISABLE_X86=1'
        ]
      end
    end
  end
end

$ cd ios && pod install && cd ..


STEP 6: ADD MODEL FILE
======================
Android:
$ mkdir -p android/app/src/main/assets/models/
$ cp oral_segmentation_quantized.tflite android/app/src/main/assets/models/

iOS:
$ mkdir -p ios/OralDetector/Models/
$ cp oral_segmentation_quantized.tflite ios/OralDetector/Models/
$ xcode-select --install  # if needed


STEP 7: UPDATE PACKAGE.JSON
============================
{
  "name": "OralDiseaseDetector",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-native-tflite-react-native": "^1.1.5",
    "react-native-camera": "^4.2.1",
    "react-native-image-picker": "^7.1.2",
    "@react-native-camera-roll/camera-roll": "^7.0.0",
    "react-native-gesture-handler": "^2.13.0",
    "react-native-reanimated": "^3.0.0"
  }
}


STEP 8: TEST SETUP
==================
$ npm install
$ npx react-native doctor  # Check for issues

Android:
$ npx react-native run-android

iOS:
$ npx react-native run-ios


═══════════════════════════════════════════════════════════════════════════════
"""

# ============================================================
# 2. NATIVE MODULES
# ============================================================

JAVA_MODULE = """
FILE: android/app/src/main/java/com/oraldetector/TFLiteModule.java
═════════════════════════════════════════════════════════════════════════════

package com.oraldetector;

import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.tensorflow.lite.Interpreter;
import org.tensorflow.lite.support.common.FileUtil;
import org.tensorflow.lite.support.common.ops.NormalizeOp;
import org.tensorflow.lite.support.image.ImageProcessor;
import org.tensorflow.lite.support.image.TensorImage;
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer;

import java.io.IOException;
import java.nio.MappedByteBuffer;

public class TFLiteModule {
    private Interpreter interpreter;
    private static final int INPUT_SIZE = 256;
    private static final String MODEL_NAME = "oral_segmentation_quantized.tflite";
    
    public TFLiteModule(AssetManager assetManager) throws IOException {
        MappedByteBuffer tfliteModel = FileUtil.loadMappedFile(assetManager, MODEL_NAME);
        interpreter = new Interpreter(tfliteModel);
    }
    
    public float[][] detectDisease(Bitmap bitmap) {
        // Resize image
        Bitmap resizedBitmap = Bitmap.createScaledBitmap(
            bitmap,
            INPUT_SIZE,
            INPUT_SIZE,
            true
        );
        
        // Create TensorImage
        TensorImage image = new TensorImage(org.tensorflow.lite.DataType.FLOAT32);
        image.load(resizedBitmap);
        
        // Normalize
        ImageProcessor imageProcessor = new ImageProcessor.Builder()
            .add(new NormalizeOp(0f, 255f))
            .build();
        
        TensorImage processedImage = imageProcessor.process(image);
        
        // Run inference
        float[][][][] output = new float[1][INPUT_SIZE][INPUT_SIZE][1];
        interpreter.run(processedImage.getBuffer(), output);
        
        // Extract mask
        float[][] mask = output[0];
        
        return mask;
    }
    
    public void close() {
        if (interpreter != null) {
            interpreter.close();
        }
    }
}
"""

SWIFT_MODULE = """
FILE: ios/OralDetector/TFLiteModule.swift
═════════════════════════════════════════════════════════════════════════════

import Foundation
import TensorFlowLite

class TFLiteModule {
    private var interpreter: Interpreter?
    private let inputSize = 256
    private let modelName = "oral_segmentation_quantized"
    
    init() throws {
        let modelPath = Bundle.main.path(
            forResource: modelName,
            ofType: "tflite"
        ) ?? ""
        
        interpreter = try Interpreter(modelPath: modelPath)
        try interpreter?.allocateTensors()
    }
    
    func detectDisease(image: UIImage) throws -> [[[[Float]]]] {
        // Resize image
        let resizedImage = image.resizedImage(
            size: CGSize(width: inputSize, height: inputSize)
        )
        
        // Convert to RGB
        let rgbData = resizedImage.toRGBData()
        
        // Allocate input tensor
        try interpreter?.resizeInput(at: 0, to: Tensor.Shape([1, inputSize, inputSize, 3]))
        try interpreter?.allocateTensors()
        
        // Copy data to input tensor
        try interpreter?.copy(rgbData, toInputAt: 0)
        
        // Run inference
        try interpreter?.invoke()
        
        // Get output
        let outputTensor = try interpreter?.tensor(at: interpreter!.outputTensorIndex(0))
        let output = UnsafeMutableBufferPointer<Float>(
            start: UnsafeMutableRawPointer(outputTensor?.data).assumingMemoryBound(to: Float.self),
            count: inputSize * inputSize
        )
        
        return convertToMask(output)
    }
    
    private func convertToMask(_ data: UnsafeMutableBufferPointer<Float>) -> [[[[Float]]]] {
        var mask = [[[[Float]]]]()
        // Process tensor data...
        return mask
    }
}
"""

# ============================================================
# 3. JAVASCRIPT SERVICE
# ============================================================

JS_SERVICE = """
FILE: src/services/tfliteService.js
═════════════════════════════════════════════════════════════════════════════

import { NativeModules } from 'react-native';
import RNFS from 'react-native-fs';

const { TFLiteModule } = NativeModules;

class TFLiteService {
  constructor() {
    this.modelLoaded = false;
    this.threshold = 0.5;
  }

  async loadModel() {
    try {
      if (TFLiteModule && TFLiteModule.loadModel) {
        await TFLiteModule.loadModel();
        this.modelLoaded = true;
        console.log('✅ TFLite model loaded');
        return true;
      }
    } catch (error) {
      console.error('❌ Error loading model:', error);
      throw error;
    }
  }

  async detectDisease(imagePath) {
    try {
      if (!this.modelLoaded) {
        await this.loadModel();
      }

      // Read image file
      const imageData = await RNFS.readFile(imagePath, 'base64');

      // Run inference
      const result = await TFLiteModule.detectDisease(imageData);

      // Process result
      const processed = this.processResult(result);

      return processed;
    } catch (error) {
      console.error('❌ Error in detection:', error);
      throw error;
    }
  }

  processResult(mask) {
    // Count disease pixels
    let diseasePixels = 0;
    const totalPixels = 256 * 256;

    for (let i = 0; i < mask.length; i++) {
      for (let j = 0; j < mask[i].length; j++) {
        if (mask[i][j] > this.threshold) {
          diseasePixels++;
        }
      }
    }

    // Calculate percentage
    const diseasePercentage = (diseasePixels / totalPixels) * 100;

    // Determine severity
    const severity = this.getSeverity(diseasePercentage);
    const confidence = this.calculateConfidence(diseasePercentage);

    return {
      hasDiseaseDetected: diseasePercentage > 1.0,
      diseasePercentage: diseasePercentage,
      severityLevel: severity,
      confidence: confidence,
      mask: mask
    };
  }

  getSeverity(percentage) {
    if (percentage < 1.0) return 'HEALTHY';
    if (percentage < 5.0) return 'MILD';
    if (percentage < 15.0) return 'MODERATE';
    if (percentage < 30.0) return 'SEVERE';
    return 'CRITICAL';
  }

  calculateConfidence(percentage) {
    return Math.min(percentage / 100.0, 1.0);
  }

  dispose() {
    if (TFLiteModule && TFLiteModule.close) {
      TFLiteModule.close();
    }
  }
}

export default new TFLiteService();
"""

# ============================================================
# 4. REACT COMPONENTS
# ============================================================

HOME_COMPONENT = """
FILE: src/components/HomeScreen.js
═════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import tfliteService from '../services/tfliteService';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async () => {
    try {
      await tfliteService.loadModel();
    } catch (error) {
      Alert.alert('Error', 'Failed to load model');
    }
  };

  const handleCameraPress = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        processImage(response.assets[0].uri);
      }
    );
  };

  const handleGalleryPress = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        processImage(response.assets[0].uri);
      }
    );
  };

  const processImage = async (imagePath) => {
    setLoading(true);
    try {
      const result = await tfliteService.detectDisease(imagePath);
      navigation.navigate('Results', {
        imagePath,
        detectionResult: result,
      });
    } catch (error) {
      Alert.alert('Error', 'Detection failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🦷 Oral Disease Detector</Text>
      <Text style={styles.subtitle}>
        Take a photo or upload an image to detect oral diseases
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCameraPress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>📷 Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleGalleryPress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Analyzing image...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
"""

RESULTS_COMPONENT = """
FILE: src/components/ResultsScreen.js
═════════════════════════════════════════════════════════════════════════════

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';

const getSeverityColor = (severity) => {
  const colors = {
    HEALTHY: '#4CAF50',
    MILD: '#FFEB3B',
    MODERATE: '#FF9800',
    SEVERE: '#F44336',
    CRITICAL: '#9C27B0',
  };
  return colors[severity] || '#CCCCCC';
};

const getSeverityDescription = (severity) => {
  const descriptions = {
    HEALTHY: 'No oral disease detected. Your mouth looks healthy!',
    MILD: 'Mild oral disease detected. Monitor and maintain good oral hygiene.',
    MODERATE: 'Moderate oral disease detected. Consult a dentist soon.',
    SEVERE: 'Severe oral disease detected. Visit a dentist immediately.',
    CRITICAL: 'Critical oral disease detected. Seek urgent dental care.',
  };
  return descriptions[severity] || 'Unable to determine status';
};

const getRecommendations = (severity) => {
  const recommendations = {
    HEALTHY: [
      '✓ Maintain current oral hygiene',
      '✓ Regular dental checkups every 6 months',
      '✓ Balanced diet with calcium',
    ],
    MILD: [
      '• Improve brushing technique',
      '• Floss daily',
      '• Use fluoride mouthwash',
      '• Schedule checkup within 1 month',
    ],
    MODERATE: [
      '⚠ Schedule dental appointment within 1-2 weeks',
      '⚠ Professional cleaning may be needed',
      '⚠ Check for gum disease',
    ],
    SEVERE: [
      '🔴 Visit dentist within 1-2 days',
      '🔴 Possible infection',
      '🔴 May require treatment',
    ],
    CRITICAL: [
      '🚨 Seek immediate dental care today',
      '🚨 Possible emergency procedure',
      '🚨 Risk of serious complications',
    ],
  };
  return recommendations[severity] || [];
};

const ResultsScreen = ({ route, navigation }) => {
  const { imagePath, detectionResult } = route.params;
  const color = getSeverityColor(detectionResult.severityLevel);

  const handleShare = async () => {
    try {
      const message = `Oral Disease Detection Results:\\n
Severity: ${detectionResult.severityLevel}
Disease Percentage: ${detectionResult.diseasePercentage.toFixed(2)}%
Status: ${detectionResult.hasDiseaseDetected ? 'Disease Detected' : 'Healthy'}`;
      
      await Share.share({
        message,
        title: 'Oral Disease Detection Results',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: imagePath }}
        style={styles.image}
      />

      <View style={[styles.severityCard, { borderLeftColor: color }]}>
        <Text style={[styles.severityText, { color }]}>
          {detectionResult.severityLevel}
        </Text>
        <Text style={styles.description}>
          {getSeverityDescription(detectionResult.severityLevel)}
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Disease Area</Text>
          <Text style={styles.metricValue}>
            {detectionResult.diseasePercentage.toFixed(2)}%
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Confidence</Text>
          <Text style={styles.metricValue}>
            {(detectionResult.confidence * 100).toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>💡 Recommendations</Text>
        {getRecommendations(detectionResult.severityLevel).map((rec, idx) => (
          <Text key={idx} style={styles.recommendation}>
            {rec}
          </Text>
        ))}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>New Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleShare}
        >
          <Text style={styles.actionButtonText}>Share Results</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
  },
  severityCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderLeftWidth: 5,
  },
  severityText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  metricsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  recommendationsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recommendation: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
    marginRight: 0,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ResultsScreen;
"""

# ============================================================
# 5. APP.JS MAIN FILE
# ============================================================

APP_JS = """
FILE: App.js
═════════════════════════════════════════════════════════════════════════════

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/components/HomeScreen';
import ResultsScreen from './src/components/ResultsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Oral Disease Detector',
            }}
          />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              title: 'Detection Results',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
"""

# ============================================================
# 6. QUICK INTEGRATION STEPS
# ============================================================

INTEGRATION_STEPS = """
═══════════════════════════════════════════════════════════════════════════════
QUICK INTEGRATION STEPS FOR EXISTING REACT NATIVE PROJECT
═════════════════════════════════════════════════════════════════════════════════

STEP 1: ADD DEPENDENCIES
========================
$ npm install react-native-tflite-react-native react-native-camera react-native-image-picker
$ npm install @react-native-camera-roll/camera-roll react-native-gesture-handler react-native-reanimated

STEP 2: ANDROID SETUP
====================
1. Edit android/app/build.gradle:
   - Set minSdkVersion to 21
   - Add TensorFlow Lite dependency
   - Add packaging options

2. Create assets folder:
   mkdir -p android/app/src/main/assets/models/

3. Copy model:
   cp oral_segmentation_quantized.tflite android/app/src/main/assets/models/

4. Create Java native module (TFLiteModule.java)

5. Register module in:
   - MainApplication.java
   - TFLiteModulePackage.java


STEP 3: iOS SETUP
=================
1. Edit ios/Podfile:
   - Add pod 'TensorFlowLiteSwift'
   - Add post_install hook

2. Run pod install:
   cd ios && pod install && cd ..

3. Copy model to Xcode:
   - Add oral_segmentation_quantized.tflite to Bundle Resources
   - Check "Copy items if needed"

4. Create Swift native module (TFLiteModule.swift)

5. Create Bridge header if needed:
   #ifndef OralDiseaseDetector_Bridging_Header_h
   #define OralDiseaseDetector_Bridging_Header_h
   #import "React/RCTBridgeModule.h"
   #endif


STEP 4: ADD SERVICE LAYER
=========================
Create src/services/tfliteService.js:
- Load model
- Process images
- Calculate severity
- Return results


STEP 5: CREATE COMPONENTS
=========================
Create src/components/:
- HomeScreen.js (Camera/Gallery)
- ResultsScreen.js (Show results)
- Update App.js (Navigation)


STEP 6: BUILD & TEST
====================

Android:
$ npx react-native run-android

iOS:
$ npx react-native run-ios

OR with Expo:
$ expo start
$ expo prebuild
$ expo run:android
$ expo run:ios


STEP 7: PERMISSIONS
===================
Edit android/app/src/main/AndroidManifest.xml:
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

Edit ios/OralDetector/Info.plist:
<key>NSCameraUsageDescription</key>
<string>We need camera access to detect oral diseases</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need to access your photos to detect oral diseases</string>


═════════════════════════════════════════════════════════════════════════════════
"""

print(SETUP_GUIDE)
print("\n" + "="*80 + "\n")
print(JAVA_MODULE)
print("\n" + "="*80 + "\n")
print(SWIFT_MODULE)
print("\n" + "="*80 + "\n")
print(JS_SERVICE)
print("\n" + "="*80 + "\n")
print(HOME_COMPONENT)
print("\n" + "="*80 + "\n")
print(RESULTS_COMPONENT)
print("\n" + "="*80 + "\n")
print(APP_JS)
print("\n" + "="*80 + "\n")
print(INTEGRATION_STEPS)
