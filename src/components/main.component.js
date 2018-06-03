import React, { Component } from 'react';
import LeaderboardComponent from './dashboard/leaderboard.component';
import DashboardComponent from './dashboard/dashboard.component'

import { TabNavigator } from 'react-navigation';

export default (league) => {
  return TabNavigator({
    Dashboard: {screen: props => <DashboardComponent leagueId={league.leagueId} />},
    Leadeboard: {screen: props => <LeaderboardComponent leagueId={league.leagueId} />},
  })
}
