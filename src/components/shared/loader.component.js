import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import styles from '../../styles'

export default class LoaderComponent extends React.Component {
  render() {
    return <ActivityIndicator size="large" color="#f3d827" />
  }
}
