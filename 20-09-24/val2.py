from flask import Flask, jsonify, request
from ultralytics import YOLO
import cv2
import pytesseract
import re
import os

app = Flask(__name__)

# Load YOLO model
model = YOLO('E:\\Python-server\\best(2).pt')

@app.route('/extract-data', methods=['POST'])
def extract_data():
    # Image path from the POST request
    data = request.json
    image_path = data.get('image_path')

    if not image_path or not os.path.exists(image_path):
        return jsonify({"error": "Image not found or invalid path."}), 400

    results = model.predict(image_path, save=True, save_txt=True)

    predicted_image_path = os.path.join('runs', 'detect', 'exp', 'image0.jpg')  
    
    img = cv2.imread(image_path)

    extracted_data = {}

    for result in results:
        boxes = result.boxes.xyxy
        labels = result.boxes.cls
        confidences = result.boxes.conf
        names = result.names

        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = map(int, box)
            label = names[int(labels[i])]
            confidence = confidences[i]

            roi = img[y1:y2, x1:x2]
            custom_config = r'--psm 6'
            text = pytesseract.image_to_string(roi, config=custom_config).strip()

            if label.lower() == "date":
                extracted_data['date'] = text
            elif label.lower() == "totalprice":
                total_match = re.search(r'\$?\d+\.?\d*', text)
                extracted_data['totalprice'] = total_match.group(0) if total_match else "No total found"
            elif label.lower() == "title":
                extracted_data['title'] = text

    return jsonify({
        "predicted_image_path": predicted_image_path,
        "extracted_data": extracted_data
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)




# from flask import Flask, jsonify, request
# from ultralytics import YOLO
# import cv2
# import pytesseract
# import re
# import os

# app = Flask(__name__)

# # Load YOLO model
# model = YOLO('E:\\Python-server\\best.pt')

# @app.route('/extract-data', methods=['POST'])
# def extract_data():
#     # image path from the POST request
#     data = request.json
#     image_path = data.get('image_path')

#     if not image_path or not os.path.exists(image_path):
#         return jsonify({"error": "Image not found or invalid path."}), 400

#     # Run YOLO model on the image
#     results = model.predict(image_path, save=True, save_txt=True)
#     img = cv2.imread(image_path)
#     # Dictionary to hold extracted values
#     extracted_data = {}
#     # List to hold extracted items (description)
#     extracted_data['description'] = []





#     for result in results:
#         boxes = result.boxes.xyxy
#         labels = result.boxes.cls
#         confidences = result.boxes.conf
#         names = result.names

#         for i, box in enumerate(boxes):
#             x1, y1, x2, y2 = map(int, box)
#             label = names[int(labels[i])]
#             confidence = confidences[i]

#             # Extract ROI from image
#             roi = img[y1:y2, x1:x2]
#             custom_config = r'--psm 6'
#             text = pytesseract.image_to_string(roi, config=custom_config).strip()

#             # Handle different label cases
#             if label.lower() == "date":
#                 extracted_data['date'] = text
#             elif label.lower() == "totalprice":
#                 total_match = re.search(r'\$?\d+\.?\d*', text)
#                 extracted_data['totalprice'] = total_match.group(0) if total_match else "No total found"
#             elif label.lower() == "title":
#                 extracted_data['title'] = text
#             elif label.lower() == "item" or label.lower() == "description":
#                 # Append each detected item (description) to the list
#                 extracted_data['description'].append(text)

#     # Return extracted data as JSON
#     return jsonify(extracted_data)

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
