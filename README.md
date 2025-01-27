This project has two parts
1. For development, data needs to be collected. This is done in the `data-collection` folder
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
1. `backend` is the Flask server, which will handle the hazard detection and description <br>
        - `Python 3.12.7` is recommended. `pip install -r requirements.txt`, ideally using a virtual environment
2. `GenAICane` is the Expo App, which is to be used through Expo Go
3. `model-training` consists of the Jupyter notebooks used to fine-tune and evaluate the different CNN architectures