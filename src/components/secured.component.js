import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Button } from 'react-native';
import { Text, Card } from 'react-native-elements';
import drawer from '../drawer'

export default class SecuredComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      drawer: undefined
    }

    drawer(this.props.logout, this.props.setNavigation).then(drawer => {
      this.setState({drawer})
    })
  }

  render() {
    if (this.state.drawer) {
      return <this.state.drawer />
    }

    return (<View></View>)
  }
}
