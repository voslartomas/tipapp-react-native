import React from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native'
import styles from '../../styles'
import LeagueService from '../../services/league.service'

export default class LeaderboardComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      leaderboard: [],
      loading: true
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
              <Text style={styles.normalText}>{i+1}.</Text>
              <Text style={styles.normalText}>{player.firstName} {player.lastName}</Text>
              <Text style={styles.normalText}>{player.totalPoints}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

}
