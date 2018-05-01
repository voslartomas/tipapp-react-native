import React, { Component } from 'react';
import {DrawerNavigator} from 'react-navigation';
import ScreenComponent from './components/screen.component';
import MainComponent from './components/main.component';

export default (logout) => {
  // load leagues from API /api/leagues/active
  const leagues = [{id: 1, name: 'NHL 18'}, {id: 2, name: 'MS Rusko 18'}]

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
