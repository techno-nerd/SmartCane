import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import HandleClick from './HandleClick';
import * as FileSystem from 'expo-file-system';
import { getDescription, getPrediction } from './GetPrediction';
import * as Speech from 'expo-speech';
import deleteFile from './DeleteFile';


/**Time in milliseconds between POST request to server for hazard detection */
const STREAM_PERIOD = 10000;

/**Cooldown in milliseconds between automated hazard description */
const DESCRIBE_COOLDOWN = 60000;

export default function CameraInput() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  let timeDescribed = 0;
  
  useEffect(() => {
    if (permission && permission.granted) {
      const interval = setInterval(async () => {
        if (ref.current) {
          const photo = await ref.current.takePictureAsync({ shutterSound: false });
          if(photo) {
            let timeStart = Date.now();
            const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
            const hazard = await getPrediction(base64);
            console.log(hazard);
            if(hazard == "1" && Date.now()-timeDescribed >= DESCRIBE_COOLDOWN) {
              Speech.speak("Hazard detected! Generating description now");
              const description = await getDescription(base64);
              Speech.speak(description.description);
              timeDescribed = Date.now();
            }
            console.log(Date.now()-timeStart);
            deleteFile(photo.uri);
          }
        }
      }, STREAM_PERIOD);
      return () => clearInterval(interval);
    }
  }), [permission];


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
