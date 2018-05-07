import React, { Component } from 'react';
import {DrawerNavigator} from 'react-navigation';
import MainComponent from './components/main.component';
import LeagueService from './services/league.service';
import LogoutComponent from './components/logout.component';

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
    screen: props => <LogoutComponent {...props} logout={logout} />
  }

  return DrawerNavigator(
    items,
    {
      // initialRouteName: 'First',
      drawerPosition: 'left'
    }
  );
}
