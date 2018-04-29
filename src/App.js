import React from 'react';
import LoginFormComponent from './components/loginForm.component';
import SecuredComponent from './components/secured.component';

import { View, AsyncStorage } from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      action: undefined,
      isLoggedIn: false
    }
  }

  login() {
    this.setState({ action: 'login', isLoggedIn: true })
  }

  async logout() {
    console.log('loging out')
    try {
      await AsyncStorage.setItem('token', '')
    } catch (error) {
      console.log(error)
    }
    this.setState({ action: 'logout', isLoggedIn: false })
  }

  componentDidMount() {
    AsyncStorage.getItem('token') && AsyncStorage.getItem('token').then(token => {
      this.setState({
        isLoggedIn: token && token.length > 0
      })
    })
  }

  componentWillUpdate(nextProps, nextState) {

  }

  setUser(user) {
    this.setState({
      user,
    })
  }

  render() {
    const {isLoggedIn} = this.state

    return (
      <View>
        {!isLoggedIn && <LoginFormComponent login={() => this.login()} />}
        {isLoggedIn && <SecuredComponent logout={() => this.logout()} />}
      </View>
    );
  }
}
