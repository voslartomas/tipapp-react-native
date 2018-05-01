import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import MatchService from '../services/match.service';
import { Text, Button, Card } from 'react-native-elements';
 
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
      <View style={{marginBottom: 90}}>
        <Button onPress={this.props.logout} title="Odhlásit se"/>
        <ScrollView>
        {this.state.matches.map(match => (
          <Card title={match.homeTeam.team.name + ' : ' + match.awayTeam.team.name}>
          
          </Card>
        ))}
        </ScrollView>
      </View>
    );
  }
}
