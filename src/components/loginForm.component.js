import React, { Component } from 'react';
import api from '../helpers/api';
import { View, AsyncStorage, ActivityIndicator, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import { Text, Button, Input, Header } from 'react-native-elements';

export default class LoginFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        username: '',
        password: '',
      },
      error: '',
      loading: true,
    }
  }

  async componentDidMount() {
    this.setState({ loading: false });
  }

  async logIn() {
    let response = undefined
    try {
      this.setState({loading: true})
      response = await api.post('login', this.state.user);
      const token = response ? response.data : '';

      await AsyncStorage.setItem('token', token);

      this.props.login()
    } catch (e) {
      this.setState({error: 'spatny login...'})
    } finally {
      this.setState({loading: false})
    }

  }

  render() {
    /*if (this.state.loading) {
      /*return (
        <ActivityIndicator size="large" color="#0000ff" />
      );
    }*/
    return (
      <View id="1" style={{height: Dimensions.get('window').height, backgroundColor: '#AFD2E9'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: 66, height: 114, marginTop: 20}}
            source={{uri: 'http://neymar.cz/files/img/logo_PravaPlatiRotak2.png'}}
          />
        </View>
        <Text>{this.state.error}</Text>
        <TextInput placeholder="Přihlašovací jméno" onChangeText={(text) => this.setState({ user: {...this.state.user, username: text} })} autoCapitalize="none" autoCorrect={false}/>
        <TextInput placeholder="Heslo" onChangeText={(text) => this.setState({ user: {...this.state.user, password: text} })} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>
        <Button onPress={() => this.logIn()} backgroundColor="#291720" title="Přihlásit se"></Button>
      </View>
    );
  }
}