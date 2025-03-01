# Smart Cane using Generative AI
The purpose of this cane is to investigate the effectiveness of a Gen-AI powered smart cane for allowing visually impaired people to navigate outdoor surroundings independently.

This project has two parts
1. For model training, data needs to be collected. This is done in the `data-collection` folder
2. The final product is in the `main` project, consisting of the parts described below

## Collecting Data

The `data-collection` folder has two subfolders
1. `CaptureImage` is the Expo App, which is to be used through Expo Go
    - `cd CaptureImage`
    - `npx expo start`
2. `image-backend` is the Node server 
    - `cd image-backend`
    - `node server.js`


## Main Application

The `main` folder has several folders
1. `backend` is the Flask server, which will handle the hazard detection (using a fine-tuned CNN) and description (using `llama-3.2-90b-vision-preview` through Groq API) <br>
        - `Python 3.12.7` is recommended
        - Install dependencies using: `pip install -r requirements.txt`
2. `GenAICane` is the Expo App, which is to be used through Expo Go. Details on setting up the Expo app are in this folder's `README.md` file 
3. `model-training` consists of the Jupyter notebooks used to fine-tune and evaluate the different CNN architectures
4. `models` contains the fine-tuned model files in `.keras` format