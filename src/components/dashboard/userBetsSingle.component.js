import React from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native'
import styles from '../../styles'
import Loader from '../shared/loader.component'
import LeagueService from '../../services/league.service'

export default class UserBetsSingleComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      singles: []
    }
  }

  async load() {
    const { leagueId, single } = this.props.navigation.state.params

    const singles = await LeagueService.getUserBetsSingle(leagueId, single.leagueSpecialBetSingleId)
    console.log(singles)
    this.setState({
      singles,
      single
    })
  }

  async componentDidMount() {
    this.setState({ loading: true })
    await this.load()
    this.setState({ loading: false })
  }

  getBet(single) {
    if (single.teamResult) {
      return single.teamResult.team.name
    } else if (single.playerResult) {
      return `${single.playerResult.player.firstName} ${single.playerResult.player.lastName}`
    } else {
      return single.value
    }
  }

  render() {
    if (this.state.loading) {
      return <Loader />
    }

    const { single } = this.state

    return(
      <View style={styles.container}>
        <Text style={Object.assign({}, styles.normalText, { color: styles.secondary, padding: 10 })}>{single.name}</Text>
        <ScrollView>
          {this.state.singles.sort((a, b) => {
            return a.totalPoints > b.totalPoints ? -1 : 1
          }).map(single => (
            <View>
              <Text style={Object.assign({}, styles.normalText, { textAlign: 'left' })}>{single.leagueUser.user.firstName} {single.leagueUser.user.lastName}</Text>
              <Text style={Object.assign({}, styles.smallText, { textAlign: 'right' })}>{this.getBet(single)}</Text>
              <Text style={Object.assign({}, styles.smallText, { textAlign: 'right' })}>Body {single.totalPoints}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

}
