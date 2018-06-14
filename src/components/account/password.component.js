import React, { Component } from 'react';
import { View, Button, AsyncStorage, StyleSheet, TextInput, Dimensions, Image, StatusBar } from 'react-native';
import { Text, Input, Header } from 'react-native-elements';
import UserService from '../../services/user.service'
import styles from '../../styles';

export default class PasswordComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      passwordNew: "",
      passwordNewAgain: "",
      redirect: undefined,
      error: false
    }
  }

  async saveForm() {
    if (this.state.passwordNew == this.state.passwordNewAgain) {
      await UserService.changePassword({password: this.state.passwordNew});
      this.props.navigation.navigate('Profile')
    } else {
      this.setState({error: true})
    }
  }
  
  render() {
    return(
      <View style={styles.container}>
        {this.state.error && <Text style={styles.error}>Zadaná hesla se neshodují.</Text>}
        <TextInput placeholderTextColor='white' required style={styles.input} placeholder="Heslo" onChangeText={(text) => this.setState({ passwordNew: text })} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>
        <TextInput placeholderTextColor='white' required style={styles.input} placeholder="Heslo znovu" onChangeText={(text) => this.setState({ passwordNewAgain: text })} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>
        <Button onPress={() => this.saveForm()} title="Změnit heslo"></Button>
      </View>
    );
  }
}