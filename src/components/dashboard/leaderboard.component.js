import React from 'react';
import { View, Text } from 'react-native'
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


  async componentDidMount() {
    const leaderboard = await LeagueService.getLeaderboard(this.props.leagueId)

    this.setState({
      leaderboard
    })
  }

  render() {
    return(
      <View style={styles.container}>
        {this.state.leaderboard.map((player, i) => (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.normalText}>{i+1}.</Text>
            <Text style={styles.normalText}>{player.firstName} {player.lastName}</Text>
            <Text style={styles.normalText}>{player.totalPoints}</Text>
          </View>
        ))}
      </View>
    );
  }

}
