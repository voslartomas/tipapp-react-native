import React from 'react';
import LoginFormComponent from './components/loginForm.component';
import RegisterFormComponent from './components/registerForm.component';
import SecuredComponent from './components/secured.component';
import {
  StackNavigator,
} from 'react-navigation';
import Button from 'react-native';

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
      },
    },
  });

  const SignedIn = StackNavigator({
    Home: {
      screen: props => <SecuredComponent {...props} logout={logout} />,
      navigationOptions: {
        title: 'NEYMAR',
        headerRight: (
          <Button
            onPress={() => alert('This is a button!')}
            title="Info"
            color="#fff"
          />
        ),
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
