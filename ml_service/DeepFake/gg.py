import os
import subprocess
import sys
import tensorflow as tf
import tf2onnx
import shutil

input_model_path = "deepfake_detector.keras"
output_onnx_path = "model.onnx"
temp_saved_model = "temp_saved_model"

if not os.path.exists(input_model_path):
    print(f"❌ Error: {input_model_path} not found.")
else:
    print("✅ Model found. Starting CLEAN conversion...")

    try:
        # 1. Load the model
        model = tf.keras.models.load_model(input_model_path, compile=False)
        
        # 2. Create a NEW model that only includes the inference layers
        # This effectively strips out RandomFlip, RandomZoom, and Dropout
        input_layer = tf.keras.Input(shape=(224, 224, 3), name='input_layer_4')
        output_layer = model(input_layer, training=False) # <--- CRITICAL: training=False
        clean_model = tf.keras.Model(inputs=input_layer, outputs=output_layer)

        # 3. Export to SavedModel
        print("📦 Step 1: Exporting clean inference model...")
        clean_model.export(temp_saved_model)

        # 4. Convert to ONNX
        print("🚀 Step 2: Converting to ONNX...")
        subprocess.run([
            sys.executable, "-m", "tf2onnx.convert",
            "--saved-model", temp_saved_model,
            "--output", output_onnx_path,
            "--opset", "15" # Bumped to 15 for better compatibility
        ], check=True)

        print(f"🎉 Success! Clean ONNX model saved as: {output_onnx_path}")
        
        if os.path.exists(temp_saved_model):
            shutil.rmtree(temp_saved_model)

    except Exception as e:
        print(f"💥 Conversion failed: {str(e)}")