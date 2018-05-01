import React, { Component } from 'react';
import {DrawerNavigator} from 'react-navigation';
import ScreenComponent from './components/screen.component';
import MainComponent from './components/main.component';
import LeagueService from './services/league.service';

export default async (logout) => {
  // load leagues from API /api/leagues/active
  const leagues = await LeagueService.getLeagues();

  const items = {}
  leagues.forEach(league => {
    items[`${league.name}`] = {
      screen: props => <MainComponent {...props} logout={logout} leagueId={league.id} />
    }
  })


  items.logout = {
    screen: props => <MainComponent {...props} logout={logout} redirectLogout={true} />
  }

  return DrawerNavigator(
    items,
    {
      // initialRouteName: 'First',
      drawerPosition: 'left'
    }
  );
}
