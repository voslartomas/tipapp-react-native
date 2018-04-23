import React from 'react';
import LoginFormComponent from './components/loginForm.component';
import SecuredComponent from './components/secured.component';

import { View, AsyncStorage } from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      action: undefined,
    }
  }

  login() {
    this.setState({ action: 'login' })
  }

  logout() {
    console.log('loging out')
    try {
      AsyncStorage.setItem('token', '')
    } catch (error) {

    }
    this.setState({ action: 'logout' })
  }

  setUser(user) {
    this.setState({
      user,
    })
  }

  render() {
    const isLoggedIn = AsyncStorage.getItem('token') && AsyncStorage.getItem('token').length > 0;

    return (
      <View>
        {!isLoggedIn && <LoginFormComponent login={() => this.login()} />}
        {isLoggedIn && <SecuredComponent logout={() => this.logout()} />}
      </View>
    );
  }
}
