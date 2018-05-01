import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import MatchService from '../services/match.service';
import { Text, Button, Card } from 'react-native-elements';
import styles from '../styles'

export default class MainComponent extends Component {
    constructor(props) {
      super(props)

      this.state = {
        matches: []
      }
    }

    async componentDidMount() {
      const matches = await MatchService.getMatches(1)
      this.setState({ matches });

      if (this.props.redirectLogout) {
        this.props.logout()
      }
    }

    render() {
      return (
        <View style={styles.container}>
          <Text style={{textAlign: 'center', color: 'white'}}>`Liga cislo: {this.props.leagueId}`</Text>
        </View>
      );
    }
}
