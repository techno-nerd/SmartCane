import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const IS_DESCRIBING_KEY = 'isDescribing';
const TIME_DESCRIBED_KEY = 'timeDescribed';

// Function to initialize isDescribing to false if not set
export const initializeStorage = async () => {
    await AsyncStorage.setItem(IS_DESCRIBING_KEY, JSON.stringify(false));
    await AsyncStorage.setItem(TIME_DESCRIBED_KEY, JSON.stringify(0));

    console.log('Initialized');
};

// Function to store isDescribing boolean
export const setIsDescribing = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(IS_DESCRIBING_KEY, JSON.stringify(value));
    console.log(`Stored isDescribing: ${value}`);
  } catch (error) {
    console.error('Error storing isDescribing:', error);
  }
};

// Function to retrieve isDescribing
export const isDescribing = async (): Promise<boolean | null> => {
  try {
    const value = await AsyncStorage.getItem(IS_DESCRIBING_KEY);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving isDescribing:', error);
    return null;
  }
};

// Function to store timeDescribed
export const setTimeDescribed = async (value: number) => {
  try {
    await AsyncStorage.setItem(TIME_DESCRIBED_KEY, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing timeDescribed:', error);
  }
};

// Function to retrieve timeDescribed
export const getTimeDescribed = async (): Promise<number | null> => {
  try {
    const value = await AsyncStorage.getItem(TIME_DESCRIBED_KEY);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving timeDescribed:', error);
    return null;
  }
};
