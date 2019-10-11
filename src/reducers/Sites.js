import {
    SITE_API_REQUEST, SITE_API_FAILURE,
    GET_SITE_DATA_SUCCESS,
    GET_SITE_DEVICES_SUCCESS,
    GET_SINGLE_DEVICE_SUCCESS,
    OPEN_CLOSE_SITE_SUCCESS,
    SET_SITE_OFF_TIME_SUCCESS,
    OPEN_CLOSE_DEVICE_SUCCESS,
    DEVICE_ON_OFF_EVENT,
    UPDATE_DEVICE_STATUS,
    DEVICE_LOADER_EVENT,
    DEVICE_MODEL_POPUP_EVENT,
    DEVICE_STATUS_EVENT
} from '../constants';

const initialState = {
    error: false,
    loading: false,
    masterData: {},
    siteData: {},
    assetsData: [],
    devicesData: [],
    deviceParameters: [],
    SingleAssetsData: [],
    singleDeviceData: [],

};

export default function siteDataReducer(state = initialState, action) {
    switch (action.type) {
        case SITE_API_REQUEST:
            return {
                ...state,
                loading: true
            };
        case SITE_API_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            };
        case GET_SITE_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                siteData: action.payload
            };
        case GET_SITE_DEVICES_SUCCESS:
            return {
                ...state,
                loading: false,
                devicesData: action.payload
            };

        case DEVICE_ON_OFF_EVENT:
            {
                const deviceId = action.payload;
                const oldDeviceData = state.devicesData;
                const deviceIndex = oldDeviceData.findIndex(val => val.deviceId == deviceId);
                const tempLightOnParameterStatus = oldDeviceData[deviceIndex].lightOnParameterStatus;
                tempLightOnParameterStatus.buttonValue = tempLightOnParameterStatus.buttonValue > 0 ? 0 : 1;
                const devicesData = oldDeviceData.map((item) => (
                    item.deviceId === deviceId ? { ...item, lightOnParameterStatus: tempLightOnParameterStatus } : item
                ));
                return {
                    ...state,
                    devicesData: devicesData
                };
            }

        case UPDATE_DEVICE_STATUS:
            {
                const socketStatusData = action.payload;
                const oldDeviceData = state.devicesData;
                const deviceOnParameterIndex = oldDeviceData.findIndex(val => val.lightOnParameterStatus.parameterId === socketStatusData.parameter);
                const deviceOffTimeParameterIndex = oldDeviceData.findIndex(val => val.lightOffTimeParameterStatus.parameterId === socketStatusData.parameter);

                if (deviceOnParameterIndex !== -1) {
                    /** If device on parameter is got changed  */
                    const tempLightOnParameterStatus = oldDeviceData[deviceOnParameterIndex].lightOnParameterStatus;
                    tempLightOnParameterStatus.buttonValue = socketStatusData.value;
                    tempLightOnParameterStatus.value = socketStatusData.value;
                    const devicesData = oldDeviceData.map((item) => (
                        item.lightOnParameterStatus.parameterId === socketStatusData.parameter ? { ...item, lightOnParameterStatus: tempLightOnParameterStatus } : item
                    ));
                    return {
                        ...state,
                        devicesData: devicesData
                    };
                }

                if (deviceOffTimeParameterIndex !== -1) {
                    /** If device off time parameter is got changed  */
                    const tempLightOffTimeParameterStatus = oldDeviceData[deviceOffTimeParameterIndex].lightOffTimeParameterStatus;
                    tempLightOffTimeParameterStatus.value = socketStatusData.value;
                    const devicesData = oldDeviceData.map((item) => (
                        item.lightOffTimeParameterStatus.parameterId === socketStatusData.parameter ? { ...item, lightOffTimeParameterStatus: tempLightOffTimeParameterStatus } : item
                    ));
                    return {
                        ...state,
                        devicesData: devicesData
                    };
                }
            }

        case DEVICE_LOADER_EVENT:
            {
                const deviceId = action.payload.deviceId;
                const oldDeviceData = state.devicesData;
                const devicesData = oldDeviceData.map((item) => (
                    item.deviceId === deviceId ? { ...item, deviceLoader: action.payload.loaderValue } : item
                ));
                return {
                    ...state,
                    devicesData: devicesData
                };
            }
        case DEVICE_MODEL_POPUP_EVENT:
            {
                const deviceId = action.payload.deviceId;
                const oldDeviceData = state.devicesData;
                const devicesData = oldDeviceData.map((item) => (
                    item.deviceId === deviceId ? { ...item, lightOnOffPopupValue: action.payload.lightOnOffPopupValue } : item
                ));
                return {
                    ...state,
                    devicesData: devicesData
                };
            }
            case DEVICE_STATUS_EVENT:
            {   
                console.log('DEVICE_STATUS_EVENT', action.payload);              
                return {
                    ...state,
                    deviceParameters: [...state.deviceParameters, action.payload]
                };
            }
        case GET_SINGLE_DEVICE_SUCCESS:
            return {
                ...state,
                loading: false,
                singleDeviceData: action.payload
            };
        case OPEN_CLOSE_SITE_SUCCESS:
            return {
                ...state,
                //loading: false,
            };
        case SET_SITE_OFF_TIME_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case OPEN_CLOSE_DEVICE_SUCCESS:
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
}
