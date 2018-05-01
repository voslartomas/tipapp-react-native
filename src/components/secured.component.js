import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import MatchService from '../services/match.service';
import { Text, Button, Card } from 'react-native-elements';
import drawer from '../drawer'

export default class SecuredComponent extends Component {

  render() {
    const Secured = drawer(this.props.logout)
    return (
      <Secured/>
    );
  }
}
