import { AsyncStorage } from 'react-native';
import axios from 'axios';
import {
    API_REQUEST, API_FAILURE,
    UPDATE_USER_PROFILE_SUCCESS,
    MEMBER_SUCCESS, MEMBER_FAILURE,
    FETCH_USER_DATA,
    USER_PROFILE_IMAGE_SUCCESS,
    GET_USER_PROFILE_SUCCESS
} from '../constants';

import { API, MESSAGES } from '../config';
import { apiErrors, Toast } from '../helper';

const headers = {
    'Content-Type': 'application/json',
};

/**
 * @method updateUserProfileAPI
 * @description update user profile data
 */

export function updateUserProfileAPI(requestData, userId, callback) {
    return (dispatch) => {
        dispatch({ type: API_REQUEST });
        axios.put((API.updateUserProfile) + userId, requestData, { headers })
            .then((response) => {
                console.log('updateUserProfileAPI success', response);
                updateAsyncStorage(dispatch, requestData, () => {
                    dispatch(getUserProfileUpdateSuccess(response));
                    callback(response);
                });
            }).catch((error) => {
                console.log('updateUserProfileAPI error', error);
                apiErrors(error);
                dispatch({ type: API_FAILURE });
            });
    };
}

/**
 * @method getUserProfileUpdateSuccess
 * @description return object containing action type
 */
export function getUserProfileUpdateSuccess(data) {
    return {
        type: UPDATE_USER_PROFILE_SUCCESS,
    };
}

/**
 * @method getMembersAPI
 * @description get user profile data
 */
export function getMembersAPI() {
    return (dispatch) => {
        dispatch({ type: API_REQUEST });
        const request = axios.get(API.getMembersApi, { headers });
        request.then((response) => {
            if (response.status === 200) {
                dispatch(getMemberSuccess(response.data));
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                dispatch(getMemberFailure());
            }
        }).catch((error) => {
            apiErrors(error);
            dispatch(getMemberFailure());
        });
    };
}

/**
 * @method getLoginSuccess
 * @description return object containing action type
 */
export function getMemberSuccess(data) {
    return {
        type: MEMBER_SUCCESS,
        payload: data,
    };
}

/**
 * @method getFailure
 * @description return object containing action type
 */
export function getMemberFailure() {
    return {
        type: MEMBER_FAILURE
    };
}

function updateAsyncStorage(dispatch, updateData, callback) {
    AsyncStorage.multiGet(['LOGGEDUSER', 'CURRENTROLES'])
        .then((value) => {
            console.log("updateUserData ", value);
            if (value !== null) {
                let loggedUser = JSON.parse(value[0][1]);
                let userData = {
                    ...loggedUser,
                    ...updateData
                };
                const userDataValue = { loggedUser: userData, curentRoles: JSON.parse(value[1][1]) };
                AsyncStorage.setItem('LOGGEDUSER', JSON.stringify(userData))
                    .then(() => {
                        dispatch({
                            type: FETCH_USER_DATA,
                            payload: userDataValue
                        });
                        callback();
                    });
            }
        });
}

/**
* @method onUploadUserProfileImageAPI
* @description used to upload user profile image
*/

export function onUploadUserProfileImageAPI(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: API_REQUEST });
        let formData = new FormData();
        formData.append('image', requestData);
        const multipartHeaders = {
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        };
        axios.post(`${API.updateUserProfile}${requestData.userId}/image`, formData, { multipartHeaders })
            .then((response) => {
                dispatch({ type: USER_PROFILE_IMAGE_SUCCESS });
                callback(response);
            })
            .catch((error) => {
                dispatch({ type: API_FAILURE });
                apiErrors(error);
            });
    };
}

/**
* @method onUploadUserProfileImageAPI
* @description used to get user profile details
*/

export function getUserProfile(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: API_REQUEST });
        const request = axios.get(`${API.getUserDetails}/${requestData.userId}`, { headers });
        request.then((response) => {
            dispatch({
                type: GET_USER_PROFILE_SUCCESS,
                payload: response
            });
            callback(response);
        }).catch((error) => {
            dispatch({ type: API_FAILURE });
            apiErrors(error);
        });
    };
}
