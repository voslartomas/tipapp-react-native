import React from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../../styles'
import LeagueService from '../../services/league.service'

export default class LeaderboardComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      leaderboard: [],
      loading: true,
      previousPlayer: undefined,
      previousPosition: 0
    }
  }

  async load() {
    const leaderboard = await LeagueService.getLeaderboard(this.props.leagueId)
    console.log(leaderboard)
    this.setState({
      leaderboard
    })
  }

  async componentDidMount() {
    this.load()
  }

  _onRefresh() {
   this.setState({refreshing: true});
    this.load().then(() => {
     this.setState({refreshing: false});
   });
 }

 getPosition(player, index) {
   const previousPosition = this.state.previousPosition
   const previousPlayer = this.state.previousPlayer
   let position, positionToShow

   if (index === 0) {
     position = index + 1
   }

   if (previousPlayer && player.totalPoints === previousPlayer.totalPoints) {
     positionToShow = ''
   } else {
     positionToShow = index + 1 + '.'
   }

   this.state.previousPlayer = player
   this.state.previousPosition = position
   return positionToShow
 }

 getPlayerName(player) {
   const name = `${player.firstName} ${player.lastName}`

   return name.slice(0, 34)
 }

 isBeerPosition(i) {
  return i > this.state.leaderboard.length-3
 }

 getPositionStyle(i) {
   const positionStyles = [{}, styles.normalText]

   if (this.isBeerPosition(i)) {
    positionStyles.push({color: 'brown'})
   }

   if (i === 0) {
    positionStyles.push({color: 'gold'})
   }

   if (i === 1) {
    positionStyles.push({color: 'silver'})
   }

   if (i >= 2 && i < 4) {
    positionStyles.push({color: 'rgb(205, 127, 50)'})
   }

   return positionStyles
 }

  render() {
    return(
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        >
          {this.state.leaderboard.map((player, i) => (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', borderBottomColor: 'grey', borderBottomWidth: 1}}>
              <Text style={Object.assign(...this.getPositionStyle(i), {width: 50, textAlign: 'left', paddingLeft: 12})}>{this.getPosition(player, i)}</Text>
              <Text style={Object.assign(...this.getPositionStyle(i), {flex: 1, textAlign: 'left', paddingLeft: 10})}>
                {this.getPlayerName(player)} {this.isBeerPosition(i) && <Icon name="beer" size={20} color="gold" />}
              </Text>
              <Text style={Object.assign(...this.getPositionStyle(i), {textAlign: 'right', paddingRight: 10})}>{player.totalPoints}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

}
