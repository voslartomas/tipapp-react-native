import React from 'react';
import { View, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import createNavigation from './navigation'
import { Navigation } from 'react-navigation';
import moment from 'moment';
import AppCenter from 'appcenter';
import UserService from './services/user.service'
import Loader from './components/shared/loader.component'
import styles from './styles'
import 'moment/locale/cs'

moment.locale('cs')

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      action: undefined,
      isLoggedIn: false,
      loading: true
    }
  }

  login() {
    this.setState({ action: 'login', isLoggedIn: true })
  }

  async logout() {
    try {
      await AsyncStorage.setItem('token', '')
    } catch (error) {
      console.log(error)
    }
    this.setState({ action: 'logout', isLoggedIn: false })
  }

  componentDidMount() {
    AsyncStorage.getItem('token') && AsyncStorage.getItem('token').then(async token => {
      const currentUser = await UserService.getCurrentUser()
      const pushId = await AppCenter.getInstallId()

      if (!currentUser.pushId || pushId !== currentUser.pushId) {
        UserService.update({ pushId }, currentUser.id)
      }

      this.setState({
        isLoggedIn: token && token.length > 0,
        loading: false
      })
    }).catch(err => this.setState({ loading: false }))
  }

  render() {
    const { isLoggedIn, loading } = this.state

    if (loading) return <View style={styles.container}><Loader /></View>

    const Layout = createNavigation(isLoggedIn, () => {this.login()}, () => {this.logout()})

    console.disableYellowBox = true;

    return (
      <Layout />
    );
  }
}
