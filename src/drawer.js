import React, { Component } from 'react';
import {DrawerNavigator} from 'react-navigation';
import MainComponent from './components/main.component';
import LeagueService from './services/league.service';
import LogoutComponent from './components/logout.component';
import ProfileComponent from './components/account/profile.component';
import UserFormComponent from './components/account/userForm.component';
import BetsSerieComponent from './components/dashboard/bets.serie.component';

export default async (logout) => {
  const leagues = await LeagueService.getLeagues()

  const items = {}
  leagues.forEach(league => {
    const main = MainComponent(league)
    items[`${league.league.name}`] = {
      screen: main
    }
  })

  items.logout = {
    screen: props => <LogoutComponent {...props} logout={logout} />,
    navigationOptions: {
      title: 'Logout',
    },
  }

  items.profile = {
    screen: ProfileComponent,
    navigationOptions: {
      title: 'Profile',
    },
  }

  items.test = {
    screen: UserFormComponent,
    navigationOptions: {
      title: 'USERFORM',
    },
  }

  items.blemc = {
    screen: BetsSerieComponent,
    navigationOptions: {
      title: 's00s',
    },
  }

  return DrawerNavigator(
    items,
    {
      // initialRouteName: 'First',
      drawerPosition: 'left'
    }
  );
}
