/**
 * Create all the helper functions and classes inside helper folder
 * import them inside index.js
 * export and use them
 */

import { Toast as NativeBaseToast } from 'native-base';
import { Alert, AsyncStorage, PermissionsAndroid, Platform } from 'react-native';
import Moment from 'moment';
import axios from 'axios';
import NavigationService from '../services/navigator';
import { MESSAGES } from '../config';
import Permissions from 'react-native-permissions';

/** This ValidationComponent is used in Registration screen */
import ValidationComponent from './validations';


export class Toast {
    /**
     * @method showToast
     * @description Use it to show toast. It internally uses Toast provided by Native Base
     * @param {string} message
     * @param {string} type : possible values : default | warning | success | danger
     * @param {string} position
     */
    static showToast(message = '', type = 'default', position = 'bottom') {
        NativeBaseToast.show({
            text: message,
            buttonText: 'Okay',
            type,
            position,
            duration: 8000
        });
        //return false;
    }

    static clearToastInstance() {
        NativeBaseToast.toastInstance = null;
    }

}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(date) {
    const monthNames = [
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'June', 'July',
        'Aug', 'Sept', 'Oct',
        'Nov', 'Dec'
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

export function convertISOToUtcDate(date) {
    return Moment.utc(date).format('MM/DD/YYYY');
}

export function stripHtml(text) {
    return text.replace(/<[^>]+>/g, '');
}

export function convertDate(date) {
    return Moment(date).format('DD-MMM-YYYY hh:mm A');
}

let showConnectionAlert = true;
export function requestError(error) {
    if (error.code === 'ECONNABORTED' && showConnectionAlert) {
        // alert(error.config.url);
        showConnectionAlert = false;
        Alert.alert(
            'Poor Connection',
            'Poor internet connection. Try later!',
            [
                { text: 'OK', onPress: () => { showConnectionAlert = true; } },
            ],
            { cancelable: false }
        )
    }
}


export function validateText(text) {
    let newText = '';
    const numbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    for (let i = 0; i < text.length; i++) {
        if (numbers.indexOf(text[i]) > -1) {
            newText = newText + text[i];
        }
    }
    return newText;
}


/* display each value */
export const displayValue = (value) => {
    if (typeof value != 'undefined' && typeof value != 'object' && value.trim() != '') {
        return value.trim();
    } else {
        return 'N/A';
    }
};


function onLogout() {
    axios.defaults.headers.common.Authorization = '';
    AsyncStorage.removeItem('LOGGEDUSER');
    AsyncStorage.removeItem('CURRENTROLES');
    NavigationService.navigate('AuthLoading');
    Toast.showToast(MESSAGES.LOGOUT_SUCCESS, 'success');
}


export const apiErrors = (res) => {
    console.log("apiErrors", res);
    const response = res ? res.response : undefined;
    console.log('apiErrors', response);
    if (res && res.data && res.data.error && res.data.error.message && res.data.error.message.value) {
        Toast.showToast(res.data.error.message.value, 'danger');
    } else if (res && response && response.data && response.data.error && response.data.error.message && response.data.error.message.value) {
        Toast.showToast(response.data.error.message.value, 'danger');
    } else if (response.status && response.status == 400) {
        Toast.showToast('You are unauthorized user, please login again.', 'danger');
    } else if (response.status && response.status === 401) {
        Alert.alert(
            'Session Expired!',
            ' Your session has been expired. Please login again.',
            [
                { text: 'OK', onPress: () => onLogout() },
            ],
            { cancelable: false }
        );
    } else if (response && response.status == 403) {
        Toast.showToast('Server error occurred, please try again after sometime.', 'danger');
    } else if (response && (response.status == 500 || response.status == 501 || response.status == 503 || response.status == 502)) {
        Toast.showToast('Server error occurred, please try again after sometime.', 'danger');
    } else {
        Toast.showToast('Something went wrong please try again.', 'danger');
    }
};


export const convertObjectToArray = (valueArray) => {
    let tempArray = [];
    valueArray.map((val) => {
        tempArray.push(val.text);
    });
    return tempArray;
};

export const getFileExtension = (filename) => {
    return filename.split('.').pop();
};


export const stringToArray = (str) => {
    let convertedArray = [];
    if (typeof str != undefined && typeof str == 'string') {
        const convertedStr = str.split(',');
        convertedArray = JSON.parse(convertedStr);
    }
    return convertedArray;
};

/**
 * @method timeConverterIntoUtcFormate
 * @description called to convert IST time into UTC time formate
 */
export const timeConverterIntoUtcFormate = (time) => {
    const currentTime = Moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const utcTime = Moment.utc(currentTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const timeObject = Moment(`${time}:00.000`, 'HH:mm:ss.SSS');
    const currentUtcTime = Moment.utc(timeObject).format('HH:mm:ss.SSS');
    return {
        endTime: currentUtcTime,
        currentDateTime: utcTime
    };
};

/**
 * @method timeConverterIntoUtcFormate
 * @description called to convert local time into UTC time formate
 */
export const timeformate = (time) => {
    const currentTime = Moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const utcTime = Moment.utc(currentTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const userEndTime = Moment(`${time}`, 'hh:mm A');
    return {
        endTime: userEndTime.toISOString(),
        currentDateTime: utcTime
    };
};


/**
    * @method imagePermissionModal
    * @description Ask user for permission for image upload  
    */
export const imagePermissionModal = (callback) => {
    if (Platform.OS === 'ios') {
        Permissions.checkMultiple(['camera', 'photo']).then(response => {
            console.log("Permissions", response);
            if (response.photo == 'authorized' && response.camera == 'authorized') {
                callback();
            } else {
                //Toast.showToast('Permission to access your Camera or Photo is disabled. Please allow from application permission.', 'danger');
                Alert.alert(
                    'Alert',
                    'We need device permissions for accessing the photo and gallery.',
                    [
                        { text: 'Yes', onPress: () => Permissions.openSettings() },
                    ],
                    { cancelable: false }
                );
            }
        });
    } else {
        Permissions.checkMultiple(['camera', 'storage']).then(response => {
            console.log("Permissions", response);
            if (response.camera != 'authorized' || response.storage != 'authorized') {
                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    ], {
                        title: 'Alert',
                        message: 'We need your permission.',
                    },
                ).then((permRes) => {
                    if (permRes['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED && permRes['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && permRes['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
                        callback();
                    }
                });
            } else {
                callback();
            }
        });
    }
};

export { ValidationComponent };
