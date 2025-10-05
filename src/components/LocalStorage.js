import AsyncStorage from '@react-native-async-storage/async-storage';

//Storing data
const storeData = async (keyVal, value) => {// Storing string value
    try {
        await AsyncStorage.setItem(keyVal, value);
    } catch (e) {
        // saving error
    }
};

// Reading data
const getData = async (keyVal, setVal) => {//Reading string value
    try {
        const value = await AsyncStorage.getItem(keyVal);
        if (value !== null) {
            setVal(value) // value previously stored
        }
    } catch (e) {
        // error reading value
    }
};

export {
    getData,
    storeData
};

