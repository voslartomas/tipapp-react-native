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
    console.log('SOOOSSSSSSSSSSSSSSSSSSSS')
    const bets = await BetsSerieService.getAll(this.props.match.params.leagueId)
    const userBets = await UserBetsSerieService.getAll(this.props.match.params.leagueId)

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
    
    this.setState({ serieBets: bets, userSerieBets: userBets, inputSerieBets, leagueId: this.props.id, loading: false })
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
          homeTeamScore: event.target.name === 'homeTeamScore' ? parseInt(event.target.value) : defaultHome,
          awayTeamScore: event.target.name === 'awayTeamScore' ? parseInt(event.target.value) : defaultAway,
          totalPoints: this.state.inputSerieBets[id] ? this.state.inputSerieBets[id].totalPoints : 0,
          id: this.state.inputSerieBets[id] ? this.state.inputSerieBets[id].id : 0,
        },
      }),
    })
  }

  submitSerieBet(id) {
    if (this.state.inputSerieBets[id]) {
      UserBetsSerieService.put(this.props.match.params.leagueId, this.state.inputSerieBets[id], this.state.inputSerieBets[id].id)
      this.loadBets()
    }
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
    if (this.props.id !== this.state.leagueId) {
      this.componentDidMount()
    }
    return(
      <View style={styles.container}>
        {/*this.state.loading && <Loader />*/}
        <Text>HEELO</Text>
        <ScrollView>
          {this.state.serieBets.map(bet => (
            <Card titleStyle={styles.subHeader} dividerStyle={{ backgroundColor: styles.secondary }} containerStyle={styles.container} key={bet.id} title={bet.homeTeam.team.name + " : " +  bet.awayTeam.team.name}>
              <Text style={styles.normalText}>{bet.homeTeamScore}:{bet.awayTeamScore}</Text>
              
            </Card>
          ))}
        </ScrollView>        
      </View>
    );
  }

}