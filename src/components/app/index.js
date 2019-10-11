import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import DrawerComponent from './drawer';
import ChangePassword from './account-settings/ChangePassword';
import UpdateProfile from './account-settings/UpdateProfile';
import AssetLists from '../app/assets/index';

const MyStackNavigator = createStackNavigator({
    Home: {
        screen: AssetLists,
    },   
    UpdateProfile: {
        screen: UpdateProfile
    },
    ChangePassword: {
        screen: ChangePassword
    },  
}, {
        headerMode: 'none'
    }
);


const MyDrawerNavigator = createDrawerNavigator({
    MainStack: {
        screen: MyStackNavigator,
    },
}, {
        contentComponent: DrawerComponent, /** This is our custom drawer component */
    });

const AppStack = createAppContainer(MyDrawerNavigator);

export default AppStack;
