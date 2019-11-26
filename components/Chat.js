import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, FlatList } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
//import firebase/firestore
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends Component {
  constructor(){
    super();

    if (!firebase.apps.length) {
      firebase.initializeApp({
        // insert Firestore database credentials
        apiKey: "AIzaSyAH5h9Q4oHBTRP5LXyUnXhsgaknTkZvR0M",
        authDomain: "chat-app-8b3d3.firebaseapp.com",
        databaseURL: "https://chat-app-8b3d3.firebaseio.com",
        projectId: "chat-app-8b3d3",
        storageBucket: "chat-app-8b3d3.appspot.com",
        messagingSenderId: "206129711393",
        appId: "1:206129711393:web:fc0e32f62be40e5c7c1660",
        measurementId: "G-JQZPWH8VTK"
      });
    }

    this.referenceChatUser = null;

    this.referenceMessages = firebase.firestore().collection('messages');

    this.state = {
      messages: [],
      uid: '',
      loggedInText: 'Stand by, logging-in.',
    };
  }

  //so that user name appear at the top of chat page
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };

  get user() {
    return {
      name: this.props.navigation.state.params.userName,
      _id: this.state.uid,
      id: this.state.uid,
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach(doc => {
      // get QueryDocumentSnapshot data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages
    });
  };

//to save a message object to Firestore.
  addMessage() {
    console.log(this.state.messages[0].user)
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
    });
  }

  //when send button is pressed, new messages are appended to old ones
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessage();
      }
    );
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Welcome!',
      });

      // create a reference to the active user's documents (messages)
      this.referenceChatUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);

      // listen for collection changes for current user
      this.unsubscribeMessageUser = this.referenceChatUser.onSnapshot(this.onCollectionUpdate);



      // listen for changes
      this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate)
    });

    this.setState({
      messages: [
        {
          _id: 2,
          text: this.props.navigation.state.params.userName + ' has entered the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  componentWillUnmount() {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      //this.unsubscribeMessageUser();
      this.unsubscribe();
    }

//render the bubble and apply color to it
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6f9dab'
          }
        }}
      />
    )
  }

  //render components
  render() {
    return (
      <View style={{flex: 1, backgroundColor: this.props.navigation.state.params.color}}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            inverted={false}
            onSend={messages => this.onSend(messages)}
            user={this.state.user}
          />
          {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',

  }
});
