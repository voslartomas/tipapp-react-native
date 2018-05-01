import React from 'react';
import LoginFormComponent from './components/loginForm.component';
import RegisterFormComponent from './components/registerForm.component';
import SecuredComponent from './components/secured.component';
import {
  StackNavigator,
} from 'react-navigation';
import styles from './styles'

export default createNavigation = (isLoggedIn, login, logout) =>  {
  const SignedOut = StackNavigator({
    SignIn: {
      screen: props => <LoginFormComponent {...props} login={login} />,
      navigationOptions: {
        title: 'Login',
        headerMode: 'none',
        header: null,
      },
    },
    SignUp: {
      screen: props => <RegisterFormComponent {...props} />,
      navigationOptions: {
        title: 'Registrace',
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: styles.headerBar,
      },
    },
  });

  const SignedIn = StackNavigator({
    Home: {
      screen: props => <SecuredComponent {...props} logout={logout} />,
      navigationOptions: {
        title: 'NEYMAR',
        headerTintColor: 'white',
        headerStyle: styles.headerBar,
      },
    }
  })

  return StackNavigator(
  {
    SignedIn: {
      screen: SignedIn,
      navigationOptions: {
        gesturesEnabled: false,
      } },
    SignedOut: {
      screen: SignedOut,
      navigationOptions: {
        gesturesEnabled: false,
      } },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: isLoggedIn ? 'SignedIn' : 'SignedOut' },
  )
}
