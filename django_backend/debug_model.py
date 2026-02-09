import tensorflow as tf
import os
import numpy as np

# Adjust path to your model
MODEL_PATH = 'ml_model/oral_segmentation_quantized.tflite'

def debug_model():
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model not found at {MODEL_PATH}")
        return

    try:
        interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
        interpreter.allocate_tensors()

        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        print("\n=== Model Debug Info ===")
        for i, detail in enumerate(input_details):
            print(f"\nInput {i}:")
            print(f"  Name: {detail['name']}")
            print(f"  Shape: {detail['shape']}")
            print(f"  Type: {detail['dtype']}")
            print(f"  Quantization: {detail['quantization']}")
            print(f"  Index: {detail['index']}")

        for i, detail in enumerate(output_details):
            print(f"\nOutput {i}:")
            print(f"  Name: {detail['name']}")
            print(f"  Shape: {detail['shape']}")
            print(f"  Type: {detail['dtype']}")
            print(f"  Quantization: {detail['quantization']}")
            print(f"  Index: {detail['index']}")
            
        print("\n========================")

        # Try a dummy inference
        print("\nRunning dummy inference...")
        input_shape = input_details[0]['shape']
        input_type = input_details[0]['dtype']
        
        if input_type == np.float32:
            dummy_input = np.random.random(input_shape).astype(np.float32)
        elif input_type == np.int8:
             dummy_input = np.random.randint(-128, 127, input_shape, dtype=np.int8)
        elif input_type == np.uint8:
             dummy_input = np.random.randint(0, 255, input_shape, dtype=np.uint8)
        else:
             dummy_input = np.zeros(input_shape, dtype=input_type)
             
        interpreter.set_tensor(input_details[0]['index'], dummy_input)
        interpreter.invoke()
        print("Inference successful!")

    except Exception as e:
        print(f"\nERROR during inspection/inference: {e}")

if __name__ == "__main__":
    debug_model()
