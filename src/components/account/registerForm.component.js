import React, { Component } from 'react';
import { View, Button, AsyncStorage, KeyboardAvoidingView, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import { Text, Input, Header } from 'react-native-elements';
import RegisterService from '../../services/register.service';
import Loader from '../shared/loader.component'
import styles from '../../styles'

export default class RegisterFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      error: undefined
    }
  }

  async register() {
    try {
        this.setState({ loading: true })
        await RegisterService.register(this.state.user)
        this.props.navigation.goBack()
    } catch (e) {
      this.setState({ error: 'Registrace selhala' })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" id="1" style={styles.container}>
        {this.state.loading && <Loader />}
        <Text style={styles.error}>{this.state.error}</Text>
        <TextInput required style={styles.input} placeholderTextColor='white' value={this.state.user.firstName} placeholder="Křestní jméno" onChangeText={(text) => this.setState({ user: {...this.state.user, firstName: text }})} autoCapitalize="words" autoCorrect={false}/>
        <TextInput required style={styles.input} placeholderTextColor='white' value={this.state.user.lastName} placeholder="Příjmení" onChangeText={(text) => this.setState({ user: {...this.state.user, lastName: text }})} autoCapitalize="words" autoCorrect={false}/>
        <TextInput required style={styles.input} placeholderTextColor='white' value={this.state.user.username} placeholder="Přihlašovací jméno" onChangeText={(text) => this.setState({ user: {...this.state.user, username: text }})} autoCapitalize="none" autoCorrect={false}/>
        <TextInput required style={styles.input} placeholderTextColor='white' value={this.state.user.password} placeholder="Heslo" onChangeText={(text) => this.setState({ user: {...this.state.user, password: text }})} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>
        <Button style={styles.button} onPress={() => this.register()} title="Registrovat se"></Button>
      </KeyboardAvoidingView>
    );
  }
}
