import React, { Component } from 'react';
import api from '../helpers/api';
import { View, Button, AsyncStorage, ActivityIndicator, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import { Text, Input, Header } from 'react-native-elements';
import styles from '../styles'

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
    return (
      <View style={styles.container}>
        {this.state.loading && <ActivityIndicator size="large" color="#0000ff" />}
        <Text style={styles.logo}>Neymar</Text>
        <Text style={styles.error}>{this.state.error}</Text>
        <TextInput placeholderTextColor='white' required style={styles.input} placeholder="Přihlašovací jméno" onChangeText={(text) => this.setState({ user: {...this.state.user, username: text} })} autoCapitalize="none" autoCorrect={false}/>
        <TextInput placeholderTextColor='white' required style={styles.input} placeholder="Heslo" onChangeText={(text) => this.setState({ user: {...this.state.user, password: text} })} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>
        <Button onPress={() => this.logIn()} title="Přihlásit se"></Button>
        <Button onPress={() => { this.props.navigation.navigate('SignUp') } } title="Nemáte ještě účet? Registrace..."></Button>
      </View>
    );
  }
}
