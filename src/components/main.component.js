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
    }
  }

  getPlayers(match) {
    return this.state.players.filter(player => player.leagueTeamId === match.homeTeamId || player.leagueTeamId === match.awayTeamId)
      .map(player => ({
      key: player.id,
      text: `${player.player.firstName} ${player.player.lastName} ${player.leagueTeam.team.shortcut}`,
      value: player.id,
    }))
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

    this.setState({ matchBets: matches, leagueId: this.props.leagueId, players })
  }

  async handleBetChange(match, event, scorerId = undefined) {
    if (!scorerId) {
      scorerId = match.scorerId;
    }

    await UserBetsMatchService.put(this.props.leagueId, {matchId: match.matchId1,
      homeScore: event.target.name === 'homeScore' ? parseInt(event.target.value) : match.homeScore || 0,
      awayScore: event.target.name === 'awayScore' ? parseInt(event.target.value) : match.awayScore || 0,
      scorerId}, match.id)

    await this.loadBets()
  }

  async componentDidMount() {
    const matches = await MatchService.getBetMatches(1)
    this.setState({ matches });
    await this.loadBets()

    if (this.props.redirectLogout) {
      this.props.logout()
    }
  }

  render() {
    console.log(this.state.matches)
    console.log(this.state.players)
    return (
      <View style={styles.container}>
        <ScrollView>
        {/*<Text style={{textAlign: 'center', color: 'white'}}>`Liga cislo: {this.props.leagueId}`</Text>*/}
          {this.state.matches.map(match => (
            <Card title={match.homeTeam + " : " +  match.awayTeam}>
              <Text>{match.matchHomeScore}:{match.matchAwayScore}{match.matchOvertime ? 'P' : ''}</Text>
              <Text>Datum: {moment(new Date(match.matchDateTime)).fromNow()}</Text>
              {this.canBet(match) &&
                (<TextInput value={match.homeScore || 0} type="number" name="homeScore" min="0" style={{ width: '35px' }} onChange={e => this.handleBetChange(match, e)} /> 
                <Text>:</Text>
                <TextInput value={match.awayScore || 0} type="number" name="awayScore" min="0" style={{ width: '35px' }} onChange={e => this.handleBetChange(match, e)} />
                )}
              <Picker onValueChange={(e, { name, value }) => {this.handleBetChange(match, e, value)}} selectedValue={match.scorerId}>
                {
                  this.getPlayers(match).map(player => (
                    <Picker.Item label={player.name} value={player.id} />
                  ))

                }
              </Picker>
            </Card>
          ))}
        </ScrollView>
        <Button onPress={this.props.logout} title="odhlasit se"></Button>
      </View>
    );
  }
}
