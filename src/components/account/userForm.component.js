import React, { Component } from 'react'
import { View, ScrollView, Dimensions, Button, Alert, TextInput, Text } from 'react-native';
import UserService from '../../services/user.service'

export default class UserFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
    }
  }

  async componentDidMount() {
    const currentUser = await UserService.getCurrentUser()
    this.setState({ user: currentUser })
  }

  async saveForm() {
    if (this.state.user.id) {
      await UserService.update(this.state.user, this.state.user.id)
    }
  }

  render() {
    return (
      <View>
        <Text>Upravit profil</Text>
        <TextInput
          placeholder="Křestní jméno"
          value={this.state.user.firstName}
          onChangeText={text => this.setState({ user: { ...this.state.user, firstName: text } })}
        />
        <TextInput
          placeholder="Příjmení"
          value={this.state.user.lastName}
          onChangeText={text => this.setState({ user: { ...this.state.user, lastName: text } })}
        />
        <TextInput
          placeholder="E-Mail"
          value={this.state.user.email}
          onChangeText={text => this.setState({ user: { ...this.state.user, email: text } })}
        />
        <TextInput
          placeholder="Telefon"
          value={this.state.user.mobileNumber}
          onChangeText={text => this.setState({ user: { ...this.state.user, mobileNumber: text } })}
        />
        <Button onPress={() => this.saveForm()} title="Potvrdit změny"></Button>
      </View>
    )
  }

}