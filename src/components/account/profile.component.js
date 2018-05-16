import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, Alert } from 'react-native';
import { Text, Card } from 'react-native-elements';
import UserService from '../../services/user.service'

export default class ProfileComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
    }
  }

  async componentDidMount() {
    this.loadUser()
  }

  async loadUser() {
    console.log("JOO")
    const currentUser = await UserService.getCurrentUser()
    this.setState({ user: currentUser })
  }
  
  render() {
    console.log(this.state.user);
    return (
      <View>
        <Text>PROFIL</Text>
        <Text>{this.state.user.firstName} {this.state.user.lastName}</Text>
        <Text>{this.state.user.email}</Text>
        <Text>{this.state.user.mobileNumber}</Text>
      </View>
    );
  }
}
