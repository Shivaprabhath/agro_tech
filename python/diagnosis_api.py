from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import requests
import os
import werkzeug
from flask_cors import CORS

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Constants
MODEL_PATH = r"C:\Users\dlsat\cropconnectivity-platform\python\leaf_classifier_model.keras"
API_URL = "https://api-inference.huggingface.co/models/ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease"
HEADERS = {"Authorization": "HF_TOKEN"}

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load the model
try:
    print("Loading TensorFlow model...")
    model = load_model(MODEL_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Failed to load model: {e}")
    model = None

# Hugging Face API query
def query_huggingface(file_path: str):
    try:
        with open(file_path, "rb") as f:
            data = f.read()
        response = requests.post(API_URL, headers=HEADERS, data=data)
        response.raise_for_status()
        print(response.json())
        return response.json()
    except Exception as e:
        print(f"Error querying Hugging Face API: {e}")
        return []

# Image classification function
def classify_image(file_path: str):
    try:
        img = image.load_img(file_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array, verbose=0)
        # Assuming binary output: [0]=leaf, [1]=not leaf
        if prediction[0][0] <= 0.5:
            for attempt in range(3):  # Retry up to 3 times if needed
                results = query_huggingface(file_path)
                if results and len(results) > 0:
                    return "Leaf", results
            return "Leaf", [{"label": "Unknown", "score": 0}]
        else:
            return "Not a leaf", []
    except Exception as e:
        print(f"Error classifying image: {e}")
        return "Error", []

# Route to classify uploaded file
@app.route('/classify', methods=['POST'])
def classify():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = werkzeug.utils.secure_filename(file.filename)
    file_path = os.path.join(".", f"temp_{filename}")

    try:
        file.save(file_path)
        label, hf_results = classify_image(file_path)

        if label == "Not a leaf":
            return jsonify({"output": "Not a leaf"})

        elif label == "Error":
            return jsonify({"error": "Error during image classification"}), 500

        # Process Hugging Face results
        top_result = hf_results[0] if hf_results else {"label": "Unknown", "score": 0}
        disease_label = top_result.get("label", "Unknown")
        confidence = round(top_result.get("score", 0), 4)
        print(top_result)
        print(confidence)
        print(disease_label)
        return jsonify({
            "disease_name": disease_label,
            "confidence_score": confidence,
            "output": f"Plant Disease: {disease_label}, Confidence Score: {confidence:.4f}"
        })

    except Exception as e:
        print(f"Exception in /classify route: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

# Health check route
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
