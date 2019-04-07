import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-elements';
import Loader from '../shared/loader.component'
import UserBetsSerieService from '../../services/userBetsSerie.service'
import styles from '../../styles'

export default class BetsSerieComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      serieBets: [],
      inputSerieBets: {},
      leagueId: undefined,
      loading: true
    }
  }

  async componentDidMount() {
    this.loadBets()
  }

  async loadBets() {
    const bets = await UserBetsSerieService.getAll(this.props.leagueId)

    this.setState({ serieBets: bets, leagueId: this.props.leagueId, loading: false })
  }

  async submitSerieBet(bet) {
    this.setState({ loading: true })
    await UserBetsSerieService.put(this.props.leagueId, {
      homeTeamScore: bet.homeTeamScore,
      awayTeamScore: bet.awayTeamScore,
      leagueSpecialBetSerieId: bet.leagueSpecialBetSerieId
    }, bet.id | 0)

    await this.loadBets()
    this.setState({ loading: false })
  }

  async handleBetChange(bet, value, eventType) {
    bet.homeTeamScore = eventType === 'home' ? parseInt(value) : bet.homeTeamScore || 0
    bet.awayTeamScore = eventType === 'away' ? parseInt(value) : bet.awayTeamScore || 0

    this.setState({ loading: false })
  }

  betPlaced(bet) {
    return bet.id
  }

  betCorrect(bet) {
    if (this.betPlaced(bet)) {
      return this.state.inputSerieBets[bet.id].homeTeamScore == bet.homeTeamScore &&
        this.state.inputSerieBets[bet.id].awayTeamScore == bet.awayTeamScore
    }

    return false
  }

  render() {
    if (this.props.leagueId !== this.state.leagueId) {
      this.componentDidMount()
    }

    return(
      <View style={styles.container} id="0">
        {this.state.loading && <Loader />}
        <ScrollView>
          {this.state.serieBets.map(bet => (
            <Card
              titleStyle={styles.subHeader}
              dividerStyle={{ backgroundColor: styles.secondary }}
              containerStyle={styles.container}
              key={bet.id}
              title={bet.homeTeam + " " + (bet.serieHomeScore || '') + ":" + (bet.serieAwayScore || '') + " " + bet.awayTeam}>

              {this.betPlaced(bet) && <Text style={styles.normalText}>Tip: {bet.homeTeamScore}:{bet.awayTeamScore}</Text>}

              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={[styles.input, {justifyContent: 'flex-start'}]}
                    value={bet.homeTeamScore || 0}
                    type="number"
                    name="homeScore"
                    min="0"
                    max="4"
                    onChangeText={val => this.handleBetChange(bet, val, 'home')} />
                </View>
                <Text style={{color: 'white', fontWeight: 'bold', marginTop: 20, fontSize: 15}}>:</Text>
                <View style={{flex: 1}}>
                  <TextInput
                    style={[styles.input, {justifyContent: 'flex-end'}]}
                    value={bet.awayTeamScore || 0}
                    type="number"
                    name="awayScore"
                    min="0"
                    max="4"
                    onChangeText={val => this.handleBetChange(bet, val, 'away')} />
                </View>
              </View>
              <Button onPress={() => this.submitSerieBet(bet)} title="Save bet"/>
            </Card>
          ))}
        </ScrollView>
      </View>
    );
  }

}
