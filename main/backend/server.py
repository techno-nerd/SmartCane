import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import main.backend.utils as utils
import json
import base64
from io import BytesIO
from PIL import Image, ImageOps


app = Flask(__name__)
CORS(app)
load_dotenv()

IMAGE_SIZE = 528

model = tf.keras.models.load_model("../models/EfficientNET.keras")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def decode_base64_image(base64_string):
    img_data = base64.b64decode(base64_string)
    img = Image.open(BytesIO(img_data))
    img = img.convert('L')
    img = ImageOps.fit(img, (IMAGE_SIZE, IMAGE_SIZE), method=Image.Resampling.LANCZOS)
    print(img.size)
    return img


# Route to handle image prediction
@app.route('/predict', methods=['POST'])
def predict():
    print("Hit on /predict")
    try:
        # Step 1: Get the base64 image from the request
        data = request.get_json()
        base64_image = data['image']

        # Step 2: Decode the base64 image
        img = decode_base64_image(base64_image)

        # Step 3: Preprocess the image
        img = img.resize((IMAGE_SIZE, IMAGE_SIZE))
        img_array = np.expand_dims(np.array(img), axis=0)

        # Step 4: Make a prediction with the model
        prediction = model.predict(img_array)

        # Step 5: Process the model's output and prepare the response
        predicted_class = np.argmax(prediction, axis=-1)
        
        print(predicted_class)

        response = {
            'prediction': str(predicted_class[0])
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/describe', methods=['POST'])
def describe():
    
    data = request.get_json()
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", 
                    "text": utils.JSON_PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{data['image']}",
                        },
                    },
                ],
            },
        ],
        model="llama-3.2-90b-vision-preview",
        temperature=0,
    )

    message = chat_completion.choices[0].message.content
    temp_json = json.loads(utils.extract_json(message))
    utils.save_json(data['image'], temp_json['description'], temp_json['hazard'])

    try:
        return jsonify(utils.extract_json(message))
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
