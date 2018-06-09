import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button, TextInput, Picker, StyleSheet, StatusBar } from 'react-native';
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

  handleBetChange(value, type) {
    const single = this.state.currentBet
    switch (type) {
      case 1:
        single.playerResultId = value
        break;
      case 2:
        single.teamResultId = value
        break;
      case 3:
        single.value = value
        break;
    }

    this.setState({ visible: false })
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
    console.log(data)
    await UserBetsSpecialService.put(this.props.leagueId, data, single.id | 0)
    this.loadBets()
  }

  async loadBets() {
    const specials = await UserBetsSpecialService.getAll(this.props.leagueId)
    console.log(specials)
    const teams = await TeamService.getAll(this.props.leagueId)
    const players = await PlayerService.getAll(this.props.leagueId)

    this.setState({ matches: specials, leagueId: this.props.leagueId, players, teams, loading: false })
  }

  async componentDidMount() {
    await this.loadBets()
  }

  getBetTitle(single) {
    let title
    switch (single.type) {
      case 1:
        title = single.playerBet
        break;
      case 2:
        title = single.teamBet
        break;
      case 3:
        title = single.valueBet
        break;
    }

    return title
  }

  getHeader(special) {
    return `${special.name} ${moment(new Date(special.endDate)).fromNow()}`
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
              {match.id && <Text style={styles.normalText}>Tip: {this.getBetTitle(match)}</Text>}
              {this.canBet(match) &&
                (<View>
                  {match.type === 3 && <TextInput
                    style={[styles.input, {justifyContent: 'flex-start'}]}
                    value={match.homeScore}
                    returnKeyType="next"
                    keyboardAppearance="dark"
                    keyboardType="numeric"
                    name="homeScore"
                    min="0"
                    onChangeText={value => this.handleBetChange(match, value, 3)} />}

                    {match.type === 1 && <Button onPress={() => this.setState({playersVisible: true, currentBet: match})} title="Vybrat" />}
                    {match.type === 2 && <Button onPress={() => this.setState({teamsVisible: true, currentBet: match})} title="Vybrat" />}

                  <Button title="Uložit" onPress={() => this.saveBet(match)} />
                </View>
              )}
            </Card>
          ))}
        </ScrollView>

        {<ModalFilterPicker
            visible={this.state.playersVisible}
            options={this.getPlayers().map(player => {
              return {key: player.id, label: `${player.player.firstName} ${player.player.lastName} ${player.leagueTeam.team.shortcut}`
            }})}
            onSelect={(value) => {
              this.setState({ playersVisible: false })
              this.handleBetChange(value, 1)
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
                this.handleBetChange(value, 2)
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
