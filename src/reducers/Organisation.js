import {
    ORGANISATION_API_REQUEST, ORGANISATION_API_FAILURE,
    GET_ALL_ORGANISATION_DATA_SUCCESS, ORGANISATION_API_SUCCESS,
    UPDATE_ORGANISATION_SUCCESS, USER_ORGANISATION_IMAGE_SUCCESS,
    GET_ORGANISATION_MEMBER_SUCCESS, INVITE_ORGANISATION_MEMBER_SUCCESS,
    UPDATE_ORGANISATION_MEMBER_ROLE_SUCCESS, GET_ORGANISATION_ROLES_SUCCESS,
    GET_ORGANISATION_MEMBER_COUNT_SUCCESS, GET_ORGANISATION_DETAIL_SUCCESS
} from '../constants';

const initialState = {
    error: false,
    loading: false,
    allOrganisationData: [],
    organisationDetailData: {},
    organisationMemberCount: 0,
    membersData: [],
    organisationRoles: []
};

export default function organisationDataReducer(state = initialState, action) {
    switch (action.type) {
        case ORGANISATION_API_REQUEST:
            return {
                ...state,
                loading: true
            };
        case ORGANISATION_API_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            };
        case UPDATE_ORGANISATION_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case GET_ALL_ORGANISATION_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                allOrganisationData: action.payload
            };
        case ORGANISATION_API_SUCCESS:
            return {
                ...state,
                loading: false,
                organisationDetailData: action.payload
            };
        case GET_ORGANISATION_MEMBER_COUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                organisationMemberCount: action.payload.length
            };
        case USER_ORGANISATION_IMAGE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case GET_ORGANISATION_MEMBER_SUCCESS:
            return {
                ...state,
                loading: false,
                membersData: action.payload,
            };
        case INVITE_ORGANISATION_MEMBER_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case UPDATE_ORGANISATION_MEMBER_ROLE_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case GET_ORGANISATION_ROLES_SUCCESS:
            return {
                ...state,
                loading: false,
                organisationRoles: action.payload,
            };
        case GET_ORGANISATION_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
