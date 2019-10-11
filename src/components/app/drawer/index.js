import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import { View, AsyncStorage, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { List, ListItem, Container, Content, Card, CardItem, Icon } from 'native-base';
import { connect } from 'react-redux';
import { Text, OrganisationImage, UserImage } from '../../common';
import { CustomIcon } from '../../../utils/CustomIcon';
import { logOutUserAPI } from '../../../actions/Auth';
import {
    BASE_URL,
    AMP_CONTROL_ROLE,
    COUNCIL_ADMIN_ROLE
} from '../../../config';
import { updateUserData } from '../../../actions/Common';
import styles from '../../../assets/styles';

class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            currentRoleId: '',
            currentRollName: '',
            organisationName: '',
            profileImage: '',
            organisationId: '',
            allRoles: [],
            buttonText: 'Show Roles',
            showDrawerItems: false,
            authToken: '',
            userImage: '',
            currentSelectedRoleImage: '',
            currentSelectedRoleImageId: ''
        };
    }

    /**
      * @method componentDidMount
      * @description called after mounting component
      */
    componentDidMount() {
        this.props.updateUserData();
        AsyncStorage.getItem('CURRENTROLES')
            .then((value) => {
                if (value != null) {
                    const currentRoles = JSON.parse(value);
                    const roleId = currentRoles._id;
                }
            });
    }

    /**
     * @method componentWillReceiveProps
     * @description to received the userdata
     */
    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps drawer", nextProps.userData.curentRoles);
        if (this.props.userData !== nextProps.userData && nextProps.userData && nextProps.userData.loggedUser) {
            const state = this.state;
            state.firstName = nextProps.userData.loggedUser.firstname;
            state.lastName = nextProps.userData.loggedUser.lastname;
            state.currentRoleId = nextProps.userData.curentRoles._id;
            state.currentRollName = nextProps.userData.curentRoles.displayName;
            state.organisationName = nextProps.userData.curentRoles.organisation.name;
            state.organisationId = nextProps.userData.curentRoles.organisation._id;
            state.allRoles = nextProps.userData.loggedUser.roles;
            if (nextProps.userData.loggedUser.profileImage) {
                state.userImage = `${BASE_URL}/users/${nextProps.userData.loggedUser._id}/image/${nextProps.userData.loggedUser.profileImage}`;
            }
            state.currentSelectedRoleImage = `${BASE_URL}/organisations/${nextProps.userData.curentRoles.organisation._id}/image/${nextProps.userData.curentRoles.organisation.imageId}`;
            state.currentSelectedRoleImageId = nextProps.userData.curentRoles.organisation.imageId;
            this.setState(state);
        }
    }

    /*
    * @method onLogout
    * @description Clear AsyncStorage and navigate user to AuthLoading screen
    */
    onLogout = () => async () => {
        //AsyncStorage.clear();
        await AsyncStorage.removeItem('LOGGEDUSER');
        await AsyncStorage.removeItem('CURRENTROLES');
        this.props.navigation.navigate('AuthLoading');
        this.props.navigation.closeDrawer();
        this.props.logOutUserAPI((res) => {
            console.log("User logout");
        }
        );
    }

    /*
    * @method onPressShowHideRoles
    * @description to hide and show rolles
    */
    onPressShowHideRoles = () => {
        if (this.state.showDrawerItems) {
            this.setState({
                buttonText: 'Show Roles',
                showDrawerItems: false,
            });
        } else {
            this.setState({
                buttonText: 'Hide Roles',
                showDrawerItems: true
            });
        }
    }

    /**
    * @method onChangeRole
    * @description change the current role of the user
    */
    onChangeRole = (currentRoles) => {
        if (typeof currentRoles !== 'undefined') {
            AsyncStorage.setItem('CURRENTROLES', JSON.stringify(currentRoles))
                .then(() => {
                    const requestData = {
                        siteId: '5c3e67f4184deb36d47bc32e', /**  5c3e67f4184deb36d47bc32e for the city of newcastle*/
                        roleId: currentRoles._id,
                        organisationId: currentRoles.organisation._id
                    };
                    this.resetToHome();
                    /**
                     * Getting the updated user data in AsyncStorage 
                     */
                    this.props.updateUserData();
                    this.setState({ showDrawerItems: false });
                });
        }
    }

    /**
    * @method onClickManageAccount
    * @description for navigation to the manage account screen
    */
    onClickManageAccount = () => {
        this.props.navigation.closeDrawer();
        this.setState({ showDrawerItems: false });
        this.props.navigation.navigate('UpdateProfile');
    }

    /**
    * @method navigate
    * @description for navigation to the next screen
    */
    navigate = (path) => () => {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: path })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    /**
  * @method resetToHome
  * @description Reset navigation to home
  */
    resetToHome = () => {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    /**
    * @method navigateToOrgDetails
    * @description for navigation to the next screen
    */
    navigateToOrgDetails = (organisationId) => {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'OrganisationDetails', params: { organisationId: organisationId } })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    /**
    * @method renderUserProfileImage
    * @description Used to render the user profile image
    */

    renderUserProfileImage = () => {
        return (
            <View>
                {
                    this.state.userImage === '' ?
                        <View style={innerStyle.profileBox}>
                            <CustomIcon name="user" style={innerStyle.boxIcon} />
                        </View>
                        :
                        <UserImage style={innerStyle.userProfileImg} source={this.state.userImage} />
                }
            </View>
        );
    }

    /**
    /**
     * @method render
     * @description render component
     */
    render() {
        const { firstName, lastName, organisationName, currentRollName, currentSelectedRoleImage, currentSelectedRoleImageId, organisationId } = this.state;
        return (
            <Container>
                <Content>
                    <View style={{ margin: 0 }}>
                        <Card style={[innerStyle.mainCard, paddingTop.Twenty]}>
                            <CardItem style={[innerStyle.profileInfo]}>
                                <View style={[innerStyle.mainUserProfile]}>
                                    <View style={[innerStyle.mainUserImage, paddingLeft.Ten, styles.w100]}>
                                        <View style={[styles.row, styles.w100]}>
                                            <View style={[styles.column, styles.verticalCenter, innerStyle.userProfileWrap]}>
                                                {this.renderUserProfileImage()}
                                            </View>
                                            <View style={[styles.column, innerStyle.userProfileDetails]}>
                                                <View><Text style={innerStyle.userName}>{`${firstName} ${lastName}`}</Text></View>
                                                <View><Text style={innerStyle.userRole}>{currentRollName}</Text></View>
                                                <View><Text style={innerStyle.userRole}>{organisationName}</Text></View>
                                            </View>
                                            <View style={[styles.column, innerStyle.dropArrow, styles.verticalCenter]}>
                                                <TouchableOpacity style={innerStyle.showTextWrap} onPress={this.onPressShowHideRoles} >
                                                    {this.state.showDrawerItems === false && (
                                                        <Icon name='md-arrow-dropdown' style={innerStyle.arrowText} />
                                                    )}
                                                    {this.state.showDrawerItems === true && (
                                                        <Icon name='md-arrow-dropup' style={innerStyle.arrowText} />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </CardItem>
                        </Card>
                    </View>
                    {(this.state.showDrawerItems) ?
                        <List>
                            <ListItem noBorder style={[innerStyle.listItemMenu, paddingTop.Ten]} onPress={this.onClickManageAccount}>
                                <View style={innerStyle.iconWrapper}>
                                    <CustomIcon style={[innerStyle.navIcons, innerStyle.txtBlack]} name="user" /></View>
                                <Text style={innerStyle.navText} >Edit Profile</Text>
                            </ListItem>
                            <ListItem noBorder style={[innerStyle.listItemMenu, paddingTop.Ten]} onPress={this.onLogout()}>
                                <View style={innerStyle.iconWrapper}>
                                    <CustomIcon style={[innerStyle.navIcons, innerStyle.txtBlack]} name="logout" /></View>
                                <Text style={innerStyle.navText} >Log Out</Text>
                            </ListItem>
                        </List>
                        :
                        <List style={paddingTop.Fifteen}>
                            <ListItem noBorder style={[innerStyle.listItemMenu, innerStyle.nationalPark]} onPress={this.navigate('Home')}>
                                <View style={innerStyle.iconWrapper}>
                                    {/* <CustomIcon style={[innerStyle.navIcons, innerStyle.parkIcons]} name="national-park" /> */}
                                    <Image source={require('../../../assets/images/gray-mappin.png')} style={innerStyle.mapPinIcon} />
                                </View>
                                <Text style={innerStyle.navText}>National Park</Text>
                            </ListItem>

                            <ListItem noBorder style={[innerStyle.listItemMenu, innerStyle.listItemDyMenu, paddingTop.Ten]} onPress={() => this.navigateToOrgDetails(organisationId)}>
                                <View style={[innerStyle.iconWrapper, innerStyle.iconorgDyWrapper]}>
                                    <OrganisationImage
                                        imageId={currentSelectedRoleImageId}
                                        source={currentSelectedRoleImage}
                                    />
                                </View>
                                <Text style={innerStyle.navText}>{organisationName}</Text>
                            </ListItem>

                            {(this.state.currentRoleId == AMP_CONTROL_ROLE || this.state.currentRoleId == COUNCIL_ADMIN_ROLE) && (
                                <ListItem noBorder style={[innerStyle.listItemMenu, paddingTop.Ten]} onPress={this.navigate('AllOrganisation')}>
                                    <View style={innerStyle.iconWrapper}>
                                        {/*  <CustomIcon style={[innerStyle.navIcons]} name="organisations" /> */}
                                        <Image source={require('../../../assets/images/landmark.png')} style={innerStyle.landmarkIcon} />
                                    </View>
                                    <Text style={innerStyle.navText}>Organisations</Text>
                                </ListItem>
                            )}
                        </List>
                    }
                </Content>
            </Container>
        );
    }
}

/**
* @method mapStateToProps
* @description return state to component as props
* @param {*} state
        */
const mapStateToProps = ({ auth }) => {
    const { userData } = auth;
    return {
        userData,
    };
};

/**
* @method connect
* @description connect with redux
* @param {function} mapStateToProps
* @param {function} mapDispatchToProps
    */
export default connect(mapStateToProps, { logOutUserAPI, updateUserData })(Drawer);

const innerStyle = StyleSheet.create({
    mainCard: {
        elevation: 0,
        borderWidth: 0,
        backgroundColor: '#6E68B0',
        marginLeft: -5,
        marginRight: -5,
        marginTop: -5,
        paddingBottom: 0,
        marginBottom: 0
    },
    profileInfo: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderTopWidth: 0,
        margin: 0
    },
    userRole: {
        fontSize: 14,
        color: '#C1C1C1'
    },
    iconWrapper: {
        width: 35,
        height: 35,
        borderWidth: 0,
        margin: 0,
        padding: 0,
        backgroundColor: '#EFEFEF',
        borderRadius: 34,
        borderBottomLeftRadius: 34,
        borderBottomRightRadius: 34,
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
        justifyContent: 'center',
        alignItems: 'center'
    },
    navIcons: {
        color: '#A5A5A5',
        fontSize: 18,
        flexDirection: 'column',
        paddingLeft: 1
    },
    navText: {
        color: '#040605',
        flex: 1,
        paddingLeft: 10,
        margin: 0
    },
    mainUserProfile: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
        paddingTop: 0,
        margin: 0,
        paddingRight: 0
    },
    mainUserImage: {
        paddingTop: 0,
        position: 'relative',
        margin: 0
    },
    userName: {
        fontSize: 18,
        color: '#ffffff',
    },
    listItemMenu: {
        borderWidth: 0,
        paddingTop: 3,
        paddingBottom: 3,
        marginLeft: 8,
        minHeight: 50
    },
    lowerListItem: {
        paddingTop: 25,
    },
    navIconsProfile: {
        position: 'absolute',
        left: 0,
        top: 0
    },
    listItemCollapse: {
        position: 'relative'
    },
    w100: {
        width: '100%'
    },
    textLeft: {
        fontSize: 15,
        flexDirection: 'row'
    },
    ptb10: {
        paddingBottom: 10,
        paddingTop: 10
    },
    navMsgIcons: {
        width: 55
    },
    navImg: {
        width: 22,
        height: 22,
        marginLeft: 8
    },
    dropArrow: {
        padding: 0,
        margin: 0,
        paddingTop: 18,
        marginRight: -10,
        width: 50,
        maxWidth: 50
    },
    arrowText: {
        color: '#fff',
        width: 'auto',
        textAlign: 'right'
    },
    showTextWrap: {
        height: 50,
        width: 50,
        paddingLeft: 12,
        paddingTop: 8,
        paddingRight: 15
    },
    hideMenus: {
        backgroundColor: '#EEEEEE',
        marginLeft: -24,
        paddingLeft: 33,
        paddingTop: 8,
        paddingBottom: 3
    },
    parkIcons: {
        fontSize: 28,
        marginLeft: -2,
    },
    listItemDyMenu: {
        marginLeft: 4
    },
    iconorgDyWrapper: {
        marginLeft: 6,
        marginRight: 1
    },
    nationalPark: {
        height: 40,
        minHeight: 40,
    },
    navHomeIcons: {
        fontSize: 25,
        marginLeft: 2
    },
    mapPinIcon: {
        width: 12,
        height: 17
    },
    txtBlack: {
        color: '#040605'
    },
    userProfileImg: {
        width: 70,
        height: 70,
        borderRadius: 34,
        borderBottomLeftRadius: 34,
        borderBottomRightRadius: 34,
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
        overflow: 'hidden',
        borderColor: '#fff',
        borderStyle: 'solid',
        borderWidth: 1
    },
    userProfileWrap: {
        width: 120,
        marginLeft: -15
    },
    userProfileDetails: {
        width: '62%',
        paddingLeft: 10
    },
    boxIcon: {
        fontSize: 30,
        color: '#fff'
    },
    profileBox: {
        width: 70,
        height: 70,
        borderRadius: 34,
        borderBottomLeftRadius: 34,
        borderBottomRightRadius: 34,
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
        borderWidth: 1,
        borderColor: '#C9D2DB',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    landmarkIcon: {
        width: 16,
        height: 16
    }
});
