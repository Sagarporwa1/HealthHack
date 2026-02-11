# AI Results: Frontend vs. Backend Comparison

This document analyzes whether the frontend restricts or modifies the AI results received from the Django backend.

## 🔀 Data Transformation Summary

Yes, the frontend performs several transformations on the "raw" AI data before showing it to the user.

| Data Point | Backend (Raw) | Frontend (Display) | Difference |
|------------|---------------|-------------------|------------|
| **Disease %** | Exact decimal (e.g., `12.45`) | Rounded integer (e.g., `12%`) | Loss of precision. |
| **Confidence** | Value from `0.0` to `1.0` | **Ignored** | The backend's confidence score is not used. |
| **Severity** | 5 Levels (`HEALTHY` to `CRITICAL`) | 3 Risk Levels (`LOW` to `HIGH`) | Mapped for UI simpler themes. |
| **Confidence Labelling** | N/A | Labeled as "Confidence" | The UI uses the **Disease Percentage** and labels it as "Confidence", which is technically different from the model's confidence. |

## 🔍 Detailed Analysis

### 1. The "Confidence" Misalignment
In `CameraScreen.js` (Line 129), the code does this:
```javascript
confidence: Math.round(result.diseasePercentage),
```
**Observation**: The frontend takes the **extent of the disease** (percentage) and shows it as the **confidence of the model**.
*   *Backend Intent*: Percentage = How much of the image is affected. Confidence = How sure the model is.
*   *Frontend Display*: Shows "15% Confidence" when the backend actually meant "15% of the area is affected".

### 2. Severity to Risk Mapping
In `CameraScreen.js` (Line 109), the 5 backend levels are simplified into 3 UI colors:
*   `HEALTHY` / `MILD` → **Low Risk** (Green)
*   `MODERATE` → **Medium Risk** (Yellow)
*   `SEVERE` / `CRITICAL` → **High Risk** (Red)

### 3. Finding Generation
The frontend constructs a readable list of findings in `CameraScreen.js` (Lines 130-137) rather than showing raw JSON objects. This is a beneficial restriction as it makes the data actionable for a non-technical user.

## ⚖️ Conclusion
The frontend **does not restrict the core analysis**, but it **simplifies and re-labels** the data for a better user experience. The most significant "restriction" is the omission of the true confidence score in favor of showing the disease percentage as a confidence metric.
