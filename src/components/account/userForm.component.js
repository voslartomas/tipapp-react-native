import React, { Component } from 'react'
import { View, ScrollView, Dimensions, Button, Alert, TextInput, Text } from 'react-native';
import UserService from '../../services/user.service'
import styles from '../../styles'

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
    this.props.navigation.navigate('Profile')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.normalText}>Upravit profil</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor='white'
          placeholder="Křestní jméno"
          value={this.state.user.firstName}
          onChangeText={text => this.setState({ user: { ...this.state.user, firstName: text } })}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor='white'
          placeholder="Příjmení"
          value={this.state.user.lastName}
          onChangeText={text => this.setState({ user: { ...this.state.user, lastName: text } })}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor='white'
          placeholder="E-Mail"
          value={this.state.user.email}
          onChangeText={text => this.setState({ user: { ...this.state.user, email: text } })}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor='white'
          placeholder="Telefon"
          value={this.state.user.mobileNumber}
          onChangeText={text => this.setState({ user: { ...this.state.user, mobileNumber: text } })}
        />
        <Button onPress={() => this.saveForm()} title="Potvrdit změny"></Button>
      </View>
    )
  }

}