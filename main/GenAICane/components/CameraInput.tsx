import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import HandleClick from './HandleClick';
import * as FileSystem from 'expo-file-system';
import { getPrediction } from './GetPrediction';

/**Time in milliseconds between POST request to server for hazard detection */
const STREAM_PERIOD = 2000;

export default function CameraInput() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  
  useEffect(() => {
    if (permission && permission.granted) {
      const interval = setInterval(async () => {
        if (ref.current) {
          const photo = await ref.current.takePictureAsync();
          if(photo) {
            const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
            const hazard = await getPrediction(base64);
            console.log(hazard);
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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
