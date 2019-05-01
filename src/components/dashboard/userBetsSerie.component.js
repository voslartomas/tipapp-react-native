import React from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native'
import styles from '../../styles'
import Loader from '../shared/loader.component'
import LeagueService from '../../services/league.service'

export default class UserBetsSerieComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      bets: []
    }
  }

  async load() {
    const { leagueId, serie } = this.props.navigation.state.params
    const bets = await LeagueService.getUserBetsSerie(leagueId, serie.leagueSpecialBetSerieId)
    this.setState({
      bets,
      serie
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

    const { serie } = this.state

    return(
      <View style={styles.container}>
        <Text style={Object.assign({}, styles.normalText, { color: styles.secondary, padding: 10 })}>{serie.homeTeam} {serie.serieHomeScore || '0'}:{serie.serieAwayScore  || '0'} {serie.awayTeam}</Text>
         <ScrollView>
          {this.state.bets.sort((a, b) => {
            return a.totalPoints > b.totalPoints ? -1 : 1
          }).map(match => (
             <View>
              <Text style={Object.assign({}, styles.normalText, { textAlign: 'left', paddingLeft: 12 })}>{match.leagueUser.user.firstName} {match.leagueUser.user.lastName}</Text>
              <Text style={Object.assign({}, styles.smallText, { textAlign: 'right', paddingRight: 12 })}>{match.homeTeamScore}:{match.awayTeamScore}</Text>
              <Text style={Object.assign({}, styles.smallText, { textAlign: 'right', paddingRight: 12 })}>Body {match.totalPoints}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

}
