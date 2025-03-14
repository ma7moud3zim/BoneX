import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import keras
import numpy as np
import cv2
from PIL import Image
import io

# No need to import gdown here since we download the model in the Dockerfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

MODEL_PATH = "BoneX_Final_ModelV4.h5"

# Preprocessing function
def preprocess(image):
    image = image.convert("L")  # Convert to grayscale
    image = image.resize((224, 224))  # Resize to model input shape
    image = np.array(image, dtype=np.uint8)

    # Apply CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    image = clahe.apply(image)

    # Normalize to [0, 1]
    image = (image - image.min()) / (image.max() - image.min())

    # Expand dimensions for model input
    image = np.expand_dims(image, axis=-1)  # Add channel dimension
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

# API route to receive image and predict
@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        image = Image.open(io.BytesIO(file.read()))  # Read image

        # Preprocess and predict
        processed_image = preprocess(image)
        prediction = model.predict(processed_image)
        result = int(prediction[0][0] > 0.5)  # Convert to 0 or 1
        result_text = "There's a fracture!" if result == 0 else "No fracture detected!"

        return jsonify({'prediction': result_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    print("Loading model...")
    try:
        model = keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        sys.exit(1)
        
    # Get port from environment variable or use default
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting server on port {port}...")
    app.run(host='0.0.0.0', debug=False, port=port)