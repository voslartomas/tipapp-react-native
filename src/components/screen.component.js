import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import MatchService from '../services/match.service';
import { Text, Button, Card } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class ScreenComponent extends Component {

  static navigationOptions = {
    tabBarLabel: 'Screen',
    drawerIcon: ({tintColor}) => {
      return (
        <MaterialIcons name="card-membership" size={24} style={{color: tintColor}} ></MaterialIcons>
      );
    }
  };

  render() {
    return (
      <View>
        <Text>SCREEN 1 BOII</Text>
      </View>
    );
  }
}
