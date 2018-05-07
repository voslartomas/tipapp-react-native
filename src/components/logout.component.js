import React, { Component } from 'react'
import { Text } from 'react-native'

export default class LogoutComponent extends React.Component {
  render() {
    this.props.logout()

    return (<Text></Text>)
  }
}
