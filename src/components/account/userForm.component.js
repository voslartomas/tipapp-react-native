import React, { Component } from 'react'
import { KeyboardAvoidingView, ScrollView, Dimensions, Button, Alert, TextInput, Text } from 'react-native';
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

    await this.props.navigation.state.params.loadUser()
    this.props.navigation.navigate('Profile')
  }

  render() {
    return (
      <KeyboardAvoidingView behaviour="position" enabled style={styles.containerTop}>
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
          placeholder="Upozornění x hodin před zápasem"
          returnKeyType="done"
          keyboardAppearance="dark"
          keyboardType="numeric"
          value={this.state.user.notifyHours && this.state.user.notifyHours.toString()}
          onChangeText={text => this.setState({ user: { ...this.state.user, notifyHours: text } })}
        />
        <Button onPress={() => this.saveForm()} title="Potvrdit změny"></Button>
      </KeyboardAvoidingView>
    )
  }

}
