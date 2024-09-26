from ultralytics import YOLO
import cv2
import pytesseract
import re

# Load the YOLO model
model = YOLO('E:\\Transformers\\best.pt')

# Perform inference on the image
results = model.predict('E:\\Transformers\\images\\1029-receipt_jpg.rf.920e84b5652f273fa8971cade7222cd3.jpg', save=True, save_txt=True)

# Load the image using OpenCV
img = cv2.imread('E:\\Transformers\\images\\1029-receipt_jpg.rf.920e84b5652f273fa8971cade7222cd3.jpg')

# Loop through the YOLO results
for result in results:
    # Extract bounding boxes, labels, and confidence scores
    boxes = result.boxes.xyxy  # Bounding boxes [x1, y1, x2, y2]
    labels = result.boxes.cls  # Class labels (e.g., "Date", "TotalPrice")
    confidences = result.boxes.conf  # Confidence scores
    names = result.names  # Class names corresponding to the labels

    # Loop through each detected box
    for i, box in enumerate(boxes):
        x1, y1, x2, y2 = map(int, box)  # Convert box coordinates to integers
        label = names[int(labels[i])]  # Get the corresponding class label
        confidence = confidences[i]  # Confidence score

        # Crop the region of interest (ROI) from the image
        roi = img[y1:y2, x1:x2]

        # Configure Tesseract OCR to extract text from the ROI
        custom_config = r'--psm 6'
        text = pytesseract.image_to_string(roi, config=custom_config)

        # Clean up the extracted text
        text = text.strip()

        # Process based on the detected label
        if label.lower() == "date":
            print(f'Extracted value for {label}: {text}')
        elif label.lower() == "totalprice":
            # Use regex to extract a price from the text
            total_match = re.search(r'\$?\d+\.?\d*', text)
            extracted_value = total_match.group(0) if total_match else "No total found"
            print(f'Extracted value for {label}: {extracted_value}')
        elif label.lower() == "title":
            print(f'Extracted value for {label}: {text}')

# Optionally, you could save the image and labels:
cv2.imwrite('E:\\Transformers\\output\\processed_receipt.jpg', img)
