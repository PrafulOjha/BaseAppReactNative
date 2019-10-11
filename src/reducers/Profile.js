import {
    API_REQUEST, API_FAILURE,
    UPDATE_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_SUCCESS,
    MEMBER_SUCCESS,
    MEMBER_FAILURE,
    GET_ASSETS_LIGHT_ON_SUCCESS,
    GET_ASSET_LIGHT_OFF_OR_RESET_SUCCESS,
    USER_PROFILE_IMAGE_SUCCESS
} from '../constants';

const initialState = {
    error: false,
    loading: false,
    masterData: {},
    organisationDetailData: {}
};

export default function profileReducer(state = initialState, action) {
    switch (action.type) {

        case API_REQUEST:
            return {
                ...state,
                loading: true
            };
        case API_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            };
        case UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case MEMBER_SUCCESS:
            return {
                ...state,
                loading: false,
                membersData: action.payload,
                error: '',
            };
        case MEMBER_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
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
        case USER_PROFILE_IMAGE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case GET_USER_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
