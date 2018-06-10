import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker, StyleSheet, StatusBar } from 'react-native';
import { Text, Card, CheckBox } from 'react-native-elements';
import moment from 'moment';
import codePush, { UpdateState } from 'react-native-code-push';
import Loader from '../shared/loader.component'
import LeaderboardComponent from './leaderboard.component';
import { TabNavigator } from 'react-navigation';
import LeagueService from '../../services/league.service';
import UserBetsMatchService from '../../services/userBetsMatch.service';
import PlayerService from '../../services/player.service';
import styles from '../../styles';
import ModalFilterPicker from 'react-native-modal-filter-picker'

export default class BetsMatchComponent extends React.Component {
  constructor(props) {
    super(props)
    this.inputRefs = {}
    this.state = {
      matches: [],
      players: [],
      leagueId: props.leagueId,
      update: false,
      loading: true,
      pickerVisible: false,
      currentBet: undefined
    }
  }

  getPlayers(match) {
    if (!match) {
      return []
    }

    return this.state.players.filter(player => player.leagueTeamId === match.homeTeamId || player.leagueTeamId === match.awayTeamId)
  }

  getPlayerById(scorerId) {
    return this.state.players.filter(player => player.playerId === scorerId)
  }

  canBet(match) {
    return new Date(match.matchDateTime).getTime() > new Date().getTime()
  }

  async loadBets() {
    const matches = await LeagueService.getBetsMatches(this.props.leagueId)

    const teams = []
    for (const match of matches) {
      if (this.canBet(match)) {
        teams.push(match.awayTeamId, match.homeTeamId)
      }
    }

    const players = await PlayerService.getPlayersByTeams(this.props.leagueId, teams)

    this.setState({ matches, leagueId: this.props.leagueId, players, loading: false })
  }

  async handleBetChange(match, value, scorerId = undefined, type) {
    if (scorerId) {
      match = this.state.currentBet
      match.scorerId = scorerId
    }

    match.homeScore = type === 'homeScore' ? parseInt(value) : match.homeScore || 0
    match.awayScore = type === 'awayScore' ? parseInt(value) : match.awayScore || 0
    match.overtime = type === 'overtime' ? value : match.overtime || false

    this.setState({ matches: this.state.matches })
  }

  async componentDidMount() {
    await this.loadBets()
  }

  async saveBet(match) {
    const id = match.id || 0

    match.loading = true
    this.setState({})

    await UserBetsMatchService.put(this.props.leagueId, {matchId: match.matchId1,
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0,
      scorerId: match.scorerId,
      overtime: match.overtime
    }, id)

    await this.loadBets()
  }

  getHeader(match) {
    return `${match.homeTeam} ${match.matchHomeScore}:${match.matchAwayScore}${match.matchOvertime ? 'P' : ''} ${match.awayTeam}, ${moment(new Date(match.matchDateTime)).fromNow()}`
  }

  render() {
    return(
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        {this.state.loading && <Loader />}
        <ScrollView>
          {this.state.matches.map(match => (
            <Card
              titleStyle={styles.subHeader}
              dividerStyle={{ backgroundColor: styles.secondary }}
              containerStyle={styles.container}
              key={`${match.awayTeamId}-${match.homeTeamId}`}
              title={this.getHeader(match)}>
              {match.id && <Text style={styles.normalText}>Tip: {match.homeScore}:{match.awayScore}{match.overtime ? 'P' : ''}, {match.scorer}</Text>}
              {!match.betting && <Button onPress={() => {
                match.betting = true
                this.setState({matches: this.state.matches})
                }
              } title="Vsadit" />}
              {this.canBet(match) && match.betting &&
                (<View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <TextInput
                        style={[styles.input, {justifyContent: 'flex-start'}]}
                        value={match.homeScore}
                        returnKeyType="next"
                        keyboardAppearance="dark"
                        keyboardType="numeric"
                        name="homeScore"
                        min="0"
                        onChangeText={e => this.handleBetChange(match, e, undefined, 'homeScore')} />
                    </View>
                    <Text style={{color: 'white', fontWeight: 'bold', marginTop: 20, fontSize: 15}}>:</Text>
                    <View style={{flex: 1}}>
                      <TextInput
                        style={[styles.input, {justifyContent: 'flex-end'}]}
                        value={match.awayScore}
                        keyboardAppearance="dark"
                        returnKeyType="done"
                        keyboardType="numeric"
                        name="awayScore"
                        min="0"
                        onChangeText={e => this.handleBetChange(match, e, undefined, 'awayScore')} />
                    </View>
                  </View>

                  <CheckBox
                    title='Remíza'
                    onPress={value => this.handleBetChange(match, !match.overtime, undefined, 'overtime')}
                    checked={match.overtime}
                  />

                  <Button title="Vybrat střelce" onPress={() => {
                    this.setState({ pickerVisible: true, currentBet: match })
                  }} />

                  {!match.loading && <Button title="Uložit" onPress={() => this.saveBet(match)}>Uložit sázku</Button>}
                  {match.loading && <Loader />}
                </View>
              )}
            </Card>
          ))}
        </ScrollView>

        <ModalFilterPicker
            visible={this.state.pickerVisible}
            options={this.getPlayers(this.state.currentBet).map(player => {
              return {key: player.id, label: `${player.player.firstName} ${player.player.lastName} ${player.leagueTeam.team.shortcut}`
            }})}
            onSelect={(value) => {
                this.setState({ pickerVisible: false })
                this.handleBetChange(undefined, undefined, value, 'scorer')
            }}
            onCancel={(el) => {
                this.setState({ pickerVisible: false })
                this.inputRefs.picker = el;
            }}
        />

      </View>
    );
  }

}
