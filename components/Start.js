import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      color: ''
    }
 }

  render() {
    return (
      // app container
      <View style={styles.container}>
          {/* background image */}
        <ImageBackground
          source={require("../assets/backgroundImage.png")}
          style={styles.backgroundImage}>

          {/* app title */}
          <Text style={styles.appTitle}>Nat-Chat</Text>

          {/* user chat inner container */}
          <View style={styles.innerContainer}>
          {/* user name input */}
            <TextInput
              style={styles.nameInput}
              onChangeText={(userName) => this.setState({userName})}
              value={this.state.userName}
              placeholder='   Your name'
            />
            <Text style={styles.chooseBackgroundColorText}>Choose Background Color</Text>

            <View style={styles.backgroundColorContainer}>{/* background color selection */}
              {/* black */}
              <TouchableOpacity
                onPress={() => this.setState({ color: '#090C08' })}
                style={[styles.backgroundColors, styles.black]}
              />
              {/* purple */}
              <TouchableOpacity
                onPress={() => this.setState({ color: '#474056' })}
                style={[styles.backgroundColors, styles.purple]}
              />
              {/* gray */}
              <TouchableOpacity
                onPress={() => this.setState({ color: '#8A95A5' })}
                style={[styles.backgroundColors, styles.gray]}
              />
              {/* green */}
              <TouchableOpacity
                onPress={() => this.setState({ color: '#B9C6AE' })}
                style={[styles.backgroundColors, styles.green]}
              />
              </View>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => this.props.navigation.navigate('Chat', { userName: this.state.userName, color: this.state.color })}
              >
              <Text style={styles.chattingText}>Start chatting</Text>
              </TouchableOpacity>
            </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%'
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    appTitle: {
        marginTop: '20%',
        color: '#FFFFFF',
        fontSize: 45,
        fontWeight: '600'
    },
    innerContainer: {
        width: '88%',
        height: '44%',
        backgroundColor: 'white',
        marginBottom: '6%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    nameInput: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '300',
        color: '#000',
        width: '88%',
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        opacity: 0.8
    },
    backgroundColorContainer: {
        width: '88%',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    chooseBackgroundColorText: {
        fontSize: 15,
        fontWeight: '300',
        color: '#757083',
        opacity: 1.0,
        marginTop: 10
    },
    backgroundColors: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        margin: 10
    },

    black: {
      backgroundColor: '#090C08'
    },

    purple: {
      backgroundColor: '#474056'
    },

    gray: {
      backgroundColor: '#8A95A5'
    },

    green: {
      backgroundColor: '#B9C6AE'
   },

    chatButton: {
        color:'#757083',
        textAlign: 'center',
        width: '88%',
        backgroundColor: '#757083',
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    chattingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
  });
