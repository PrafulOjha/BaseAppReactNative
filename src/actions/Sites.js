import axios from 'axios';
import Moment from 'moment';
import {
    SITE_API_REQUEST, SITE_API_FAILURE, GET_SITE_DATA_SUCCESS,
    GET_SITE_DEVICES_SUCCESS, GET_SINGLE_DEVICE_SUCCESS,
    OPEN_CLOSE_SITE_SUCCESS, SET_SITE_OFF_TIME_SUCCESS,
    OPEN_CLOSE_DEVICE_SUCCESS, DEVICE_ON_OFF_EVENT,
    UPDATE_DEVICE_STATUS
} from '../constants';
import { API, MESSAGES } from '../config';
import { apiErrors, Toast } from '../helper';
import {
    formatGetSiteDataResult,
    formatGetSingleDevicesDataResult,
    getDeviceDataListWithParameters,
    formatGetDevicesDataResult,
    formatDeviceParameterDataResult
} from '../utils/ApiResponse';

const headers = {
    'Content-Type': 'application/json',
};

/*
 * @method getDevicesBySiteIdAPI
 * @description get devices by site id and also get filter the privilages
 * to devices
 */

export function getDevicesBySiteIdAPI(requestData, cb) {
    return (dispatch) => {
        dispatch({ type: SITE_API_REQUEST });
        const getAllDeviceRequest = axios.get(`${API.getAllDeviceBySiteId}?siteId=${requestData.siteId}&roleId=${requestData.roleId}`, { headers });
        const getParameterOfDevicesBySiteId = axios.get(`${API.getAllParametersOfDeviceBySiteId}?siteId=${requestData.siteId}`, { headers });
        Promise.all([getAllDeviceRequest, getParameterOfDevicesBySiteId]).then((responses) => {
            const allParametersOfDevices = responses[1].data;
            const privilegedDeviceDataList = formatGetDevicesDataResult(responses[0].data);
            const deviceDataListWithParameters = getDeviceDataListWithParameters(allParametersOfDevices, privilegedDeviceDataList);
            dispatch({
                type: GET_SITE_DEVICES_SUCCESS,
                payload: deviceDataListWithParameters
            });
            cb(responses);
        }).catch((error) => {
            dispatch({ type: SITE_API_FAILURE });
            apiErrors(error);
            cb(error);
        });
    };
}

/*
 * @method deviceButtonOnOffEvent
 * @description On and off a device
 * to devices
 */

export function deviceButtonOnOffEvent(deviceId) {
    return (dispatch) => {
        dispatch({
            type: DEVICE_ON_OFF_EVENT,
            payload: deviceId
        });
    };
}

/*
 * @method updateDeviceParameterStatus
 * @description Update device paramter status via socket programming
 * to devices
 */

export function updateDeviceParameterStatus(socketData) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_DEVICE_STATUS,
            payload: socketData
        });
    };
}


/**
 * @method getSiteDetailAndDevicesAPI
 * @description get asset by site id and also get filter the privilages
 * to assests
 */

export function getSiteDetailAndDevicesAPI(requestData) {
    return (dispatch) => {
        dispatch({ type: SITE_API_REQUEST });
        const getAllDeviceRequest = axios.get(`${API.getAllDeviceBySiteId}?siteId=${requestData.siteId}&roleId=${requestData.roleId}`, { headers });
        const getSiteDetailsRequest = axios.get(`${API.getSiteDetailAPI}/${requestData.siteId}`, { headers });
        const getParameterOfDevicesBySiteId = axios.get(`${API.getAllParametersOfDeviceBySiteId}?siteId=${requestData.siteId}`, { headers });
        Promise.all([getAllDeviceRequest, getSiteDetailsRequest, getParameterOfDevicesBySiteId]).then((responses) => {
            const siteFormatedData = formatGetSiteDataResult(responses[1].data);
            dispatch({
                type: GET_SITE_DATA_SUCCESS,
                payload: siteFormatedData,
            });
            const allParametersOfDevices = responses[2].data;
            const privilegedDeviceDataList = formatGetDevicesDataResult(responses[0].data);
            const deviceDataListWithParameters = getDeviceDataListWithParameters(allParametersOfDevices, privilegedDeviceDataList);
            dispatch({
                type: GET_SITE_DEVICES_SUCCESS,
                payload: deviceDataListWithParameters
            });
        }).catch((error) => {
            dispatch({ type: SITE_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
 * @method getSingleDeviceDetailAPI
 * @description get Single Asset data
 */
export function getSingleDeviceDetailAPI(deviceId) {
    return (dispatch) => {
        dispatch({ type: SITE_API_REQUEST });
        const request = axios.get(`${API.getSingleDevice}/${deviceId}`, { headers });
        request.then((response) => {
            if (response.status === 200) {
                const deviceFormatedDate = formatGetSingleDevicesDataResult(response.data);
                dispatch({
                    type: GET_SINGLE_DEVICE_SUCCESS,
                    payload: deviceFormatedDate,
                });
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
            }
        }).catch((error) => {
            dispatch({ type: SITE_API_FAILURE });
            apiErrors(error);
        });
    };
}


/**
 * @method openCloseSiteBySiteId
 * @description used to open and close site
 */
export function openCloseSiteBySiteIdAPI(requestData, siteId, callback) {
    return (dispatch) => {
        dispatch({ type: SITE_API_REQUEST });
        const updateSiteRequest = axios.put(`${API.updateSiteStatus}/${siteId}`, requestData, { headers });
        updateSiteRequest.then((response) => {
            dispatch({
                type: OPEN_CLOSE_SITE_SUCCESS,
                payload: response,
            });
            callback(response);
        }).catch((error) => {
            dispatch({ type: SITE_API_FAILURE });
            apiErrors(error);
        });
    };
}


/**
 * @method setAutoOffTimeAPI
 * @description used to set auto off time for device
 * TODO Change the api endpoint
 */
export function setAutoOffTimeAPI(requestData) {
    return (dispatch) => {
        dispatch({ type: SITE_API_REQUEST });
        const request = axios.put(`${API.setSiteAutoOffTime}?siteId=${requestData.siteId}`, { headers });
        request.then((response) => {
            dispatch({
                type: SET_SITE_OFF_TIME_SUCCESS,
                payload: response,
            });
        }).catch((error) => {
            dispatch({ type: SITE_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
 * @method openCloseDeviceAPI
 * @description used to open and close device
 */
export function openCloseDeviceAPI(requestData, deviceId, callback) {
    return (dispatch) => {
        dispatch({ type: SITE_API_REQUEST });
        const updateDeviceStatusRequest = axios.put(`${API.updateDeviceStatus}/${deviceId}`, requestData, { headers });
        updateDeviceStatusRequest.then((response) => {
            dispatch({
                type: OPEN_CLOSE_DEVICE_SUCCESS,
                payload: response,
            });
            callback(response);
        }).catch((error) => {
            dispatch({ type: SITE_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
* @method turnLightsOff
* @description Turn off all the active lights.
*/
export function turnLightsOff(requestData, callback) {
    let requestUrl = [];
    /**@description Push the different urls to the array on the basis of different request data */
    requestData.map((data) => {
        const url = axios.post(`${API.getLightControlRequestAPI}`, data, { headers })
        requestUrl.push(url);
    });
    return (dispatch) => {
        Promise.all(requestUrl).then((response) => {
            callback(response);
        }).catch((error) => {
            dispatch({ type: API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
* @method allParametersBySiteId
* @description Get all the device parameters by site id.
*/

export function allParametersBySiteId(siteId, callback) {
    return (dispatch) => {
        const requestAllParameters = axios.get(`${API.getAllParameters}${siteId}`);
        requestAllParameters.then((response) => {
            if (response.status === 200) {
                callback(response);
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
            }
        }).catch((error) => {
            dispatch({ type: SITE_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
 * @method openCloseDeviceAndLightOff
 * @description used to close the device and turn the device off 
 */
export function openCloseDeviceAndLightOff(requestData, deviceId, callback) {
    return (dispatch) => {
        dispatch({ type: SITE_API_REQUEST });
        const request = axios.get(`${API.getDeviceParametersApi}deviceId=${deviceId}`, { headers });
        request.then((response) => {
            if (response.status === 200) {
                const getformatedDeviceParameterData = formatDeviceParameterDataResult(response.data);
                const currentTime = Moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                const currentDateTime = Moment.utc(currentTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                const lightOffData = {
                    parameter: getformatedDeviceParameterData.onParameterId,
                    dateTime: currentDateTime,
                    data: 0
                };
                const updateDeviceStatusRequest = axios.put(`${API.updateDeviceStatus}/${deviceId}`, requestData, { headers });
                const getTurnLightOffRequest = axios.post(`${API.getLightControlRequestAPI}`, lightOffData, { headers });
                Promise.all([updateDeviceStatusRequest, getTurnLightOffRequest]).then((responses) => {
                    dispatch({
                        type: OPEN_CLOSE_DEVICE_SUCCESS,
                        payload: response,
                    });
                    callback(responses);
                }).catch((error) => {
                    dispatch({ type: SITE_API_FAILURE });
                    apiErrors(error);
                });
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
            }
        }).catch((error) => {
            dispatch({ type: SITE_API_FAILURE });
            apiErrors(error);
        });
    };
}
