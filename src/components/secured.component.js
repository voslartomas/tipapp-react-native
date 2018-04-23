import React, { Component } from 'react'
import { View, Text } from 'react-native';

export default class SecuredComponent extends Component {

  constructor(props) {
    super(props)

    this.state = {
      fontLoaded: false,
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <View>
        <Text>HELLO</Text>
      </View>
    );
  }

}