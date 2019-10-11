import axios from 'axios';
import {
    AUTH_API_REQUEST,
    AUTH_API_FAILURE,
    LOGIN_SUCCESS,
    UPDATE_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_SUCCESS,
    LOGOUT_SUCCESS, AUTH_LOGOUT_API_REQUEST
} from '../constants';
import { API, MESSAGES } from '../config';
import { apiErrors, Toast, } from '../helper';
import { formatGetUserProfileResult } from '../utils/ApiResponse';

const headers = {
    'Content-Type': 'application/json',
};

/** 
* @method loginUser
* @description get data from dummy api
*/
export function loginUserAPI(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: AUTH_API_REQUEST });
        axios.post(API.login, requestData, { headers })
            .then((response) => {
                const userFormatedData = formatGetUserProfileResult(response.data);
                callback(response);
                dispatch(getLoginSuccess(userFormatedData));
            })
            .catch((error) => {
                dispatch(getFailure(error)); 
                apiErrors(error);  
            });
    };
}

/**
* @method getLoginSuccess
* @description return object containing action type
*/
export function getLoginSuccess(data) {
    return {
        type: LOGIN_SUCCESS,
        payload: data,
    };
}

/**
* @method getFailure
* @description return object containing action type
*/
export function getFailure() {
    return {
        type: AUTH_API_FAILURE
    };
}

/**
* @method updatePasswordAPI
* @description update Password
*/
export function updatePasswordAPI(requestData, userId, callback) {
    return (dispatch) => {
        dispatch({ type: AUTH_API_REQUEST });
        axios.post((API.updatePassword) + userId, requestData, { headers })
            .then((response) => {
                callback(response);
                dispatch(getUpdatePasswordSuccess(response));
            })
            .catch((error) => {
                if (error.response.status == 400) {
                    Toast.showToast(MESSAGES.OLD_PASSWORD_ERROR, 'danger');
                    dispatch({ type: AUTH_API_FAILURE, });
                } else {
                    Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                    dispatch({
                        type: AUTH_API_FAILURE,
                    });
                    apiErrors(error);                  
                }
            });
    };
}

/**
* @method getUpdatePasswordSuccess
* @description return object containing action type
*/
export function getUpdatePasswordSuccess(data) {
    return {
        type: UPDATE_PASSWORD_SUCCESS,
    };
}

/**
* @method forgotPasswordAPI
* @description Register user by email
*/
export function forgotPasswordAPI(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: AUTH_API_REQUEST });
        axios.post(API.forgotPassword, requestData, { headers })
            .then((response) => {
                callback(response);
                dispatch(getForgotPasswordSuccess(response));
            })
            .catch((error) => {
                if (error.response.status == 400) {
                    Toast.showToast(MESSAGES.INVALID_EMAIL, 'danger');
                    dispatch(getForgotPasswordFailure(error));
                } else {
                    Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                    dispatch(getForgotPasswordFailure(error));
                    apiErrors(error);
                }
            });
    };
}

/**
* @method getForgotPasswordSuccess
* @description return object containing action type
*/
export function getForgotPasswordSuccess(data) {
    return {
        type: FORGOT_PASSWORD_SUCCESS,
        data,
    };
}

/**
* @method getForgotPasswordFailure
* @description return object containing action type
*/
export function getForgotPasswordFailure() {
    return {
        type: AUTH_API_FAILURE
    };
}

/**
* @method logOutUserAPI
* @description get data from dummy api
*/
export function logOutUserAPI(callback) {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGOUT_API_REQUEST });
        axios.post(API.logout, { headers })
            .then((response) => {
                callback(response);
                dispatch(getLogOutSuccess(response));
            })
            .catch((error) => {
                dispatch(getLogOutFailure(error));
                apiErrors(error);
                callback(error);
            });
    };
}

/**
* @method getLogOutSuccess
* @description return object containing action type
*/
export function getLogOutSuccess(data) {
    return {
        type: LOGOUT_SUCCESS,
        data,
    };
}

/**
 * @method getLogOutFailure
 * @description return object containing action type
 */
export function getLogOutFailure() {
    return {
        type: AUTH_API_FAILURE
    };
}
