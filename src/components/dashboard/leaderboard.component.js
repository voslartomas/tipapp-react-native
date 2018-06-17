import React from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native'
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
   let position

   if (index === 0) {
     position = index + 1
   }

   if (previousPlayer && player.totalPoints === previousPlayer.totalPoints) {
     position = previousPosition
   } else {
     position = index + 1
   }

   this.state.previousPlayer = player
   this.state.previousPosition = position
   return position
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
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.normalText}>{this.getPosition(player, i)}.</Text>
              <Text style={styles.normalText}>{player.firstName} {player.lastName}</Text>
              <Text style={styles.normalText}>{player.totalPoints}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

}
