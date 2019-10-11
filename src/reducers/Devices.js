import {
    DEVICES_API_REQUEST, DEVICES_API_FAILURE,
    GET_ASSETS_LIGHT_ON_SUCCESS,
    GET_ASSET_LIGHT_OFF_OR_RESET_SUCCESS,
    ASSET_PARAMETER_SUCCESS
} from '../constants';

const initialState = {
    error: false,
    loading: false,
};

export default function deviceReducer(state = initialState, action) {
    switch (action.type) {
        case DEVICES_API_REQUEST:
            return {
                ...state,
                loading: true
            };
        case DEVICES_API_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            };
        case ASSET_PARAMETER_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case GET_ASSETS_LIGHT_ON_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case GET_ASSET_LIGHT_OFF_OR_RESET_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
