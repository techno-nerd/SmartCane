import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { CameraView } from 'expo-camera';
import deleteFile from './DeleteFile';
import { getDescription } from './GetPrediction';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';


/**
 * 
 * @param cameraRef 
 * @returns Component which generates and reads out a description of the surroundings
 */
function HandleClick({ cameraRef }: { cameraRef: React.RefObject<CameraView> }) {

  const handleClick = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if(photo) {
      const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
      const description = await getDescription(base64);
      Speech.speak(description.description);
      deleteFile(photo?.uri);
    }
    else {
      Speech.speak("Error: Could not take picture");
    }
    
  }
    
  
    return (
      <TouchableWithoutFeedback onPress={handleClick}>
        <View style={styles.touchableArea} />
      </TouchableWithoutFeedback>
    );
  }

  const styles = StyleSheet.create({
    touchableArea: {
      ...StyleSheet.absoluteFillObject, // Makes the area cover the entire screen
    },
  });

export default HandleClick;