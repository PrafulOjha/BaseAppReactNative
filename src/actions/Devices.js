import axios from 'axios';
import {
    DEVICES_API_REQUEST, DEVICES_API_FAILURE,
    ASSET_PARAMETER_SUCCESS,
    GET_ASSETS_LIGHT_ON_SUCCESS,
    GET_ASSET_LIGHT_OFF_OR_RESET_SUCCESS,
    DEVICE_LOADER_EVENT,
    DEVICE_MODEL_POPUP_EVENT,
    DEVICE_STATUS_EVENT
} from '../constants';

import { API } from '../config';
import { apiErrors } from '../helper';
import {
    formatDeviceParameterDataResult
} from '../utils/ApiResponse';

const headers = {
    'Content-Type': 'application/json',
};

/**
 * @method getParametersAPI
 * @description get parameters of assets by deviceId
 */
export function getDeviceParametersAPI(deviceId, callback) {
    return (dispatch) => {
        const request = axios.get(`${API.getDeviceParametersApi}deviceId=${deviceId}`, { headers });
        request.then((response) => {
            const getformatedDeviceParameterData = formatDeviceParameterDataResult(response.data);
            console.log('getDeviceParametersApi Response ', getformatedDeviceParameterData);
            callback(response, getformatedDeviceParameterData);
        }).catch((error) => {
            dispatch({ type: DEVICES_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
 * @method getAssetParameterSuccess
 * @description return object containing action type
 */
export function getAssetParameterSuccess(data) {
    return {
        type: ASSET_PARAMETER_SUCCESS,
        payload: data,
    };
}

/**
 * @method turnLightsOnAPI
 * @description get turn light on 
 * to assests
 */

export function turnLightsOnAPI(lightControlData, lightOffTimeData, callback) {
    console.log('turnLightsOnAPI parameterts', lightControlData, lightOffTimeData);
    return (dispatch) => {
        dispatch({ type: DEVICES_API_REQUEST });
        const getLightControlRequest = axios.post(`${API.getLightControlRequestAPI}`, lightControlData, { headers });
        const getLightOffTimeRequest = axios.post(`${API.getLightControlRequestAPI}`, lightOffTimeData, { headers });
        Promise.all([getLightControlRequest, getLightOffTimeRequest]).then((responses) => {
            console.log('turnLightsOnAPI Promise', responses);
            dispatch({
                type: GET_ASSETS_LIGHT_ON_SUCCESS,
                payload: responses
            });
            callback(responses);
        }).catch((error) => {
            dispatch({ type: DEVICES_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
 * @method turnLightsOffOrResetAPI
 * @description get turn lights off and reset
 */

export function turnLightsOffOrResetAPI(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: DEVICES_API_REQUEST });
        axios.post(`${API.getLightControlRequestAPI}`, requestData, { headers })
            .then((response) => {
                console.log('turnLightsOffOrResetAPI', response);
             //   dispatch(getTurnLightOffOrResetSuccess(response));
                callback(response);
            }).catch((error) => {
                console.log('turnLightsOffOrResetAPI error', error);
                dispatch({ type: DEVICES_API_FAILURE });
                apiErrors(error);
            });
    };
}

/**
 * @method getTurnLightOffOrResetSuccess
 * @description return object containing action type
 */
export function getTurnLightOffOrResetSuccess(data) {
    return {
        type: GET_ASSET_LIGHT_OFF_OR_RESET_SUCCESS,
    };
}

/*
 * @method deviceButtonOnOffEvent
 * @description On and off a device
 * to devices
 */

export function deviceLoader(deviceId, loaderValue) {
    return (dispatch) => {
        dispatch({
            type: DEVICE_LOADER_EVENT,
            payload: { deviceId, loaderValue }
        });
    };
}

/*
 * @method deviceModelPopup
 * @description On and off a device
 * model popup
 */

export function deviceModelPopup(deviceId, lightOnOffPopupValue) {
    return (dispatch) => {
        dispatch({
            type: DEVICE_MODEL_POPUP_EVENT,
            payload: { deviceId, lightOnOffPopupValue}
        });
    };
}

/*
 * @method devicesStatus
 * @description to get the device status
 */

export function devicesStatus(devicesStatus) {
    console.log('ACTION devicesStatus',devicesStatus);
    return (dispatch) => {
        dispatch({
            type: DEVICE_STATUS_EVENT,
            payload: devicesStatus
        });
    };
}
