import {
  StackNavigator
} from 'react-navigation';
import { ProfileComponent } from './components/account/profile.component';
import { UserFormComponent } from './components/account/userForm.component';

export default createProfileNavigation = () =>  {
  const nav = StackNavigator({
    Profile: {
      screen: ProfileComponent,
      navigationOptions: {
        title: 'Profil'
      }
    },
    EditProfile: {
      screen: UserFormComponent,
      navigationOptions: {
        title: 'Editace Profilu'
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
      initialRouteName: ProfileNavigation
    }
  )
}