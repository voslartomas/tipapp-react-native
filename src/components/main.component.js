import React, { Component } from 'react';
import LeaderboardComponent from './dashboard/leaderboard.component';
import BetsMatchComponent from './dashboard/bets.match.component';
import BetsSerieComponent from './dashboard/bets.serie.component';
import { TabNavigator } from 'react-navigation';

export default (league) => {
  return TabNavigator({
    Dashboard: {screen: props => <BetsMatchComponent leagueId={league.leagueId} />},
    Series: {screen: props => <BetsSerieComponent leagueId={league.leagueId}/>},
    Leadeboard: {screen: props => <LeaderboardComponent leagueId={league.leagueId} />},
  })
}
