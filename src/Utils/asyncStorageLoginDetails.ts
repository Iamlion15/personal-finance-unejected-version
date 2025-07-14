import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserData = async (userInfo: any) => {
  try {
    await AsyncStorage.setItem('userInfo', userInfo);
  } catch (error) {
    console.error('Failed to save user data', error);
  }
};

const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userInfo');
    return jsonValue
  } catch (e) {
    console.error('Failed to load user data', e);
    return null;
  }
};

export {storeUserData,getUserData}