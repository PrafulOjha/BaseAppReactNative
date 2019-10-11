import React from 'react';
import axios from 'axios';
import {
    View, AsyncStorage, ImageBackground, StyleSheet,
    Image, TouchableOpacity, Keyboard, Modal, ScrollView, Platform, PermissionsAndroid
} from 'react-native';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import styles from '../../../assets/styles';
import { ValidationComponent, Toast } from '../../../helper';
import { HeaderComponent, InputBox, Loader, CommonButton, OrganisationImage, Text } from '../../common';
import { loginUserAPI } from '../../../actions/Auth';
import { MESSAGES, BASE_URL } from '../../../config';
import { ImageBox } from '../../common/Image';
import Permissions from 'react-native-permissions';

class Login extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isSubmitted: false,
            modalVisible: false,
            roles: [],
            userObject: {},
            authToken: ''
        };
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            Permissions.request('camera').then(response => {
                if (response == 'authorized') {

                }
            });

            Permissions.request('photo').then(response => {
                if (response == 'authorized') {

                }
            });           
        } else {
            PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ], {
                    title: 'Alert',
                    message: 'We need your permission.',
                },
            ).then((permRes) => {
                if (permRes['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED && permRes['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && permRes['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {

                }
            });
        }
    }

    /**
    * @method checkValidation
    *@description called to check validations
    */
    checkValidation = () => {
        /* Call ValidationComponent validate method */
        this.validate({
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                maxlength: 25,
            }
        });
        this.setState({ error: true });
    }

    /**
    * @method forgetPassword
    * @description Navigate user to the forgetPassword screen
    */
    forgetPassword = () => {
        this.props.navigation.navigate('ForgetPassword');
    }

    /**
    * @method onInputValueChanged
    * @description called when input field value changes
    */
    onInputValueChanged = (key) => (value) => {
        const state = this.state;
        state[key] = value;
        this.setState(state, () => {
            if (this.state.isSubmitted) {
                this.checkValidation();
            }
        });
    };

    /**
    * @method onPressRolesButton
    * @description to select the current role of user and redirect to home page
    */
    onPressRolesButton = (item) => {
        if (typeof item !== 'undefined') {
            AsyncStorage.multiSet([['LOGGEDUSER', JSON.stringify(this.state.userObject)], ['CURRENTROLES', JSON.stringify(item)]], (errors) => {
                this.props.navigation.navigate('AuthLoading');
            });
        }
    }

    /**
    * @method renderRoles
    * @description Used to display multiple roles 
    */
    renderRoles = () => {
        if (this.state.roles.length > 0) {
            const allRoles = this.state.roles.map((val) => {
                return (
                    <View>
                        <TouchableOpacity onPress={() => this.onPressRolesButton(val)}>
                            <View style={[styles.row, innerStyle.roleList]}>
                                <View style={[styles.column, styles.verticalCenterLeft]}><Text style={innerStyle.roleNames}>{val.name}</Text></View>
                                <View style={[styles.column, styles.verticalCenterRight, innerStyle.userImageWidth]}>
                                    <OrganisationImage
                                        imageId={val.organisation.imageId}
                                        source={`${BASE_URL}/organisations/${val.organisation._id}/image/${val.organisation.imageId}`}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            });
            return allRoles;
        }
    }

    /*
    * @method onPressLoginButton
    * @description login takes user the app stack by setting isLoggedIn in AsncStorage
    */
    onPressLoginButton = () => {
        this.props.navigation.navigate('App');
        // Keyboard.dismiss();
        // this.setState({ isSubmitted: true });
        // this.checkValidation();
        // const { email, password } = this.state;
        // const requestData = {
        //     email: email,
        //     password: password,
        // };
        // if (this.isFormValid()) {
        //     this.props.navigation.navigate('App');
            // this.props.loginUserAPI(requestData, (res) => {
            //     const status = res.status;
            //     if (status !== 200) {
            //         if (status === 400) {
            //             Toast.showToast(MESSAGES.INVALID_EMAIL_PASSWORD, 'danger');
            //         } else {
            //             Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
            //         }
            //     } else {
            //         const response = res.data.data;
            //         const userObj = {
            //             roles: response.roles,
            //             _id: response._id,
            //             email: response.email,
            //             phone: response.phone,
            //             firstname: response.firstname,
            //             lastname: response.lastname,
            //             profileImage: response.imageId,
            //             token: res.data.token,

            //         };
            //         const userAuthToken = axios.defaults.headers.common.Authorization;
            //         if (typeof userAuthToken === 'undefined' || userAuthToken === '' || userAuthToken == null) {
            //             axios.defaults.headers.common.Authorization = `Bearer ${userObj.token}`;
            //         }

            //         if (response.isActive === true) {
            //             if (typeof response.roles !== 'undefined' && response.roles.length > 1) {
            //                 /** if there is multiple roles then open the role modal */
            //                 this.setState({ authToken: userObj.token }, () => {
            //                     this.setState({ roles: response.roles, modalVisible: true, userObject: userObj });
            //                 });
            //             } else if (typeof response.roles !== 'undefined' && response.roles.length === 1) {
            //                 const userRole = axios.defaults.headers.common.Role;
            //                 if (typeof userRole === 'undefined' || userRole === '' || userRole == null) {
            //                     axios.defaults.headers.common.Role = response.roles[0]._id;
            //                 }

            //                 /** if there is single roles then navigate to home page */
            //                 AsyncStorage.multiSet([['LOGGEDUSER', JSON.stringify(userObj)], ['CURRENTROLES', JSON.stringify(response.roles[0])]], (errors) => {
            //                     this.props.navigation.navigate('AuthLoading');
            //                 });
            //             } else {
            //                 Toast.showToast(MESSAGES.NOT_ASSIGNED_ROLES, 'danger');
            //             }
            //         } else {
            //             Toast.showToast(MESSAGES.NOT_VERIFIED_USER, 'danger');
            //         }
            //     }
            // });
        //}
    }

    /**
     * @method render
     * @description used to render screen
     */
    render() {
        const { email, password } = this.state;
        return (
            <Container>
                <Loader isLoading={this.props.loading} />
                <ImageBackground source={require('../../../assets/images/login-bg.jpg')} style={innerStyle.pageBg}>
                    <Content>
                        <HeaderComponent
                            title=' '
                            isTransparent='true'
                        />
                        <View style={innerStyle.logoWrapper}>
                            <ImageBox
                                source={require('../../../assets/images/Logo-login.png')}
                                width={580}
                                height={316}
                                minWidthFromWindow={60}
                                autoResize={true}
                            />
                        </View>
                        <View style={innerStyle.LoginWrapper}>
                            <View style={innerStyle.LoginWrapperInner}>
                                <InputBox
                                    label='Email Address'
                                    mandatory={true}
                                    isDisabled={false}
                                    maxLength={70}
                                    onChangeText={this.onInputValueChanged('email')}
                                    keyboardType={'email-address'}
                                    iconName='mail'
                                    IconSize={18}
                                    value={email}
                                    isFieldInError={this.isFieldInError('email')}
                                    fieldErrorMessage={this.getErrorsInField('email')}
                                />
                                <InputBox
                                    label='Password'
                                    mandatory={true}
                                    isDisabled={false}
                                    maxLength={26}
                                    keyboardType={'default'}
                                    secureTextEntry={true}
                                    onChangeText={this.onInputValueChanged('password')}
                                    iconName='password'
                                    IconSize={18}
                                    value={password}
                                    isFieldInError={this.isFieldInError('password')}
                                    fieldErrorMessage={this.getErrorsInField('password')}
                                />
                                <TouchableOpacity style={innerStyle.forgotLink} onPress={this.forgetPassword}>
                                    <Text>Forgot Password?</Text>
                                </TouchableOpacity>
                                <View style={[innerStyle.btnRow, innerStyle.btnBox]}>
                                    <CommonButton label="LOGIN" onPress={() => this.onPressLoginButton()} />
                                </View>
                            </View>
                            <View style={innerStyle.copyrightSection}>
                                <View style={innerStyle.copyrightBox}>
                                    <Image source={require('../../../assets/images/aware-logo.png')} style={innerStyle.footerLogo} />
                                    <Text style={innerStyle.copyrightText}>Powered by Ampcontrol</Text>
                                </View>
                            </View>
                        </View>

                        <Modal style={styles.modal} animationType={'fade'} transparent={true} visible={this.state.modalVisible} onRequestClose={() => { }}>
                            <View style={styles.modal}>
                                <View style={[styles.modalInnerBox, innerStyle.modalInnerBox]}>
                                    <View style={[styles.modalHead, innerStyle.modalHead]}>
                                        <Text style={styles.optionLabel}>Choose Role</Text>
                                    </View>
                                    <View style={innerStyle.inputGroup}>
                                        <ScrollView style={innerStyle.scrollBox}>
                                            {this.renderRoles()}
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}

const innerStyle = StyleSheet.create({
    pageBg: {
        flex: 1,
        resizeMode: 'cover'
    },
    logoWrapper: {
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
    },
    LoginWrapper: {
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: 'transparent',
    },
    LoginWrapperInner: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 10,
        position: 'relative',
        zIndex: 9,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    btnRow: {
        margin: 20,
        marginBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        position: 'relative',
        zIndex: 99,
        paddingBottom: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 2,
        width: '100%'
    },
    copyrightSection: {
        padding: 20,
        width: '100%',
        paddingBottom: 10

    },
    forgotLink: {
        width: 'auto',
        paddingTop: 0,
        textAlign: 'center',
        fontFamily: fontRegular,
        color: '#86929F',
        fontSize: 14,
        paddingBottom: 2,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderBottomColor: '#86929F',
        borderStyle: 'solid',
        borderBottomWidth: 1
    },
    footerLogo: {
        width: 50,
        height: 20
    },
    copyrightBox: {
        alignItems: 'center',
        paddingBottom: 20
    },
    copyrightText: {
        fontSize: 10,
        color: 'rgba(255, 255, 255,0.6)',
        marginTop: 5,
        fontFamily: fontRegular
    },
    btnBox: {
        marginLeft: 0, paddingLeft: 0, paddingRight: 0
    },
    roleList: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomColor: '#E8E9ED',
        borderStyle: 'solid', 
        borderBottomWidth: 1
    },
    modalHead: {
        paddingBottom: 0,
        backgroundColor: '#E8E9ED'        
    },
    roleNames: {
        color: '#040605',
        fontSize: 16,
        fontFamily: fontSemiBold
    },
    userImageWidth: {
        maxWidth: 60,
        paddingLeft: 10
    },
    modalInnerBox: {
        height: 310,
        backgroundColor: '#E8E9ED'
    },
    scrollBox: { height: Platform.OS === 'ios' ? 245 : 235, position: 'relative', zIndex: 999 },
    inputGroup:{
        paddingTop: 20
    }
});

/**
* @method mapStateToProps
* @description return state to component as props
* @param {*} state
*/
function mapStateToProps({ auth }) {
    const { email, error, loading, } = auth;
    return { email, error, loading };
}

/**
* @method connect
* @description connect with redux
* @param {function} mapStateToProps
*/
export default connect(mapStateToProps, { loginUserAPI })(Login);

