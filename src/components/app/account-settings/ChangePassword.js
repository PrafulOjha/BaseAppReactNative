import React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import { HeaderComponent, InputBox, Loader, CommonButton } from '../../common';
import styles from '../../../assets/styles';
import { ValidationComponent, Toast } from '../../../helper';
import { updatePasswordAPI } from '../../../actions/Auth';
import { MESSAGES } from '../../../config';

class ChangePasssword extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            isSubmitted: false,
            loading: false
        };
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
    }

    /**
    * @method checkValidation
    * @description called to check validations
    */
    checkValidation = () => {
        /* Call ValidationComponent validate method */
        this.validate({
            oldPassword: {
                required: true,
                password: true,
            },
            newPassword: {
                required: true,
                password: true,
            },
            confirmPassword: {
                required: true,
                matchPassword: this.state.newPassword
            }

        });
        this.setState({ error: true });
    }


    /**
        * @method onPressUpdateButton
        * @description updates user's password
        */
    onPressUpdateButton = () => {
        Keyboard.dismiss();
        const { oldPassword, newPassword, confirmPassword } = this.state;
        this.setState({ isSubmitted: true });
        this.checkValidation();
        const requestData = {
            oldpassword: oldPassword,
            newpassword: newPassword,
            confirm: confirmPassword,
        };
        if (this.isFormValid()) {
            this.props.updatePasswordAPI(requestData, this.props.userData.loggedUser._id, (res) => {
                if (res.status == 200) {
                    Toast.showToast(MESSAGES.UPDATE_PASSWORD_SUCCESS, 'success');
                    this.setState({
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    }, () => {
                        this.props.navigation.navigate('Home');
                    });
                } else if (res.status == 400) {
                    Toast.showToast(MESSAGES.OLD_PASSWORD_ERROR, 'danger');
                } else {
                    Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                }
            });
        }
    }

    render() {
        const { oldPassword, newPassword, confirmPassword } = this.state;
        return (
            <Container>
                <Loader isLoading={this.props.loading} />
                <HeaderComponent
                    title='Change Password'
                    leftButton='customBack'
                    routeName='UpdateProfile'
                />
                <Content style={styles.bgWhite}>
                    <View style={[styles.flexOne, innerStyle.mainPWwrap]}>
                        <InputBox
                            label="Old Password"
                            mandatory={true}
                            isDisabled={false}
                            maxLength={26}
                            placeholder=''
                            secureTextEntry={true}
                            onChangeText={this.onInputValueChanged('oldPassword')}
                            iconName="password"
                            IconSize={18}
                            value={oldPassword}
                            isFieldInError={this.isFieldInError('oldPassword')}
                            fieldErrorMessage={this.getErrorsInField('oldPassword')}
                        />
                        <InputBox
                            label="New Password"
                            mandatory={true}
                            isDisabled={false}
                            maxLength={26}
                            placeholder=''
                            secureTextEntry={true}
                            onChangeText={this.onInputValueChanged('newPassword')}
                            iconName="password"
                            IconSize={18}
                            value={newPassword}
                            isFieldInError={this.isFieldInError('newPassword')}
                            fieldErrorMessage={this.getErrorsInField('newPassword')}
                        />
                        <InputBox
                            label="Confirm Password"
                            mandatory={true}
                            isDisabled={false}
                            maxLength={26}
                            placeholder=''
                            secureTextEntry={true}
                            onChangeText={this.onInputValueChanged('confirmPassword')}
                            iconName="password"
                            IconSize={18}
                            value={confirmPassword}
                            isFieldInError={this.isFieldInError('confirmPassword')}
                            fieldErrorMessage={this.getErrorsInField('confirmPassword')}
                        /> 
                        <View style={[styles.gridRows, marginTop.Twenty, paddingLeft.Ten, paddingRight.Ten, styles.verticalCenter]}>
                            <CommonButton label="SAVE" dynamicBtnStyle={innerStyle.btnWidth} onPress={this.onPressUpdateButton} />
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const innerStyle = StyleSheet.create({
    mainPWwrap: {
        paddingTop: 30,
        paddingLeft: 15,
        paddingRight: 15
    },
    btnWidth: {
        width: '100%',
        minWidth: '100%'
    }
});

/*** @method mapStateToProps
    * @description return state to component as props
    * @param {*} state
    */
function mapStateToProps({ auth }) {
    const { error, loading, userData } = auth;
    return { error, loading, userData };
}

/**
   * @method connect
   * @description connect with redux
   * @param {function} mapStateToProps
   * @param {function} mapDispatchToProps                    
   */
export default connect(
    mapStateToProps, { updatePasswordAPI }
)(ChangePasssword);

