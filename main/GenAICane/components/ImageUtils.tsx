import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import ImageSize from 'react-native-image-size';


interface ImageDimensions {
  width: number;
  height: number;
}

const getImageDimensions = async (base64: string): Promise<ImageDimensions> => {
  const uri = `data:image/jpeg;base64,${base64}`;
  const { width, height } = await ImageSize.getSize(uri);
  return { width, height };
};

const resizeBase64Image = async (base64: string): Promise<string | undefined> => {
  try {
    const { width, height } = await getImageDimensions(base64);

    const manipResult = await ImageManipulator.manipulateAsync(
      `data:image/jpeg;base64,${base64}`,
      [{ resize: { width: width / 4, height: height / 4 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    const resizedBase64 = await FileSystem.readAsStringAsync(manipResult.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileInfo = await FileSystem.getInfoAsync(manipResult.uri);
    if (fileInfo.exists && fileInfo.size) {
      console.log(`Resized image size: ${(fileInfo.size / 1024).toFixed(2)} KB`);
    }

    // Delete the resized image file
    await FileSystem.deleteAsync(manipResult.uri);
    
    return resizedBase64;
  } catch (error) {
    console.error('Error resizing image:', error);
  }
};

export { resizeBase64Image };