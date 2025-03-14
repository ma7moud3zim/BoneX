from flask_cors import CORS 
import numpy as np
import cv2
from deepface import DeepFace
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

CORS(app)

@app.route('/verify-face', methods=['POST'])
def verify_face():
    try:
        # Check if both images are included in the request
        if 'image1' not in request.files or 'image2' not in request.files:
            return jsonify({
                'success': False,
                'error': 'Missing images. Both image1 and image2 must be provided.'
            }), 400
            
        # Get the images from the request
        image1 = request.files['image1']
        image2 = request.files['image2']
        
        # Read the images as binary data
        image1_data = image1.read()
        image2_data = image2.read()
        
        # Convert binary data to numpy arrays
        img1_array = np.frombuffer(image1_data, dtype=np.uint8)
        img2_array = np.frombuffer(image2_data, dtype=np.uint8)
        
        # Decode the images to obtain OpenCV images
        img1 = cv2.imdecode(img1_array, cv2.IMREAD_COLOR)
        img2 = cv2.imdecode(img2_array, cv2.IMREAD_COLOR)
        
        # Verify if the faces match using DeepFace
        result = DeepFace.verify(img1, img2, model_name="VGG-Face")
        
        # Return the verification result
        return jsonify({
            'success': True,
            'match': result['verified'],
            'distance': result.get('distance', None),
            'threshold': result.get('threshold', None),
            'model': result.get('model', "VGG-Face")
        })
    
    except ValueError as e:
        # Handle cases where no face is detected
        return jsonify({
            'success': False, 
            'error': 'Face detection failed. Ensure clear images with visible faces are provided.',
            'details': str(e)
        }), 400
    
    except Exception as e:
        # Handle other exceptions
        return jsonify({
            'success': False,
            'error': 'An error occurred during processing',
            'details': str(e)
        }), 500

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Face verification API is running'
    })

if __name__ == '__main__':
    # Get port from environment variable (for Railway compatibility)
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
