import React, { Component } from 'react';
import LeaderboardComponent from './dashboard/leaderboard.component';
import DashboardComponent from './dashboard/dashboard.component'
import BetsMatchComponent from './dashboard/bets.match.component';
import BetsSerieComponent from './dashboard/bets.serie.component';
import BetsSpecialComponent from './dashboard/bets.special.component';
import UserBetsMatchComponent from './dashboard/userBetsMatch.component'
import UserBetsSingleComponent from './dashboard/userBetsSingle.component'
import UserBetsSerieComponent from './dashboard/userBetsSerie.component'
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

export default (league, setNavigation) => {

  const menuOptions = {
    Matches: {
      screen: props => <BetsMatchComponent setNavigation={setNavigation} {...props} leagueId={league.leagueId} />,
      navigationOptions: {
        title: 'Zápasy'
      }
    },
    Series: {
      screen: props => <BetsSerieComponent {...props} leagueId={league.leagueId}/>,
      navigationOptions: {
        title: 'Série'
      }
    },
    Singles: {
      screen: props => <BetsSpecialComponent {...props} leagueId={league.leagueId}/>,
      navigationOptions: {
        title: 'Speciální'
      }
    },
  }

  const leaguesWithSeries = [7, 8]
  const menu = leaguesWithSeries.includes(league.leagueId) ? 
  { Matches: menuOptions.Matches, Series: menuOptions.Series, Singles: menuOptions.Singles } : 
  { Matches: menuOptions.Matches, Singles: menuOptions.Singles }

  return StackNavigator({
    Home: {
      screen: TabNavigator({
        Dashboard: {
          screen: TabNavigator(menu, dashboardOptions),
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
  UserBetsSerie: {
    screen: props => <UserBetsSerieComponent {...props} />
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
