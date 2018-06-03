import React, { Component } from 'react';
import BetsMatchComponent from './dashboard/bets.match.component';
import BetsSerieComponent from './dashboard/bets.serie.component';
import { TabNavigator } from 'react-navigation';

export default (league) => {
  return TabNavigator({
    Matches: {screen: props => <BetsMatchComponent leagueId={league.leagueId} />},
    Series: {screen: props => <BetsSerieComponent leagueId={league.leagueId}/>}
  })
}