import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import MatchService from '../services/match.service';
import { Text, Button, Card } from 'react-native-elements';

export default class SecuredComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matches: []
    }
  }

  async componentDidMount() {
    const matches = await MatchService.getMatches(1)
    this.setState({ matches });
  }

  render() {
    console.log(this.state.matches)
    return (
      <View>
        <Button onPress={this.props.logout} backgroundColor="#291720" title="Odhlasit se">Odhlasit se</Button>
      </View>
    );
  }
}
