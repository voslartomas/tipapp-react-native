import React, { Component } from 'react';
import RegisterService from '../services/register.service';
import { View, Button, AsyncStorage, ActivityIndicator, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import { Text, Input, Header } from 'react-native-elements';
import styles from '../styles'

export default class RegisterFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
    }
  }

  async register() {
    await RegisterService.register(this.state.user)

    this.props.navigation.goBack()
  }

  render() {
    return (
      <View id="1" style={styles.container}>
        <TextInput style={styles.input} placeholderTextColor='white' value={this.state.user.firstName} placeholder="Křestní jméno" onChangeText={(text) => this.setState({ user: {...this.state.user, firstName: text }})} autoCapitalize="words" autoCorrect={false}/>
        <TextInput style={styles.input} placeholderTextColor='white' value={this.state.user.lastName} placeholder="Příjmení" onChangeText={(text) => this.setState({ user: {...this.state.user, lastName: text }})} autoCapitalize="words" autoCorrect={false}/>
        <TextInput style={styles.input} placeholderTextColor='white' value={this.state.user.email} placeholder="E-Mail" onChangeText={(text) => this.setState({ user: {...this.state.user, email: text }})} autoCapitalize="none" autoCorrect={false}/>
        <TextInput style={styles.input} placeholderTextColor='white' value={this.state.user.mobileNumber} placeholder="Telefonní číslo" onChangeText={(text) => this.setState({ user: {...this.state.user, mobileNumber: text }})} autoCapitalize="none" autoCorrect={false}/>
        <TextInput style={styles.input} placeholderTextColor='white' value={this.state.user.username} placeholder="Přihlašovací jméno" onChangeText={(text) => this.setState({ user: {...this.state.user, username: text }})} autoCapitalize="none" autoCorrect={false}/>
        <TextInput style={styles.input} placeholderTextColor='white' value={this.state.user.password} placeholder="Heslo" onChangeText={(text) => this.setState({ user: {...this.state.user, password: text }})} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>
        <Button style={styles.button} onPress={() => this.register()} title="Registrovat se"></Button>
      </View>
    );
  }
}
