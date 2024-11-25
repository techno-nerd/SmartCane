import { Button, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import deleteFile from './DeleteFile';
import { saveImage } from './SaveImage';

/**
 * 
 * @param cameraRef 
 * @returns Component which saves image as non-hazard on click and hazard on long press
 */
function HandleClick({ cameraRef }: { cameraRef: React.RefObject<CameraView> }) {


  const handleClick = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    saveImage(photo?.uri, 'false');
    deleteFile(photo?.uri);
  }
    
  const handleLongClick = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    saveImage(photo?.uri, 'true');
    deleteFile(photo?.uri);
  }
  
    return (
      <TouchableWithoutFeedback onPress={handleClick} delayPressIn={0} onLongPress={handleLongClick}>
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