import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker, StyleSheet, Platform, StatusBar, RefreshControl, TouchableHighlight } from 'react-native';
import { Text, Card, CheckBox, Header } from 'react-native-elements';
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
      refreshing: false,
      history: false,
      currentBet: undefined
    }

    this.props.setNavigation(this.props.navigation)
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
    let matches
    if (this.state.history) {
      matches = await LeagueService.getBetsMatchesHistory(this.props.leagueId)
    } else {
      matches = await LeagueService.getBetsMatches(this.props.leagueId)
    }

    const teams = []
    for (const match of matches) {
      if (this.canBet(match)) {
        teams.push(match.awayTeamId, match.homeTeamId)
      }
    }

    const players = await PlayerService.getPlayersByTeams(this.props.leagueId, teams)

    this.setState({ matches, leagueId: this.props.leagueId, players, loading: false, refreshing: false })
  }

  async handleBetChange(match, value, scorerId = undefined, type, player) {
    if (scorerId) {
      match = this.state.currentBet
      match.scorerId = scorerId
    }

    match.homeScore = type === 'homeScore' ? parseInt(value) || 0 : match.homeScore || 0
    match.awayScore = type === 'awayScore' ? parseInt(value) || 0 : match.awayScore || 0
    match.overtime = type === 'overtime' ? value : match.overtime || false

    if (player) {
        match.selectedScorer = `${player.player.firstName} ${player.player.lastName}`
    }

    this.setState({ matches: this.state.matches })
  }

  async componentDidMount() {
    await this.loadBets()
  }

  async saveBet(match) {
    const id = match.id || 0

    match.loading = true
    match.selectedScorer = undefined
    this.setState({})
    console.log(match)
    await UserBetsMatchService.put(this.props.leagueId, {matchId: match.matchId1,
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0,
      overtime: match.overtime || false,
      scorerId: match.scorerId
    }, id)

    await this.loadBets()
  }

  getHeader(match) {
    return `${match.homeTeam} ${match.matchHomeScore}:${match.matchAwayScore}${match.matchOvertime ? 'P' : ''} ${match.awayTeam}`
  }

  _onRefresh() {
   this.setState({refreshing: true});
    this.loadBets().then(() => {
     this.setState({refreshing: false});
   });
 }

 componentDidUpdate(prevProps, prevState, snapshot) {
   if (prevState.history !== this.state.history) {
     this.loadBets()
   }
 }

 switchHistory(value) {
   this.setState({ history: value, loading: true })
 }

getStylePlayer(player) {
  let style = {fontSize: 20}

  if (player.bestScorer) {
    style = {color: 'white', backgroundColor: 'black', fontSize: 20}
  }
  if (player.secondBestScorer) {
    style = {color: 'white', backgroundColor: 'orange', fontSize: 20}
  }
  if (player.thirdBestScorer) {
    style = {color: 'white', backgroundColor: 'gray', fontSize: 20}
  }
  if (player.fourthBestScorer) {
    style = {color: 'white', backgroundColor: 'green', fontSize: 20}
  }

  return style
}

getBetButton(match) {
  return !match.id ? 'Vsadit' : 'Upravit sázku'
}

pickScorer(option) {
  this.setState({ pickerVisible: false })
  const player = option.player

  this.handleBetChange(undefined, undefined, option.player.id, 'scorer', player)
}

addStarsForBestScorers(player) {
  let stars = ''
  if (player.bestScorer) {
    return stars += '*'
  }
  if (player.secondBestScorer) {
    return stars += '**'
  }
  if (player.thirdBestScorer) {
    return stars += '***'
  }
  if (player.fourthBestScorer) {
    return stars += '****'
  }
  return stars
}

filter(matches) {
  if (!this.state.history) {
    return matches.slice(0, 10)
  }

  return matches
}

  render() {
    return(
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>

        <View style={{padding: 10}}>
         {this.state.history && <Text style={styles.normalText} onPress={() => this.switchHistory(false)}>Zobrazit nadcházející</Text>}
         {!this.state.history && <Text style={styles.normalText} onPress={() => this.switchHistory(true)}>Zobrazit historii</Text>}
        </View>

        {this.state.loading && <Loader />}

        <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode={Platform.OS === 'android' ? 'none' : 'on-drag'}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >

          {this.state.matches.length === 0 && !this.state.loading && <Text style={styles.normalText}>Žádné zápasy</Text>}

          {this.filter(this.state.matches).map(match => (
            <Card
              titleStyle={styles.subHeader}
              dividerStyle={{ backgroundColor: styles.secondary }}
              containerStyle={styles.container}
              key={`${match.matchId1}`}
              title={this.getHeader(match)}>
              <Text style={styles.normalText}>{moment(new Date(match.matchDateTime)).calendar()}</Text>
              {match.id &&
                <Text style={styles.normalText}>
                Tip: {match.homeScore}:{match.awayScore}{match.overtime ? 'P' : ''}, {match.scorer}
                </Text>}
              {this.canBet(match) && !match.betting && <Button onPress={() => {
                match.betting = true
                this.setState({matches: this.state.matches})
                }
              } title={this.getBetButton(match)} />}

              {!this.canBet(match) &&
                <Text
                onPress={() => this.props.navigation.navigate('UserBetsMatch', { leagueId: this.props.leagueId, match })}
                style={styles.normalText}>Body: {match.totalPoints}
                </Text>}

              {this.canBet(match) && match.betting &&
                (<View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <TextInput
                        style={[styles.input, {justifyContent: 'flex-start'}]}
                        value={match.homeScore}
                        returnKeyType="done"
                        onSubmitEditing={() => { this.inputRefs[`${match.id1}`].focus(); }}
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
                        ref={(input) => { this.inputRefs[`${match.id1}`] = input }}
                        keyboardAppearance="dark"
                        returnKeyType="done"
                        keyboardType="numeric"
                        name="awayScore"
                        min="0"
                        onChangeText={e => this.handleBetChange(match, e, undefined, 'awayScore')} />
                    </View>
                  </View>

                  <CheckBox
                    title='Prodloužení'
                    onPress={value => this.handleBetChange(match, !match.overtime, undefined, 'overtime')}
                    checked={match.overtime}
                  />

                  <Text style={styles.normalText}>{match.selectedScorer && match.selectedScorer}</Text>
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
              return {key: player.id,
                player,
                label: `${player.player.firstName} ${player.player.lastName}`
            }})}
            renderOption={(option) => (
              <TouchableHighlight onPress={() => this.pickScorer(option)}>
                <Text style={{padding: 5, fontSize: 14, flex: 1, flexDirection: 'row'}}>
                  <Text style={this.getStylePlayer(option.player)}>{option.player.player.position} {option.player.player.firstName}
                    {option.player.player.lastName + this.addStarsForBestScorers(option.player.player)} {option.player.leagueTeam.team.shortcut}</Text>
                  <Text>{"\n"}Z: {option.player.seasonGames}, G: {option.player.seasonGoals}, {option.player.clubName}</Text>
                </Text>
              </TouchableHighlight>
            )}
            onCancel={(el) => {
                this.setState({ pickerVisible: false })
            }}
        />

      </View>
    );
  }

}
