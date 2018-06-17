import React, { Component } from 'react';
import LeaderboardComponent from './dashboard/leaderboard.component';
import DashboardComponent from './dashboard/dashboard.component'
import BetsMatchComponent from './dashboard/bets.match.component';
import BetsSerieComponent from './dashboard/bets.serie.component';
import BetsSpecialComponent from './dashboard/bets.special.component';
import UserBetsMatchComponent from './dashboard/userBetsMatch.component'
import UserBetsSingleComponent from './dashboard/userBetsSingle.component'
import styles from '../styles'
import { TabNavigator, StackNavigator } from 'react-navigation';

const dashboardOptions = {
  lazy: true,
  tabBarPosition: 'top',
  tabBarOptions: {
    activeTintColor: styles.secondary,
    inactiveTintColor: 'white',
    style: {
      backgroundColor: styles.primary,
      color: 'black',
    },
  },
}
const mainOptions = Object.assign({}, dashboardOptions)
mainOptions.tabBarPosition = 'bottom'

export default (league) => {
  return StackNavigator({
    Home: {
      screen: TabNavigator({
        Dashboard: {
          screen: TabNavigator({
            Matches: {
              screen: props => <BetsMatchComponent {...props} leagueId={league.leagueId} />,
              navigationOptions: {
                title: 'Zápasy'
              }
            },
            /*Series: {
              screen: props => <BetsSerieComponent leagueId={league.leagueId}/>,
              navigationOptions: {
                title: 'Série'
              }
            },*/
            Singles: {
              screen: props => <BetsSpecialComponent {...props} leagueId={league.leagueId}/>,
              navigationOptions: {
                title: 'Speciální'
              }
            },
        },
        dashboardOptions),
        navigationOptions: {
          title: 'Tipy'
        }
      },
      Leadeboard: {
        screen: props => <LeaderboardComponent leagueId={league.leagueId} />,
        navigationOptions: {
          title: 'Žebříček'
        }
      },
    }, mainOptions)
  },
  UserBetsMatch: {
    screen: props => <UserBetsMatchComponent {...props} />
  },
  UserBetsSingle: {
    screen: props => <UserBetsSingleComponent {...props} />
  },
  }, {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none',
  })
}
