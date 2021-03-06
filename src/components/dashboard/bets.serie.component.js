import { Button, Dimensions, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, TextInput, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-elements';
import React, { Component } from 'react';

import Loader from '../shared/loader.component'
import UserBetsSerieService from '../../services/userBetsSerie.service'
import moment from 'moment';
import styles from '../../styles'

export default class BetsSerieComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      serieBets: [],
      inputSerieBets: {},
      leagueId: undefined,
      loading: true,
      refreshing: false
    }
  }

  async componentDidMount() {
    this.loadBets()
  }

  async loadBets() {
    const bets = await UserBetsSerieService.getAll(this.props.leagueId)
    this.setState({ serieBets: bets, leagueId: this.props.leagueId, loading: false, refreshing: false })
  }

  async submitSerieBet(bet) {
    this.setState({ loading: true })
    await UserBetsSerieService.put(this.props.leagueId, {
      homeTeamScore: bet.homeTeamScore,
      awayTeamScore: bet.awayTeamScore,
      leagueSpecialBetSerieId: bet.leagueSpecialBetSerieId
    }, bet.id | 0)

    await this.loadBets()
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

  _onRefresh() {
    this.setState({refreshing: true});
    this.loadBets()
  }

  render() {

    return(
      <View style={styles.container} id="0">
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode={Platform.OS === 'android' ? 'none' : 'on-drag'}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
        }
        >
        <KeyboardAvoidingView>
          {this.state.serieBets.map(bet => (
            <Card
              titleStyle={styles.subHeader}
              dividerStyle={{ backgroundColor: styles.secondary }}
              containerStyle={styles.container}
              key={bet.leagueSpecialBetSerieId}
              title={bet.homeTeam + " " + (bet.serieHomeScore || '0') + ":" + (bet.serieAwayScore || '0') + " " + bet.awayTeam}>
              {(new Date().getTime() < new Date(bet.endDate).getTime()) && <Text style={styles.normalText}>{moment(new Date(bet.endDate)).calendar()}</Text>}
              {this.betPlaced(bet) && <Text style={styles.normalText}>Tip: {bet.homeTeamScore}:{bet.awayTeamScore}</Text>}
              <Divider style={{
                backgroundColor: styles.secondary, marginTop: 10,
                marginBottom: 10, width: "60%",
                position: 'relative', left: '20%'
                }}
              />
              {bet.id && (new Date().getTime() > new Date(bet.endDate).getTime()) &&
                  <Text
                  style={styles.points}
                  onPress={() => this.props.navigation.navigate('UserBetsSerie', { leagueId: this.props.leagueId, serie: bet })}
                  >
                  Body: {bet.totalPoints}</Text>}
              {(new Date().getTime() < new Date(bet.endDate).getTime()) && <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <TextInput
                    style={[styles.input, {justifyContent: 'flex-end', width: '50%', marginLeft: 'auto'}]}
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
                    style={[styles.input, {justifyContent: 'flex-start', width: '50%'}]}
                    value={bet.awayTeamScore || 0}
                    type="number"
                    name="awayScore"
                    min="0"
                    max="4"
                    onChangeText={val => this.handleBetChange(bet, val, 'away')} />
                </View>
              </View>}
              {(new Date().getTime() < new Date(bet.endDate).getTime()) && <Button onPress={() => this.submitSerieBet(bet)} title="Save bet"/>}
            </Card>
          ))}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }

}
