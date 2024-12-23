import axios from 'axios';
import * as FileSystem from 'expo-file-system';

//Run ifconfig | grep inet
const SERVER_ADDRESS = "http://10.0.0.163:3000"


/**
 * 
 * @param {*} imageURI URI of the image taken
 * @param {String} hazard 'true' for hazard and 'false' for non-hazard
 * @returns 
 */
export const saveImage = async (imageURI, hazard) => {
  const fileName = `image-${Date.now()}.jpg`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Download and save the image to the defined path
  await FileSystem.downloadAsync(imageURI, fileUri);

  try {

    const fileName = fileUri.split('/').pop(); // Extract file name from URI
    const fileType = 'image/jpeg';

    // Convert to FormData for upload
    const formData = new FormData();
    formData.append('image', {
      uri: fileUri,
      name: fileName,
      type: fileType
    });
    formData.append('hazard', hazard);
   
    
    await axios.post(SERVER_ADDRESS+'/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Upload request sent to backend!");
    return fileUri;
    
  } catch (error) {
    console.error("Error saving image or uploading:", error);
    throw error;
  }
};
