import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker, StyleSheet, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { Text, Card } from 'react-native-elements';
import moment from 'moment';
import codePush, { UpdateState } from 'react-native-code-push';
import Loader from '../shared/loader.component'
import LeaderboardComponent from './leaderboard.component';
import { TabNavigator } from 'react-navigation';
import UserBetsSpecialService from '../../services/userBetsSpecial.service';
import PlayerService from '../../services/player.service';
import TeamService from '../../services/team.service';
import styles from '../../styles';
import ModalFilterPicker from 'react-native-modal-filter-picker'

export default class BetsMatchComponent extends React.Component {
  constructor(props) {
    super(props)
    this.inputRefs = {}
    this.state = {
      matches: [],
      players: [],
      teams: [],
      leagueId: props.leagueId,
      update: false,
      loading: true,
      playersVisible: false,
      teamsVisible: false,
      currentBet: undefined
    }
  }

  getPlayers(match) {
    return this.state.players
  }

  getTeams() {
    return this.state.teams
  }

  getPlayerById(scorerId) {
    return this.state.players.filter(player => player.playerId === scorerId)
  }

  canBet(match) {
    return new Date(match.endDate).getTime() > new Date().getTime()
  }

  handleBetChange(single, value, type) {
    if (!single) {
      single = this.state.currentBet
    }

    switch (type) {
      case 1:
        single.playerResultId = value
        const player = this.state.players.find(player => player.id === value)
        single.playerBet = `${player.player.firstName} ${player.player.lastName}`
        break;
      case 2:
        single.teamResultId = value
        single.teamBet = this.state.teams.find(team => team.id === value).team.name
        break;
      case 3:
        single.value = value
        single.valueBet = value
        break;
    }

    if (type === 1 || type === 2) {
      this.setState({ visible: false })
    }
  }

  onCancel() {
    this.setState({ visible: false })
  }

  async saveBet(single) {
    let data = {
      leagueSpecialBetSingleId: single.singleId
    }

    if (single.type === 1) {
      data['playerResultId'] = single.playerResultId
    } else if (single.type === 2) {
      data['teamResultId'] = single.teamResultId
    } else if (single.type === 3) {
      data['value'] = single.value
    }

    single.loading = true
    this.setState({})

    await UserBetsSpecialService.put(this.props.leagueId, data, single.id)

    single.loading = false

    await this.loadBets()
  }

  async loadBets() {
    const specials = await UserBetsSpecialService.getAll(this.props.leagueId)

    const teams = await TeamService.getAll(this.props.leagueId)
    const players = await PlayerService.getAll(this.props.leagueId)

    this.setState({ matches: specials, leagueId: this.props.leagueId, players, teams, loading: false })
  }

  async componentDidMount() {
    await this.loadBets()
  }

  getBetTitle(special) {
    let title
    switch (special.type) {
      case 1:
        title = special.playerBet
        break;
      case 2:
        title = special.teamBet
        break;
      case 3:
        title = special.valueBet
        break;
    }

    return title
  }

  getHeader(special) {
    return `${special.name} - ${this.getResult(special)}`
  }

  getResult(single) {
    let result
    switch (single.type) {
      case 1:
        result = single.player
        break;
      case 2:
        result = single.team
        break;
      case 3:
        result = single.value
        break;
    }

    return result === null ? '?' : result
  }

  _onRefresh() {
   this.setState({refreshing: true});
    this.loadBets().then(() => {
     this.setState({refreshing: false});
   });
 }

  render() {
    return(
      <View style={styles.container}>
        {this.state.loading && <Loader />}
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        >
          <KeyboardAvoidingView>
            {this.state.matches.map(match => (
              <Card
                titleStyle={styles.subHeader}
                dividerStyle={{ backgroundColor: styles.secondary }}
                containerStyle={styles.container}
                key={`${match.singleId}`}
                title={this.getHeader(match)}>
                <Text style={styles.normalText}>{moment(new Date(match.endDate)).calendar()}</Text>
                {(match.id || this.getBetTitle(match)) &&
                  <Text style={styles.normalText}>Tip: {this.getBetTitle(match)}</Text>}
                {match.id && <Text>Body: {match.totalPoints}</Text>}
                {this.canBet(match) &&
                  (<View>
                    {match.type === 3 && <TextInput
                      style={[styles.input, {justifyContent: 'flex-start'}]}
                      returnKeyType="done"
                      keyboardAppearance="dark"
                      keyboardType="numeric"
                      min="0"
                      onChangeText={value => {
                        this.setState({currentBet: match})
                        this.handleBetChange(match, value, 3)
                      }} />}

                      {match.type === 1 && <Button onPress={() => this.setState({playersVisible: true, currentBet: match})} title="Vybrat hráče" />}
                      {match.type === 2 && <Button onPress={() => this.setState({teamsVisible: true, currentBet: match})} title="Vybrat tým" />}

                    {match === this.state.currentBet && !match.loading && <Button title="Uložit" onPress={() => this.saveBet(match)} />}
                    {match.loading && <Loader />}
                  </View>
                )}
              </Card>
            ))}
          </KeyboardAvoidingView>
        </ScrollView>

        {<ModalFilterPicker
            visible={this.state.playersVisible}
            options={this.getPlayers().map(player => {
              return {key: player.id, label: `${player.player.firstName} ${player.player.lastName} ${player.leagueTeam.team.shortcut}`
            }})}
            onSelect={(value) => {
              this.setState({ playersVisible: false })
              this.handleBetChange(undefined, value, 1)
            }}
            onCancel={() => {
              this.setState({ playersVisible: false })
              this.onCancel()
            }}
        />}

        {<ModalFilterPicker
            visible={this.state.teamsVisible}
            options={this.getTeams().map(team => {
              return {key: team.id, label: `${team.team.name}`
            }})}
            onSelect={(value) => {
                this.setState({ teamsVisible: false })
                this.handleBetChange(undefined, value, 2)
            }}
            onCancel={() => {
              this.setState({ teamsVisible: false })
              this.onCancel()
            }}
        />}

      </View>
    );
  }

}
