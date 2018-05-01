import React, { Component } from 'react';
import RegisterService from '../services/register.service';
import { View, AsyncStorage, ActivityIndicator, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import { Text, Button, Input, Header } from 'react-native-elements';

export default class RegisterFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
    }
  }

  async register() {
    RegisterService.register(this.state.user)

    this.props.navigation.goBack()
  }

  render() {
    return (
      <View id="1" style={{height: Dimensions.get('window').height, backgroundColor: '#AFD2E9'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: 66, height: 114, marginTop: 20}}
            source={{uri: 'http://neymar.cz/files/img/logo_PravaPlatiRotak2.png'}}
          />
        </View>
        <TextInput value={this.state.user.firstName} placeholder="Křestní jméno" onChangeText={(text) => this.setState({ user: {...this.state.user, firstName: text }})} autoCapitalize="words" autoCorrect={false}/>
        <TextInput value={this.state.user.lastName} placeholder="Příjmení" onChangeText={(text) => this.setState({ user: {...this.state.user, lastName: text }})} autoCapitalize="words" autoCorrect={false}/>
        <TextInput value={this.state.user.email} placeholder="E-Mail" onChangeText={(text) => this.setState({ user: {...this.state.user, email: text }})} autoCapitalize="none" autoCorrect={false}/>
        <TextInput value={this.state.user.mobileNumber} placeholder="Telefonní číslo" onChangeText={(text) => this.setState({ user: {...this.state.user, mobileNumber: text }})} autoCapitalize="none" autoCorrect={false}/>
        <TextInput value={this.state.user.username} placeholder="Přihlašovací jméno" onChangeText={(text) => this.setState({ user: {...this.state.user, username: text }})} autoCapitalize="none" autoCorrect={false}/>
        <TextInput value={this.state.user.password} placeholder="Heslo" onChangeText={(text) => this.setState({ user: {...this.state.user, password: text }})} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>
        <Button onPress={() => this.register()} backgroundColor="#291720" title="Registrovat se"></Button>
        <Button onPress={() => { this.props.navigation.goBack() } } backgroundColor="#291720" title="Prihlasit"></Button>
      </View>
    );
  }
}
