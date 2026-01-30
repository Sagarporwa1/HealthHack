"""
REACT NATIVE + TFLITE INTEGRATION TROUBLESHOOTING GUIDE
"""

TROUBLESHOOTING = """
═════════════════════════════════════════════════════════════════════════════════
COMMON ISSUES & SOLUTIONS
═════════════════════════════════════════════════════════════════════════════════


1. MODEL NOT LOADING ERROR
═════════════════════════════════════════════════════════════════════════════════

ERROR MESSAGE:
"Error loading model: File not found"

CAUSES:
- Model file not in correct location
- Incorrect file path
- Model not bundled in Android/iOS

SOLUTIONS:

Android:
--------
✓ Check path: android/app/src/main/assets/models/oral_segmentation_quantized.tflite

✓ Update gradle to include assets:
  In android/app/build.gradle:
  android {
      sourceSets {
          main {
              assets.srcDirs = ['src/main/assets']
          }
      }
  }

✓ Use correct asset path:
  // In Java
  MappedByteBuffer model = FileUtil.loadMappedFile(
      assetManager,
      "models/oral_segmentation_quantized.tflite"
  );

iOS:
-----
✓ Add model to Xcode:
  1. Right-click OralDetector folder
  2. Add Files to "OralDetector"
  3. Select oral_segmentation_quantized.tflite
  4. Check "Copy items if needed"
  5. Check "OralDetector" target
  6. Check "Add to targets"

✓ Verify in Build Phases:
  1. Select target
  2. Build Phases
  3. Copy Bundle Resources
  4. Verify .tflite file is listed

✓ Use Bundle path:
  let modelPath = Bundle.main.path(
      forResource: "oral_segmentation_quantized",
      ofType: "tflite"
  ) ?? ""


2. TFLITE MODULE NOT FOUND
═════════════════════════════════════════════════════════════════════════════════

ERROR:
"TypeError: Cannot read property 'TFLiteModule' of undefined"

CAUSES:
- Native module not registered
- Package not linked
- Wrong module name

SOLUTIONS:

Android:
--------
✓ Register in MainApplication.java:
  import com.oraldetector.TFLiteModulePackage;
  
  @Override
  protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new TFLiteModulePackage());
    return packages;
  }

✓ Create TFLiteModulePackage.java:
  public class TFLiteModulePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
      List<NativeModule> modules = new ArrayList<>();
      modules.add(new TFLiteModule(reactContext));
      return modules;
    }
  }

iOS:
-----
✓ Create bridge header:
  Project > OralDetector > OralDetector-Bridging-Header.h
  
  #ifndef OralDiseaseDetector_Bridging_Header_h
  #define OralDiseaseDetector_Bridging_Header_h
  #import <React/RCTBridgeModule.h>
  #endif

✓ Enable "Defines Module": YES in Build Settings

✓ Verify in Xcode Build Settings:
  - Bridging Header: OralDiseaseDetector/OralDiseaseDetector-Bridging-Header.h
  - Enable Modules: YES
  - Defines Module: YES


3. IMAGE PROCESSING ERRORS
═════════════════════════════════════════════════════════════════════════════════

ERROR:
"Error: Input tensor shape mismatch"

CAUSES:
- Image not resized to 256x256
- Wrong color format (RGBA instead of RGB)
- Values not normalized to [0, 1]

SOLUTIONS:

Android:
--------
✓ Resize correctly:
  Bitmap resized = Bitmap.createScaledBitmap(
      original,
      256,
      256,
      true  // filter
  );

✓ Convert RGBA to RGB:
  Bitmap rgb = Bitmap.createBitmap(
      rgba,
      0, 0,
      rgba.getWidth(),
      rgba.getHeight(),
      Bitmap.Config.RGB_565
  );

✓ Normalize properly:
  float[] input = new float[256 * 256 * 3];
  int[] pixels = new int[256 * 256];
  bitmap.getPixels(pixels, 0, 256, 0, 0, 256, 256);
  
  for (int i = 0; i < pixels.length; i++) {
      int pixel = pixels[i];
      input[i * 3] = ((pixel >> 16) & 0xFF) / 255.0f;      // R
      input[i * 3 + 1] = ((pixel >> 8) & 0xFF) / 255.0f;   // G
      input[i * 3 + 2] = (pixel & 0xFF) / 255.0f;          // B
  }

iOS:
-----
✓ Use ImageProcessor:
  let imageProcessor = ImageProcessor()
    .add(Normalization(mean: [0], std: [255]))
  
  var image = MLImage(image: uiImage)
  image = imageProcessor.preprocess(image)


4. INFERENCE CRASHING
═════════════════════════════════════════════════════════════════════════════════

ERROR:
"App crashes during inference"

CAUSES:
- Memory allocation failed
- Buffer size mismatch
- Tensor not allocated

SOLUTIONS:

Android:
--------
✓ Allocate tensors first:
  interpreter.allocateTensors();
  
  // Then run inference
  interpreter.run(input, output);

✓ Check buffer sizes:
  Tensor inputTensor = interpreter.getInputTensor(0);
  int[] shape = inputTensor.shape();
  // Should be [1, 256, 256, 3]

✓ Use try-catch:
  try {
    interpreter.run(input, output);
  } catch (IllegalArgumentException e) {
    Log.e("TFLite", "Inference error", e);
  }

iOS:
-----
✓ Check memory:
  // In Swift
  do {
    try interpreter?.invoke()
  } catch let error {
    print("Inference failed: \\(error)")
  }

✓ Use DispatchQueue:
  DispatchQueue.global(qos: .userInitiated).async {
    try? self.interpreter?.invoke()
    DispatchQueue.main.async {
      // Update UI
    }
  }


5. PERMISSIONS DENIED
═════════════════════════════════════════════════════════════════════════════════

ERROR:
"Permission denied to access camera/gallery"

SOLUTIONS:

Android (AndroidManifest.xml):
-----
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

Android (Runtime - Android 6.0+):
--------
import android.Manifest;
import androidx.core.app.ActivityCompat;

String[] permissions = {
    Manifest.permission.CAMERA,
    Manifest.permission.READ_EXTERNAL_STORAGE,
    Manifest.permission.WRITE_EXTERNAL_STORAGE
};

ActivityCompat.requestPermissions(
    MainActivity.this,
    permissions,
    REQUEST_CODE
);

React Native:
-----------
import { PermissionsAndroid } from 'react-native';

const requestPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
  } catch (err) {
    console.warn(err);
  }
};

iOS (Info.plist):
-----
<key>NSCameraUsageDescription</key>
<string>Camera access required for disease detection</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Photo library access required to select images</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Save detection results to photos</string>


6. SLOW INFERENCE PERFORMANCE
═════════════════════════════════════════════════════════════════════════════════

PROBLEM:
Inference takes >5 seconds

SOLUTIONS:

Android:
--------
✓ Use GPU acceleration:
  GpuDelegate gpuDelegate = new GpuDelegate();
  Interpreter.Options options = new Interpreter.Options()
      .addDelegate(gpuDelegate);
  Interpreter interpreter = new Interpreter(model, options);

✓ Use NNAPI:
  Interpreter.Options options = new Interpreter.Options()
      .setUseNNAPI(true);

✓ Run on background thread:
  new Thread(() -> {
    interpreter.run(input, output);
  }).start();

iOS:
-----
✓ Use Metal acceleration:
  let options = Interpreter.Options()
  options.isQuantizationEnabled = true
  options.threads = ProcessInfo.processInfo.activeProcessorCount
  
  interpreter = try Interpreter(modelPath: modelPath, options: options)

✓ Use Neural Engine (A12+):
  // Automatically used if available

✓ Run async:
  DispatchQueue.global().async {
    try? interpreter?.invoke()
  }

React Native:
-----------
✓ Use SkipFrames for camera:
  const skipFrames = 5;
  let frameCount = 0;
  
  const processFrame = () => {
    frameCount++;
    if (frameCount % skipFrames === 0) {
      // Run inference
    }
  };


7. MEMORY LEAKS
═════════════════════════════════════════════════════════════════════════════════

PROBLEM:
App memory usage keeps increasing

SOLUTIONS:

Android:
--------
✓ Close interpreter:
  @Override
  protected void onDestroy() {
    if (interpreter != null) {
      interpreter.close();
    }
    super.onDestroy();
  }

✓ Dispose tensors:
  interpreter.resetVariableTensors();

✓ Clear references:
  bitmap.recycle();
  input = null;
  output = null;

iOS:
-----
✓ Use weak self:
  [self.interpreter invokeWithError:&error];
  self.interpreter = nil;

✓ Autoreleasepool:
  @autoreleasepool {
    // Process image
  }

React Native:
-----------
✓ Cleanup in useEffect:
  useEffect(() => {
    return () => {
      tfliteService.dispose();
    };
  }, []);


8. BUILD ERRORS
═════════════════════════════════════════════════════════════════════════════════

ANDROID BUILD ERROR: "Duplicate class"
------
Solution: Add to android/app/build.gradle:
android {
  packagingOptions {
    exclude 'lib/x86/libtensorflowlite_jni.so'
    exclude 'lib/arm64-v8a/libtensorflowlite_jni.so'
  }
}

iOS BUILD ERROR: "Pod install fails"
------
Solution:
$ cd ios
$ rm -rf Pods
$ rm Podfile.lock
$ pod repo update
$ pod install
$ cd ..

REACT NATIVE LINKING ERROR: "Module not found"
------
Solution:
$ npx react-native unlink react-native-tflite-react-native
$ npx react-native link react-native-tflite-react-native
$ npm install


═════════════════════════════════════════════════════════════════════════════════
TESTING CHECKLIST
═════════════════════════════════════════════════════════════════════════════════

Before Production:

□ Model loads successfully
□ Camera captures properly
□ Gallery image selection works
□ Image preprocessing correct
□ Inference completes in <2 seconds
□ Results display correctly
□ Severity classification accurate
□ Permissions handled properly
□ No memory leaks
□ Handles edge cases (blurry, dark images)
□ Works on low-end devices (2GB RAM)
□ Works offline without internet
□ Smooth UI/UX
□ Proper error messages
□ Privacy policy in place
□ Tested on real devices

═════════════════════════════════════════════════════════════════════════════════

SUPPORT & RESOURCES
═════════════════════════════════════════════════════════════════════════════════

TensorFlow Lite Documentation:
https://www.tensorflow.org/lite/guides

React Native Docs:
https://reactnative.dev/docs/getting-started

TFLite React Native Package:
https://github.com/shaqian/react-native-tflite-react-native

Common Issues:
https://github.com/tensorflow/tensorflow/issues

Forum: Stack Overflow tag: tensorflow-lite

═════════════════════════════════════════════════════════════════════════════════
"""

print(TROUBLESHOOTING)
