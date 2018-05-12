import React, { Component } from 'react'
import UserService from '../services/user.service'
import { View, Button, AsyncStorage, ActivityIndicator, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import { Text, Input, Header } from 'react-native-elements';
import styles from '../../styles'

export default class UserFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
    }
  }

  async componentDidMount() {
    const userId = this.props.match.params.userId
    let user = {}
    if (userId !== 'new') {
      user = await UserService.getUserById(userId)
    }
    this.setState({
      user,
    })
  }

  async saveForm() {
    if (this.state.user.id) {
      await UserService.update(this.state.user, this.state.user.id)
    }
  }

  render() {
    return (
      <View id="1" style={styles.container}>
        <Header>Upravit profil</Header>
        <TextInput
          style={styles.input} placeholderTextColor='white'
          placeholder="Křestní jméno"
          value={this.state.user.firstName}
          onChangeText={text => this.setState({ user: { ...this.state.user, firstName: text } })}
        />
        <TextInput
          style={styles.input} placeholderTextColor='white'
          placeholder="Příjmení"
          value={this.state.user.lastName}
          onChangeText={text => this.setState({ user: { ...this.state.user, lastName: text } })}
        />
        <TextInput
          style={styles.input} placeholderTextColor='white'
          placeholder="E-Mail"
          value={this.state.user.email}
          onChangeText={text => this.setState({ user: { ...this.state.user, email: text } })}
        />
        <TextInput
          style={styles.input} placeholderTextColor='white'
          placeholder="Telefon"
          value={this.state.user.mobileNumber}
          onChangeText={text => this.setState({ user: { ...this.state.user, mobileNumber: text } })}
        />
        <Button style={styles.button} onPress={() => this.saveForm()} title="Potvrdit změny"></Button>
      </View>
    )
  }

}