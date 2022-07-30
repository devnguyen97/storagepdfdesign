import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import * as helper from '../helper';


export const getItem = (key) => {
    return new Promise((resolve) => {
        AsyncStorage.getItem(key, (error, result) => {
            if (!helper.IsValidateObject(result)) {
                return resolve(result);
            }
            resolve(result);
        });
    });
};
export const setItem = (key, value) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(key, value, (error, result) => {
            if (helper.IsValidateObject(error)) {
                return reject(error);
            }
            resolve(result);
        });
    });
};
export const multiSet = (arrKeyValue) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.multiSet(arrKeyValue, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

export const getMultiItem = (arrKeyValue) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.multiGet(arrKeyValue, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

export const deleteAllKeys = (ignoreKeys = []) => {
    return new Promise((resolve) => {
        AsyncStorage.getAllKeys((err, keys) => {
            if (err) {
                console.log('error : ', err);
                resolve(null);
            }
            const reKeysDelete = [];
            keys.forEach((key) => {
                const index = ignoreKeys.findIndex((k) => k === key);
                if (index !== -1) {
                    return;
                }
                reKeysDelete.push(key);
            });
            console.log('keys removed ', reKeysDelete);
            AsyncStorage.multiRemove(reKeysDelete, (multiRemoveError) => {
                if (multiRemoveError) {
                    console.log('error : ', multiRemoveError);
                    resolve(null);
                }
                resolve(reKeysDelete);
            });
        });
    });
};

export const removeItem = (key) => {
    return new Promise((resolve) => {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!helper.IsValidateObject(result)) {
                return resolve(result);
            }
            resolve(result);
        });
    });
};
