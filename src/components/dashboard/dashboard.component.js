import React, { Component } from 'react';
import BetsMatchComponent from './bets.match.component';
import BetsSerieComponent from './bets.serie.component';
import { TabNavigator } from 'react-navigation';

export default () => {
  return TabNavigator({
    Matches: {screen: props => <BetsMatchComponent leagueId={this.props.leagueId} />},
    Series: {screen: props => <BetsSerieComponent leagueId={this.props.leagueId}/>}
  })
}