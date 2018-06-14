import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker, StyleSheet, StatusBar, RefreshControl, Switch } from 'react-native';
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

    this.setState({ loading: false })

    const teams = []
    for (const match of matches) {
      if (this.canBet(match)) {
        teams.push(match.awayTeamId, match.homeTeamId)
      }
    }

    const players = await PlayerService.getPlayersByTeams(this.props.leagueId, teams)

    this.setState({ matches, leagueId: this.props.leagueId, players, loading: false })
  }

  async handleBetChange(match, value, scorerId = undefined, type, player) {
    if (scorerId) {
      match = this.state.currentBet
      match.scorerId = scorerId
    }

    match.homeScore = type === 'homeScore' ? parseInt(value) : match.homeScore || 0
    match.awayScore = type === 'awayScore' ? parseInt(value) : match.awayScore || 0
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

    await UserBetsMatchService.put(this.props.leagueId, {matchId: match.matchId1,
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0,
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

 testComp() {
   return (<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
    <Text style={styles.smallText}>Následující</Text>
    <Switch
       style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
       onValueChange = {(value) => this.switchHistory(value)}
       value = {this.state.history}/>
    <Text style={styles.smallText}>Předchozí</Text>
     </View>)
 }

getStylePlayer(player) {
  return player.bestScorer ? {color: 'white', backgroundColor: 'black', fontSize: 20} : {fontSize: 20}
}

  render() {
    return(
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>

        <Header
          outerContainerStyles={styles.containerNoFlex}
          placement="left"
          centerComponent={this.testComp()}
        />

        {this.state.loading && <Loader />}

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >

          {this.state.matches.length === 0 && <Text style={styles.normalText}>Žádné zápasy</Text>}

          {this.state.matches.map(match => (
            <Card
              titleStyle={styles.subHeader}
              dividerStyle={{ backgroundColor: styles.secondary }}
              containerStyle={styles.container}
              key={`${match.awayTeamId}-${match.homeTeamId}`}
              title={this.getHeader(match)}>
              <Text style={styles.normalText}>{moment(new Date(match.matchDateTime)).calendar()}</Text>
              {match.id &&
                <Text style={styles.normalText}>
                Tip: {match.homeScore}:{match.awayScore}{match.overtime ? 'P' : ''}, {match.scorer} Body: {match.totalPoints}
                </Text>}
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

                  {/*<CheckBox
                    title='Remíza'
                    onPress={value => this.handleBetChange(match, !match.overtime, undefined, 'overtime')}
                    checked={match.overtime}
                  />*/}

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
                label: (
                  <View style={{fontSize: 20}}>
                    <Text style={this.getStylePlayer(player)}>{player.player.position} {player.player.firstName} {player.player.lastName} {player.leagueTeam.team.shortcut}</Text>
                    <Text>Z: {player.seasonGames}, G: {player.seasonGoals}, <Text >{player.clubName}</Text></Text>
                  </View>
                )
            }})}
            onSelect={(value) => {
                this.setState({ pickerVisible: false })
                const player = this.state.players.find(player => player.id === value)

                this.handleBetChange(undefined, undefined, value, 'scorer', player)
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
