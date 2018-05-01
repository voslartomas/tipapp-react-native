import React from 'react';
import { View, AsyncStorage } from 'react-native';
import createNavigation from './navigation'

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
  
  setUser(user) {
    this.setState({
      user,
    })
  }

  render() {
    const {isLoggedIn} = this.state

    const Layout = createNavigation(isLoggedIn, () => {this.login()}, () => {this.logout()})

    console.disableYellowBox = true;

    return (
      <Layout />
    );
  }
}
