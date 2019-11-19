import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default class Chat extends Component {
  //so that user name appear at the top of chat page
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };

  //render components
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.color }]}>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
