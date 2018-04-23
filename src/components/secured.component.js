import React, { Component } from 'react'
import { View, Text, Button } from 'react-native';
import MatchService from '../services/match.service'

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
        <Text>HELLO</Text>
        <Button onPress={this.props.logout} title="Odhlasit se">Logout</Button>
        {this.state.matches.map(match => (
          <Text>{match.homeTeam.team.name}:{match.awayTeam.team.name}</Text>
        ))}
      </View>
    );
  }

}
