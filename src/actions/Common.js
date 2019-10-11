import { AsyncStorage } from 'react-native';
import {
    FETCH_USER_DATA, UPDATE_FORM_DATA
} from '../constants';


/**
 * @method updateUserData
 * @description update data in store on app landing
 */

export function updateUserData() {
    return (dispatch) => {
        dispatch({ type: 'Nothing' });
        AsyncStorage.multiGet(['LOGGEDUSER', 'CURRENTROLES'])
            .then((value) => {
                if (value !== null) {
                    const userDataValue = { loggedUser: JSON.parse(value[0][1]), curentRoles: JSON.parse(value[1][1]) };
                    dispatch({
                        type: FETCH_USER_DATA,
                        payload: userDataValue
                    });
                }
            });
    };
}

/**
 * @method updateFormData
 * @description update user data in props
 */

export function updateFormData(formData, obj) {
    formData = { ...formData, ...obj };
    return (dispatch) => {
        dispatch({ type: UPDATE_FORM_DATA, payload: formData });
    };
}

