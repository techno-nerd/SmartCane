import { Button, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import deleteFile from './DeleteFile';
import { saveImage } from './SaveImage';

function HandleClick({ cameraRef }: { cameraRef: React.RefObject<CameraView> }) {
    
    const handleClick = async () => {
		console.log("Screen clicked");
		if (cameraRef.current) {
			console.log("Picture taken");
			const photo = await cameraRef.current?.takePictureAsync();
			console.log(photo?.uri);
			const new_uri = saveImage(photo?.uri);
      console.log(new_uri)
			deleteFile(photo?.uri);
      //deleteFile(new_uri);
		}
    };
  
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