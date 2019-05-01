import React from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native'
import styles from '../../styles'
import Loader from '../shared/loader.component'
import LeagueService from '../../services/league.service'

export default class UserBetsMatchComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      matches: []
    }
  }

  async load() {
    const { leagueId, match } = this.props.navigation.state.params
    const matches = await LeagueService.getUserBetsMatch(leagueId, match.matchId1)

    this.setState({
      matches,
      match
    })
  }

  async componentDidMount() {
    this.setState({ loading: true })
    await this.load()
    this.setState({ loading: false })
  }

  render() {
    if (this.state.loading) {
      return <Loader />
    }

    const { match } = this.state

    return(
      <View style={styles.container}>
        <Text style={Object.assign({}, styles.normalText, { color: styles.secondary, padding: 10 })}>{match.homeTeam} {match.matchHomeScore}:{match.matchAwayScore}{match.matchOvertime ? 'P' : ''} {match.awayTeam}</Text>
        <ScrollView>
          {this.state.matches.sort((a, b) => {
            return a.totalPoints > b.totalPoints ? -1 : 1
          }).map(match => (
            <View>
              <Text style={Object.assign({}, styles.normalText, { textAlign: 'left', paddingLeft: 12 })}>{match.user.user.firstName} {match.user.user.lastName}</Text>
              <Text style={Object.assign({}, styles.smallText, { textAlign: 'right', paddingRight: 12 })}>{match.homeScore}:{match.awayScore}{match.overtime ? 'P' : ''}</Text>
              <Text style={Object.assign({}, styles.smallText, { textAlign: 'right', paddingRight: 12 })}>
                {match.scorer && match.scorer.player.firstName} {match.scorer && match.scorer.player.lastName}
                {!match.scorer && <Text>Žádný tip</Text>}
                </Text>
              <Text style={Object.assign({}, styles.smallText, { textAlign: 'right', paddingRight: 12 })}>Body: {match.totalPoints}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

}
