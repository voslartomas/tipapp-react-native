import {
  StackNavigator
} from 'react-navigation';
import ProfileComponent from './components/account/profile.component';
import UserFormComponent from './components/account/userForm.component';
import styles from './styles'

export default createProfileNavigation = () =>  {
  const nav = StackNavigator({
    Profile: {
      screen: ProfileComponent,
      navigationOptions: {
        title: 'Profil',
        headerTintColor: 'white',
        headerStyle: styles.headerBar,
        styles: {
          statusBarTextColorScheme: 'dark',
        }
      }
    },
    EditProfile: {
      screen: UserFormComponent,
      navigationOptions: {
        title: 'Editace Profilu',
        headerTintColor: 'white',
        headerStyle: styles.headerBar,
        styles: {
          statusBarTextColorScheme: 'dark',
        }
      }
    }
  });

  return StackNavigator(
    {
      ProfileNavigation: {
        screen: nav
      }
    },
    {
      initialRouteName: 'ProfileNavigation',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
    }
  )
}
