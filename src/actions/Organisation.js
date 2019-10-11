import axios from 'axios';
import { AsyncStorage } from 'react-native';
import {
    ORGANISATION_API_REQUEST, ORGANISATION_API_FAILURE,
    GET_ALL_ORGANISATION_DATA_SUCCESS, UPDATE_ORGANISATION_SUCCESS,
    ORGANISATION_API_SUCCESS, USER_ORGANISATION_IMAGE_SUCCESS,
    GET_ORGANISATION_MEMBER_SUCCESS, INVITE_ORGANISATION_MEMBER_SUCCESS,
    UPDATE_ORGANISATION_MEMBER_ROLE_SUCCESS, GET_ORGANISATION_ROLES_SUCCESS,
    GET_ORGANISATION_MEMBER_COUNT_SUCCESS,
    GET_ORGANISATION_DETAIL_SUCCESS,
    FETCH_USER_DATA
} from '../constants';
import { API, MESSAGES } from '../config';
import { apiErrors, Toast } from '../helper';
import { formatGetallOrganisationDataResult } from '../utils/ApiResponse';


const headers = {
    'Content-Type': 'application/json',
};

/**
* @method getAllOrganisationDetailsAPI
* @description used to get all organisation data
*/

export function getAllOrganisationDetailsAPI() {
    return (dispatch) => {
        dispatch({ type: ORGANISATION_API_REQUEST });
        const request = axios.get(`${API.getAllOrganisationDetailAPI}?includeInactive=true`, { headers });
        request.then((response) => {
            if (response.status === 200) {
                const allOrganisationFormatedData = formatGetallOrganisationDataResult(response.data);
                dispatch({
                    type: GET_ALL_ORGANISATION_DATA_SUCCESS,
                    payload: allOrganisationFormatedData,
                });
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
            }
        }).catch((error) => {
            apiErrors(error);
            dispatch({ type: ORGANISATION_API_FAILURE });
        });
    };
}

/**
* @method getOrganisationAPI
* @description Used to get organisation details
*/

export function getOrganisationAPI(organisationId) {
    return (dispatch) => {
        dispatch({ type: ORGANISATION_API_REQUEST });
        const getOrganisationDetailRequest = axios.get(`${API.getOrganisationDetailApi}/${organisationId}`, { headers });
        const getOrganisationMembersRequest = axios.get(`${API.getOrganisationMembersApi}?organisationId=${organisationId}`, { headers });
        const getOrganisationRolesRequest = axios.get(`${API.getOrganisationRoles}?organisationId=${organisationId}`, { headers });
        Promise.all([getOrganisationDetailRequest, getOrganisationMembersRequest, getOrganisationRolesRequest]).then((responses) => {
            if (responses[0].status === 200) {
                dispatch({
                    type: ORGANISATION_API_SUCCESS,
                    payload: responses[0].data,
                });
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                dispatch({ type: ORGANISATION_API_FAILURE });
            }

            if (responses[1].status === 200) {
                dispatch({
                    type: GET_ORGANISATION_MEMBER_COUNT_SUCCESS,
                    payload: responses[1].data,
                });
                dispatch({
                    type: GET_ORGANISATION_MEMBER_SUCCESS,
                    payload: responses[1].data,
                });
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                dispatch({ type: ORGANISATION_API_FAILURE });
            }
            if (responses[2].status === 200) {
                dispatch({
                    type: GET_ORGANISATION_ROLES_SUCCESS,
                    payload: responses[2].data,
                });
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                dispatch({ type: ORGANISATION_API_FAILURE });
            }

        }).catch((error) => {
            dispatch({ type: ORGANISATION_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
* @method updateOrganisationAPI
* @description used to update organisation detail
*/

export function updateOrganisationAPI(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: ORGANISATION_API_REQUEST });
        const updateOrganisationRequest = axios.put((API.updateOrganisation) + requestData.organisationId, requestData.organisationData, { headers });
        const updateOrganisationAddressRequest = axios.put(`${API.updateOrganisationLocation}/${requestData.locationId}`, requestData.locationData, { headers });
        Promise.all([updateOrganisationRequest, updateOrganisationAddressRequest]).then((response) => {
            console.log("updateOrganisationAPI success", response);
            dispatch({ type: UPDATE_ORGANISATION_SUCCESS });
            callback(response);
        }).catch((error) => {
            console.log("updateOrganisationAPI success", error);
            dispatch({ type: ORGANISATION_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
* @method uploadUserOrganisationImageAPI
* @description used to upload organisation image
*/

export function uploadUserOrganisationImageAPI(requestData, organisationId, callback) {
    return (dispatch) => {
        dispatch({ type: ORGANISATION_API_REQUEST });
        let formData = new FormData();
        formData.append('image', requestData);
        const multipartHeaders = {
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        };
        axios.post(`${API.postOrganisationImage}${organisationId}/image`, formData, { multipartHeaders })
            .then((response) => {
                dispatch({ type: USER_ORGANISATION_IMAGE_SUCCESS });
                callback(response);
            })
            .catch((error) => {
                dispatch({ type: ORGANISATION_API_FAILURE });
                apiErrors(error);
            });
    };
}


/**
* @method getOrganisationMembersAPI
* @description used to get organisation member and organisation roles
*/

export function getOrganisationMembersAPI(organisationId) {
    return (dispatch) => {
        dispatch({ type: ORGANISATION_API_REQUEST });
        const getOrganisationMembersRequest = axios.get(`${API.getOrganisationMembersApi}?organisationId=${organisationId}`, { headers });
        const getOrganisationRolesRequest = axios.get(`${API.getOrganisationRoles}?organisationId=${organisationId}`, { headers });
        Promise.all([getOrganisationMembersRequest, getOrganisationRolesRequest]).then((responses) => {
            if (responses[0].status === 200) {
                dispatch({
                    type: GET_ORGANISATION_MEMBER_SUCCESS,
                    payload: responses[0].data,
                });
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                dispatch({ type: ORGANISATION_API_FAILURE });
            }
            if (responses[1].status === 200) {
                dispatch({
                    type: GET_ORGANISATION_ROLES_SUCCESS,
                    payload: responses[1].data,
                });
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                dispatch({ type: ORGANISATION_API_FAILURE });
            }
        }).catch((error) => {
            dispatch({ type: ORGANISATION_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
* @method inviteOrganisationMemberAPI
* @description used to invite member to organisation
*/

export function inviteOrganisationMemberAPI(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: ORGANISATION_API_REQUEST });
        axios.post(`${API.inviteOrganisationMember}?roleId=${requestData.roleId}&email=${requestData.email}`, requestData, { headers })
            .then((response) => {
                dispatch({ type: INVITE_ORGANISATION_MEMBER_SUCCESS });
                callback(response);
            })
            .catch((error) => {
                dispatch({ type: ORGANISATION_API_FAILURE });
                apiErrors(error);
            });
    };
}

/**
* @method updateOrganizationMemberRoleAPI
* @description used to updated organisation member role
*/

export function updateOrganizationMemberRoleAPI(requestData, userId, callback) {
    return (dispatch) => {
        dispatch({ type: ORGANISATION_API_REQUEST });
        axios.put((API.updateUserProfile) + userId, requestData, { headers })
            .then((response) => {
                console.log("updateOrganizationMemberRoleAPI", response);
                callback(response);
                dispatch({ type: UPDATE_ORGANISATION_MEMBER_ROLE_SUCCESS });
            }).catch((error) => {
                console.log("updateOrganizationMemberRoleAPI", error.response);
                dispatch({ type: ORGANISATION_API_FAILURE });
                apiErrors(error);
            });
    };
}

/**
* @method getOrganisationDetailAPI
* @description used to get organisation detail 
*/


export function getOrganisationDetailAPI(organisationId) {
    return (dispatch) => {
        dispatch({ type: ORGANISATION_API_REQUEST });
        const request = axios.get(`${API.getOrganisationDetailApi}/${organisationId}`, { headers });
        request.then((response) => {
            if (response.status == 200) {
                updateAsyncStorage(dispatch, organisationId, response.data, () => {
                    dispatch({ type: GET_ORGANISATION_DETAIL_SUCCESS });
                });
            } else {
                dispatch({ type: ORGANISATION_API_FAILURE });
            }
        }).catch((error) => {
            dispatch({ type: ORGANISATION_API_FAILURE });
            apiErrors(error);
        });
    };
}

/**
* @method updateAsyncStorage
* @description used to update local storgae value
*/

function updateAsyncStorage(dispatch, organisationId, newData, callback) {
    AsyncStorage.multiGet(['LOGGEDUSER', 'CURRENTROLES'])
        .then((value) => {
            let loggedUser = JSON.parse(value[0][1]);
            let curentRoles = JSON.parse(value[1][1]);
            loggedUser.roles.forEach((el) => {
                if (el.organisation._id == organisationId) {
                    el.organisation.name = newData.name;
                    el.organisation.imageId = newData.imageId;
                }
            });
            if (value !== null) {
                if (curentRoles.organisation._id == organisationId) {
                    curentRoles.organisation.name = newData.name;
                    curentRoles.organisation.imageId = newData.imageId;
                }
                const userDataValue = { loggedUser: loggedUser, curentRoles: curentRoles };
                AsyncStorage.setItem('LOGGEDUSER', JSON.stringify(loggedUser))
                    .then(() => {
                        dispatch({
                            type: ORGANISATION_API_SUCCESS,
                            payload: newData,
                        });

                        dispatch({
                            type: FETCH_USER_DATA,
                            payload: userDataValue
                        });
                        callback();
                    });
            }
        });
}
