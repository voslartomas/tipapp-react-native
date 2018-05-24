import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-elements';
import Loader from '../shared/loader.component'
import BetsSerieService from '../../services/betsSerie.service'
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
    const bets = await BetsSerieService.getAll(this.props.leagueId)
    const userBets = await UserBetsSerieService.getAll(this.props.leagueId)

    const inputSerieBets = []
    userBets.forEach((userBet) => {
      inputSerieBets[userBet.leagueSpecialBetSerieId] = {
        leagueSpecialBetSerieId: userBet.leagueSpecialBetSerieId,
        homeTeamScore: userBet.homeTeamScore,
        awayTeamScore: userBet.awayTeamScore,
        totalPoints: userBet.totalPoints,
        id: userBet.id
      }
    })

    this.setState({ serieBets: bets, userSerieBets: userBets, inputSerieBets, leagueId: this.props.leagueId, loading: false })
  }

  handleSerieBetChange(id, event) {
    let defaultHome,
      defaultAway = 0
    if (this.state.inputSerieBets[id]) {
      defaultHome = this.state.inputSerieBets[id].homeTeamScore
      defaultAway = this.state.inputSerieBets[id].awayTeamScore
    }

    this.setState({
      inputSerieBets: Object.assign(this.state.inputSerieBets, {
        [id]: {
          leagueSpecialBetSerieId: id,
          homeTeamScore: event === 'homeTeamScore' ? parseInt(event) : defaultHome,
          awayTeamScore: event === 'awayTeamScore' ? parseInt(event) : defaultAway,
          totalPoints: this.state.inputSerieBets[id] ? this.state.inputSerieBets[id].totalPoints : 0,
          id: this.state.inputSerieBets[id] ? this.state.inputSerieBets[id].id : 0,
        },
      }),
    })
  }

  submitSerieBet(id) {
    if (this.state.inputSerieBets[id]) {
      UserBetsSerieService.put(this.props.leagueId, this.state.inputSerieBets[id], this.state.inputSerieBets[id].id)
      this.loadBets()
    }
    this.loadBets()
  }

  betPlaced(bet) {
    return this.state.inputSerieBets[bet.id]
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
            <Card titleStyle={styles.subHeader} dividerStyle={{ backgroundColor: styles.secondary }} containerStyle={styles.container} key={bet.id} title={bet.homeTeam.team.name + " : " +  bet.awayTeam.team.name}>
              <Text style={styles.normalText}>{bet.homeTeamScore}:{bet.awayTeamScore}</Text>
              {this.betPlaced(bet) && <Text style={styles.normalText}>Tip: {this.state.inputSerieBets[bet.id].homeTeamScore}:{this.state.inputSerieBets[bet.id].awayTeamScore}</Text>}
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <TextInput style={[styles.input, {justifyContent: 'flex-start'}]} value={(this.state.inputSerieBets[bet.id] && this.state.inputSerieBets[bet.id].homeTeamScore) || 0} type="number" name="homeScore" min="0" max="4" onChangeText={e => this.handleSerieBetChange(bet.id, e)} />
                </View>
                <Text style={{color: 'white', fontWeight: 'bold', marginTop: 20, fontSize: 15}}>:</Text>
                <View style={{flex: 1}}>
                  <TextInput style={[styles.input, {justifyContent: 'flex-end'}]} value={(this.state.inputSerieBets[bet.id] && this.state.inputSerieBets[bet.id].awayTeamScore) || 0} type="number" name="awayScore" min="0" max="4" onChangeText={e => this.handleSerieBetChange(bet.id, e)} />
                </View>
              </View>
              <Button onPress={() => this.submitSerieBet(bet.id)} title="Save bet"/>
            </Card>
          ))}
        </ScrollView>
      </View>
    );
  }

}
