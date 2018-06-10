import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, Alert } from 'react-native';
import { Text, Card } from 'react-native-elements';
import UserService from '../../services/user.service'
import styles from '../../styles';

export default class ProfileComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
    }
  }

  deleteUser(userId) {
    Alert.alert(
      'Smazat uživatele',
      `Opravdu chcete smazat uživatele ${this.state.user.username}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this.handleDeleteConfirm(userId)},
      ],
      { cancelable: true }
    )
  }

  handleDeleteConfirm = async (userId) => {
    await UserService.delete(userId)
    this.props.logout()
    this.loadUser()
  }

  async componentDidMount() {
    this.loadUser()
  }

  async loadUser() {
    const currentUser = await UserService.getCurrentUser()
    this.setState({ user: currentUser })
  }
  
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.normalText}>PROFIL</Text>
        <Text style={styles.normalText}>{this.state.user.firstName} {this.state.user.lastName}</Text>
        <Text style={styles.normalText}>{this.state.user.email}</Text>
        <Text style={styles.normalText}>{this.state.user.mobileNumber}</Text>
        <Button title="Smazat" onPress={() => this.deleteUser(this.state.user.userId)}></Button>
      </View>
    );
  }
}
