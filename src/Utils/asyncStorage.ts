import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key:string,value:string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e)
  }
};

export const getData = async (key:string):Promise<number|null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return Number(value);
  } catch (e) {
    console.log(e)
    return null;
  }
};

export const removeData = async (key:string) => {
  try {
    const value = await AsyncStorage.removeItem(key);
    return value;
  } catch (e) {
    console.log(e)
  }
};