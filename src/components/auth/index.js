import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './login';
import ForgetPassword from './forget-password';

const MainNavigator = createStackNavigator(
	{
		Login: Login,
		ForgetPassword: ForgetPassword,
	}, {
		headerMode: 'none'
	}
);

const AuthStack = createAppContainer(MainNavigator);
export default AuthStack;

