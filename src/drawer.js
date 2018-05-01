import {DrawerNavigator} from 'react-navigation';
import ScreenComponent from './components/screen.component';
import MainComponent from './components/main.component';

const DrawerNav = DrawerNavigator(
  {
    First: {
      screen: MainComponent
    },
    Second: {
      screen: ScreenComponent
    }
  },
  {
    initialRouteName: 'First',
    drawerPosition: 'left'
  }
);

export default DrawerNav;