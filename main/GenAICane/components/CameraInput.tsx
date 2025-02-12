import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import delayAsync from 'delay-async';
import HandleClick from './HandleClick';
import { getDescription, getPrediction } from './GetPrediction';
import * as Storage from './Storage';


/**Time in milliseconds between POST request to server for hazard detection */
const STREAM_PERIOD = 5000;

/**Cooldown in milliseconds between automated hazard description */
const DESCRIBE_COOLDOWN = 60000;

export default function CameraInput() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);

  
  useEffect(() => {
    const fetchData = async () => {
      if (permission && permission.granted) {
        const interval = setInterval(async () => {
          if (ref.current) {
            const photo = await ref.current.takePictureAsync({ shutterSound: false });
            if (photo) {
              const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
              const hazard = await getPrediction(base64);

              const timeDescribed = await Storage.getTimeDescribed();
              const isDescribing = await Storage.isDescribing();
              if (hazard == "1" && timeDescribed !== null && Date.now() - timeDescribed >= DESCRIBE_COOLDOWN && !isDescribing) {
                  await Storage.setIsDescribing(true);
                  Speech.speak("Hazard detected! Generating description now");
                  const description = await getDescription(base64);

                  Speech.speak(description.description);
                  await Storage.setTimeDescribed(Date.now());
                  await delayAsync(200); //Wait for the speech to start

                  while(await Speech.isSpeakingAsync()) { //Wait for the speech to finish
                    await delayAsync(100);
                  }

                  await Storage.setTimeDescribed(Date.now());
                  await Storage.setIsDescribing(false);
              }
              await FileSystem.deleteAsync(photo.uri);
            }
          }
        }, STREAM_PERIOD);
        return () => clearInterval(interval);
      }
    };
  
    fetchData();
  }, [permission]);


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} autofocus={'on'} ref={ref} />
      <HandleClick cameraRef={ref}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
});
