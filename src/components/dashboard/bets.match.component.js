import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-elements';
import moment from 'moment';
import codePush, { UpdateState } from 'react-native-code-push';
import Loader from '../shared/loader.component'
import LeaderboardComponent from './leaderboard.component';
import { TabNavigator } from 'react-navigation';
import LeagueService from '../../services/league.service';
import UserBetsMatchService from '../../services/userBetsMatch.service';
import PlayerService from '../../services/player.service';
import styles from '../../styles';

export default class BetsMatchComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      matches: [],
      players: [],
      leagueId: props.leagueId,
      update: false,
      loading: true
    }
  }

  getPlayers(match) {
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
    if (!scorerId) {
      scorerId = match.scorerId;
    }

    await UserBetsMatchService.put(this.props.leagueId, {matchId: match.matchId1,
      homeScore: type === 'homeScore' ? parseInt(value) : match.homeScore || 0,
      awayScore: type === 'awayScore' ? parseInt(value) : match.awayScore || 0,
      scorerId}, match.id)

    await this.loadBets()
  }

  async componentDidMount() {
    await this.loadBets()
  }

  render() {
    return(
      <View style={styles.container}>
        {this.state.loading && <Loader />}
        <ScrollView>
          {this.state.matches.map(match => (
            <Card titleStyle={styles.subHeader} dividerStyle={{ backgroundColor: styles.secondary }} containerStyle={styles.container} key={match.id} title={match.homeTeam + " : " +  match.awayTeam}>
              <Text style={styles.normalText}>{match.matchHomeScore}:{match.matchAwayScore}{match.matchOvertime ? 'P' : ''}</Text>
              <Text style={styles.normalText}>Datum: {moment(new Date(match.matchDateTime)).fromNow()}</Text>
              <Text style={styles.normalText}>Tip: {match.homeScore}:{match.awayScore}, {match.scorer}</Text>
              {this.canBet(match) &&
                (<View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <TextInput style={[styles.input, {justifyContent: 'flex-start'}]} value={match.homeScore} type="number" name="homeScore" min="0" onChangeText={e => this.handleBetChange(match, e, undefined, 'homeScore')} />
                    </View>
                    <Text style={{color: 'white', fontWeight: 'bold', marginTop: 20, fontSize: 15}}>:</Text>
                    <View style={{flex: 1}}>
                      <TextInput style={[styles.input, {justifyContent: 'flex-end'}]} value={match.awayScore} type="number" name="awayScore" min="0" onChangeText={e => this.handleBetChange(match, e, undefined, 'awayScore')} />
                    </View>
                  </View>
                  <Picker onValueChange={(value, index) => {this.handleBetChange(match, null, value)}}>
                    {
                      this.getPlayers(match).map(player => (
                        <Picker.Item label={player.player.firstName} value={player.id}/>
                      ))

                    }
                  </Picker>
                </View>
              )}
            </Card>
          ))}
        </ScrollView>
      </View>
    );
  }

}
