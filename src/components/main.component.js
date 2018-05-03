import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker } from 'react-native';
import MatchService from '../services/match.service';
import { Text, Card } from 'react-native-elements';
import styles from '../styles';
import moment from 'moment';
import LeagueService from '../services/league.service';
import UserBetsMatchService from '../services/userBetsMatch.service';
import PlayerService from '../services/player.service';

export default class MainComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matches: [],
      players: [],
      leagueId: props.leagueId
    }
  }

  getPlayers(match) {
    return this.state.players.filter(player => player.leagueTeamId === match.homeTeamId || player.leagueTeamId === match.awayTeamId)
  }

  getPlayerById(scorerId) {
    console.log(this.state.players, scorerId)
    return this.state.players.filter(player => player.playerId === scorerId)
  }

  canBet(match) {
    return new Date(match.matchDateTime).getTime() > new Date().getTime()
  }

  async loadBets() {
    const matches = await MatchService.getBetMatches(this.props.leagueId)

    const teams = []
    for (const match of matches) {
      if (this.canBet(match)) {
        teams.push(match.awayTeamId, match.homeTeamId)
      }
    }

    const players = await PlayerService.getPlayersByTeams(this.props.leagueId, teams)

    this.setState({ matches, leagueId: this.props.leagueId, players })
  }

  async handleBetChange(match, value, scorerId = undefined, type) {
    if (!scorerId) {
      scorerId = match.scorerId;
    }
    console.log(type, value, scorerId)
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
    if (this.props.redirectLogout) {
      this.props.logout()
    }

    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.matches.map(match => (
            <Card titleStyle={styles.subHeader} dividerStyle={{ backgroundColor: styles.secondary }} containerStyle={styles.container} key={match.id} title={match.homeTeam + " : " +  match.awayTeam}>
              <Text style={styles.normalText}>{match.matchHomeScore}:{match.matchAwayScore}{match.matchOvertime ? 'P' : ''}</Text>
              <Text style={styles.normalText}>Datum: {moment(new Date(match.matchDateTime)).fromNow()}</Text>
              <Text style={styles.normalText}>Tip: {match.homeScore}:{match.awayScore}, {match.scorer}</Text>
              {this.canBet(match) &&
                (<View>
                  <TextInput style={styles.input} value={match.homeScore} type="number" name="homeScore" min="0" onChangeText={e => this.handleBetChange(match, e, undefined, 'homeScore')} />
                  <Text>:</Text>
                  <TextInput style={styles.input} value={match.awayScore} type="number" name="awayScore" min="0" onChangeText={e => this.handleBetChange(match, e, undefined, 'awayScore')} />
                  <Picker onValueChange={(value, index) => {this.handleBetChange(match, null, value)}}>
                    {
                      this.getPlayers(match).map(player => (
                        <Picker.Item label={player.player.firstName} value={player.id} />
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
