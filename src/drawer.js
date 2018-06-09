import React, { Component } from 'react';
import {DrawerNavigator} from 'react-navigation';
import MainComponent from './components/main.component';
import LeagueService from './services/league.service';
import LogoutComponent from './components/logout.component';
import ProfileComponent from './components/account/profile.component';
import UserFormComponent from './components/account/userForm.component';
import BetsSerieComponent from './components/dashboard/bets.serie.component';
import styles from './styles'

export default async (logout) => {
  const leagues = await LeagueService.getLeagues()

  const items = {}
  leagues.forEach(league => {
    const main = MainComponent(league)
    items[`${league.league.name}`] = {
      screen: main
    }
  })

  items.profile = {
    screen: ProfileComponent,
    navigationOptions: {
      title: 'Profile',
    },
  }

  items.logout = {
    screen: props => <LogoutComponent {...props} logout={logout} />,
    navigationOptions: {
      title: 'Logout',
    },
  }

  return DrawerNavigator(
    items,
    {
      // initialRouteName: 'First',
      drawerPosition: 'left',
      drawerBackgroundColor: styles.primary,
      contentOptions: {
        inactiveTintColor: 'white'
      }
    }
  );
}
