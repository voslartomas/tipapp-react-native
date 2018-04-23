import React, { Component } from 'react';
import api from '../helpers/api';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Text, Root } from 'native-base';

export default class LoginFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        username: '',
        password: '',
      },
      error: '',
      loading: true,
    }
  }

  async componentDidMount() {
    this.setState({ loading: false });
  }

  async logIn() {
    let response = undefined
    try {
      this.setState({loading: true})
      response = await api.post('login', this.state.user);
      const token = response ? response.data : '';

      await AsyncStorage.setItem('token', token);

      this.props.login()
    } catch (e) {
      this.setState({error: 'spatny login...'})
    } finally {
      this.setState({loading: false})
    }

  }

  render() {
    if (this.state.loading) {
      return (
        <Root>
          <ActivityIndicator size="large" color="#0000ff" />
        </Root>
      );
    }
    return (
      <View id="kok">
        <Header/>
        <Text>{this.state.error}</Text>
        <Form>
          <Item>
            <Input placeholder="Username" onChangeText={(text) => this.setState({ user: {...this.state.user, username: text} })}/>
          </Item>
          <Item last>
            <Input placeholder="Password" onChangeText={(text) => this.setState({ user: {...this.state.user, password: text} })}/>
          </Item>
          <Item>
          <Button onPress={() => this.logIn()}><Text>Přihlásit se</Text></Button>
          </Item>
        </Form>
      </View>

    )
  }

}
