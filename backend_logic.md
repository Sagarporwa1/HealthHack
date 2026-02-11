# HealthHack Backend Core Logic

This document explains the internal logic of the Django backend, specifically the `DiseaseDetector` service that handles AI inference.

## 🧠 The DiseaseDetector Service

Located in `django_backend/detector/detector_service.py`, this class is responsible for the entire lifecycle of the detection process.

### 1. Model Loading & Caching
The model (`oral_segmentation_quantized.tflite`) is loaded once into memory when the server starts or upon the first request via a singleton pattern (`get_detector()`).

*   **Technology**: TensorFlow Lite Interpreter.
*   **Initialization**: `interpreter.allocate_tensors()` allocates memory for the model's tensors.

### 2. Image Preprocessing
Before the model can process an image, it must be transformed into a specific format:

*   **Decoding**: The Base64 string is decoded into raw bytes and opened using PIL (Pillow).
*   **Color Conversion**: Images are converted to `RGB` format to ensure consistency.
*   **Resizing**: The image is resized to **256x256** pixels, which is the required input size for the segmentation model.
*   **Normalization/Quantization**:
    *   For float models: Pixel values (0-255) are scaled to (0.0-1.0).
    *   For quantized models: The code handles `int8` or `uint8` quantization using the model's specific `scale` and `zero_point`.

### 3. Inference Execution
The prepared tensor is passed to the TFLite Interpreter:

```python
self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
self.interpreter.invoke()
output = self.interpreter.get_tensor(self.output_details[0]['index'])
```

### 4. Post-Processing Logic
The model returns a "mask" (an array where each value represents the probability of disease at that pixel).

*   **Disease Percentage**: Calculated by counting pixels that exceed a threshold (default: `0.5`) relative to the total number of pixels.
    ```python
    disease_pixels = np.sum(output > threshold)
    disease_percentage = (disease_pixels / total_pixels) * 100
    ```
*   **Severity Mapping**:
    *   **HEALTHY**: < 1%
    *   **MILD**: 1% - 5%
    *   **MODERATE**: 5% - 15%
    *   **SEVERE**: 15% - 30%
    *   **CRITICAL**: > 30%

### 5. Confidence Score
Currently, the confidence is derived from the disease percentage as a simplified metric for the UI, ensuring the user understands the extent of the detection.

## 📁 Standard Django Files in 'detector'

While most of binary logic resides in `detector_service.py` and `views.py`, the other files in the directory handle necessary framework configuration:

### 1. `apps.py` (Critical)
This file handles the application-level configuration.
*   **Initialization**: In this project, `apps.py` contains a `ready()` method.
*   **Use**: It triggers the loading of the TFLite model as soon as the Django server starts, ensuring the first user request doesn't experience a delay.

### 2. `models.py`
Defines the database schema using Django's ORM.
*   **Current State**: Empty.
*   **Use**: If you wanted to save every scan result or user history to a database, you would define those tables here.

### 3. `admin.py`
Connects your models to the built-in Django Admin interface.
*   **Current State**: Empty.
*   **Use**: Allows developers to view, add, or delete database records through a web UI (at `/admin/`).

### 4. `tests.py`
The place to write automated tests for your code.
*   **Current State**: Empty.
*   **Use**: You can write Python code here to automatically verify that the `DiseaseDetector` and API endpoints work correctly after every code change.

## 🛠️ Error Handling
The backend implements robust error handling:
*   **Validation Errors**: Checks for missing or empty image data (400 Bad Request).
*   **Model Errors**: Catches failures during loading or inference (500 Internal Server Error).
*   **Logging**: Detailed logs are generated for every step of the process to aid in debugging.
