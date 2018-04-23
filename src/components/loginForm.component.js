import React, { Component } from 'react';
import api from '../helpers/api';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Text, Root } from 'native-base';

export default class LoginFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      loading: true,
    }
  }

  async componentDidMount() {
    this.setState({ loading: false });
  }

  async logIn() {
    try {
      this.setState({loading: true})
      console.log('logingin...')
      const response = await api.post('login', this.state);
      console.log('res', response)
      const token = response ? response.text : '';
      console.log(response);

      await AsyncStorage.setItem('token', token);

      this.props.login()
      this.setState({loading: false})
      console.log('loaded')
    } catch (e) {
      console.log(e)
    } finally {

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
        <Form>
          <Item>
            <Input placeholder="Username" value={this.state.username} onChange={event => this.setState({ username: event.target.value })}/>
          </Item>
          <Item last>
            <Input placeholder="Password" value={this.state.password} onChange={event => this.setState({ password: event.target.value })}/>
          </Item>
          <Item>
          <Button onPress={() => this.logIn()}><Text>Přihlásit se</Text></Button>
          </Item>
        </Form>
      </View>

    )
  }

}
