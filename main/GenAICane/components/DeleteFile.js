import * as FileSystem from 'expo-file-system';

const deleteFile = async (fileUri) => {
  try {
    await FileSystem.deleteAsync(fileUri);
    console.log("File deleted successfully:", fileUri);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export default deleteFile;