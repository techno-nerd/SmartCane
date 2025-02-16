import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import utils
import json
import base64
from io import BytesIO
from PIL import Image, ImageOps


app = Flask(__name__)
CORS(app)
load_dotenv()

IMAGE_SIZE = 512

model = tf.keras.models.load_model("../models/EfficientNET.keras")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def decode_base64_image(base64_string):
    img_data = base64.b64decode(base64_string)
    img = Image.open(BytesIO(img_data))
    img = img.convert('RGB')
    img = ImageOps.fit(img, (IMAGE_SIZE, IMAGE_SIZE), method=Image.Resampling.LANCZOS)
    return img


# Route to handle image prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        base64_image = data['image']

        img = decode_base64_image(base64_image)

        img_array = np.expand_dims(np.array(img), axis=0)

        prediction = model.predict(img_array, verbose=0)
        print(prediction[0][0])
        predicted_class = 1 if prediction[0][0] > 0.5 else 0
        
        response = {
            'prediction': str(predicted_class)
        }

        return jsonify(response)
    except Exception as e:
        print(e)
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