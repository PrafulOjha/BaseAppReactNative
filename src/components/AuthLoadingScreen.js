import React, { PureComponent } from 'react';
import axios from 'axios';
import {
    AsyncStorage,
    StatusBar,
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { updateUserData } from '../actions/Common';
import { Loader } from '../components/common';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = '100%';

class AuthLoadingScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.bootstrapAsync();
    }

    componentDidMount() {
        this.props.updateUserData();
    }

    /**
     * @method bootstrapAsync
     * @description Fetch the token from storage then navigate to our appropriate place
     */
    bootstrapAsync = async () => {
        const loggedUser = await AsyncStorage.getItem('LOGGEDUSER');
        const userData = JSON.parse(loggedUser);
        if (userData != null) {
            const userAuthToken = axios.defaults.headers.common.Authorization;
            if (typeof userAuthToken === 'undefined' || userAuthToken === '' || userAuthToken == null) {
                axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
            }
        }

        const loggedUserRole = await AsyncStorage.getItem('CURRENTROLES');
        const userRoleData = JSON.parse(loggedUserRole);
        if (userRoleData != null) {
            const userRole = axios.defaults.headers.common.Role;
            if (typeof userRole === 'undefined' || userRole === '' || userRole == null) {
                axios.defaults.headers.common.Role = userRoleData._id;
            }
        }

        this.props.navigation.navigate(loggedUser ? 'App' : 'Auth');
    };

    /**
     * @method render
     * @description Render any loading content or splash screen that you like here
     */
    render() {
        return (
            <View>
                <Loader isLoading={true} />
                <View style={[innerStyles.container, innerStyles.horizontal]}>
                    <StatusBar barStyle='default' />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return { state };
}

export default connect(mapStateToProps, { updateUserData })(AuthLoadingScreen);

const innerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        width: deviceWidth,
        backgroundColor: 'rgba(0,0,0,.8)',
        height: deviceHeight,
    },
    whiteColor: {
        color: '#FFF'
    }
});
