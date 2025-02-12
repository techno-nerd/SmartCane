import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { CameraView } from 'expo-camera';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import delayAsync from 'delay-async';
import { getDescription } from './GetPrediction';
import * as Storage from './Storage';


/**
 * 
 * @param cameraRef 
 * @returns Component which generates and reads out a description of the surroundings
 */
function HandleClick({ cameraRef }: { cameraRef: React.RefObject<CameraView> }) {


  const handleClick = async () => {
    const isDescribing = await Storage.isDescribing();

    if (!isDescribing) {
      await Storage.setIsDescribing(true);

      const photo = await cameraRef.current?.takePictureAsync();
      if (photo) {
        const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
        const description = await getDescription(base64);
        Speech.speak(description.description);
        await Storage.setTimeDescribed(Date.now());
        await delayAsync(200); //Wait for the speech to start
        while(await Speech.isSpeakingAsync()) { //Wait for the speech to finish
          await delayAsync(100);
        }

        FileSystem.deleteAsync(photo.uri);
        await Storage.setTimeDescribed(Date.now());
      } 
      else {
        Speech.speak("Error: Could not take picture");
      }
      await Storage.setIsDescribing(false);
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