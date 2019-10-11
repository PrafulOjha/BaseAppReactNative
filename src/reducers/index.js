import { combineReducers } from 'redux';
import auth from './Auth';
import profile from './Profile';
import siteDetail from './Sites';
import Organisation from './Organisation';
import devices from './Devices';

/** Combine all the reducers and export */
const rootReducer = combineReducers({
    auth,
    profile,
    siteDetail,
    Organisation,
    devices
});

export default rootReducer;
