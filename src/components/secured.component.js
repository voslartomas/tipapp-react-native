import React, { Component } from 'react'
import { View } from 'react-native';
import MatchService from '../services/match.service'
import { Container, Header, Content, Form, Item, Input, Root, Title, Text, Body, Left, Right, Icon, Button, Card, CardItem } from 'native-base';

export default class SecuredComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fontLoaded: false,
      matches: []
    }
  }

  async componentDidMount() {
    const matches = await MatchService.getMatches(1)
    this.setState({ fontLoaded: true, matches });
  }

  render() {
    console.log(this.state.matches)
    return (
      <View>
        <Header>
          <Body><Title>NEYMAR</Title></Body>
          <Right><Button onPress={this.props.logout} iconRight transparent><Text>ODHLÁSIT SE</Text><Icon type="FontAwesome" name='sign-out' /></Button></Right>
        </Header>
        <Text>Hello</Text>
        {this.state.matches.map(match => (
          <Text>{match.homeTeam.team.name}:{match.awayTeam.team.name}</Text>
        ))}
      </View>
    );
  }
}
