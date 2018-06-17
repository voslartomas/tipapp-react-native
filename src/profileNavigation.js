import {
  StackNavigator
} from 'react-navigation';
import ProfileComponent from './components/account/profile.component';
import UserFormComponent from './components/account/userForm.component';
import styles from './styles'
import PasswordComponent from './components/account/password.component';

export default createProfileNavigation = () =>  {
  const nav = StackNavigator({
    Profile: {
      screen: ProfileComponent,
      navigationOptions: {
        headerTintColor: 'white',
        header: false,
        styles: {
          statusBarTextColorScheme: 'light',
        }
      }
    },
    EditProfile: {
      screen: UserFormComponent,
      navigationOptions: {
        headerTintColor: 'white',
        styles: {
          statusBarTextColorScheme: 'light',
        }
      }
    },
    ChangePassword: {
      screen: PasswordComponent,
      navigationOptions: {
        headerTintColor: 'white',
        styles: {
          statusBarTextColorScheme: 'light',
        }
      }
    }
  }, {
    headerMode: 'none'
  });

  return nav
}
