import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, AsyncStorage, NetInfo } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';
import KeyboardSpacer from 'react-native-keyboard-spacer';
//import firebase/firestore
const firebase = require('firebase');
require('firebase/firestore');
//import CustomActions
import CustomActions from './CustomActions';


export default class Chat extends Component {
  constructor(){
    super();

    /**
        * firestore credentials
        * @param {string} apiKey
        * @param {string} authDomain
        * @param {string} databaseURL
        * @param {string} projectId
        * @param {string} storageBucket
        * @param {string} messageSenderId
        * @param {string} appId
        * @param {string} measurementId
    */

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
      isConnected: false,
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
    };
  }

  //so that user name appear at the top of chat page
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };

  /**
    * set default values for user
    * @function setUser
    * @params {string} _id
    * @params {string} name
    * @params {string} avatar
    * called in componentWillMount()
    */
  setUser = (_id, name = 'Guest', avatar = 'https://placeimg.com/140/140/any') => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: avatar,
      }
    })
  }

  /**
    * updates state whenever firestore collection is updated
    * @function onCollectionUpdate
    * @param {string} _id
    * @param {string} text
    * @param {date} createdAt
    * @param {object} user
    * @param {string} image
    * @param {location} location
  */
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
        image: data.image || '',
        location: data.location || null,
      });
    });
    this.setState({
      messages
    });
  };

  /**
    * Adds message to firestore reference database
    * @type {string} _id
    * @type {sting} text
    * @type {date} createdAt
    * @type {object} user
    * @type {string} image url
    * @type {location} location
    * adds all data to firestore
  */
  addMessage() {
    console.log(this.state.messages[0].user)
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid,
     image: this.state.messages[0].image || '',
     location: this.state.messages[0].location || null,
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
        this.saveMessages();
      }
    );
  }

  // async functions
  /**
  * loads all messages from async storage
  * @function getMessages
  * @async
  * @return {Promise<string>} the data from the storage
  */
  getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
      }
  };
  /**
    * saves messages to AsyncStorage
    * @function saveMessages
    * @async
    * @return {Promise<string>} The data will be saved to storage
  */
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
    * deletes messages from AsyncStorage
    * not currently used in app
    * @function deleteMessage
    * @async
    * @return {Promise<string>} The data will deleted from storage
  */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }


  /**
    * NetInfo checks if user is online and sets state appropriately
    * firebase uses anonymous authentication
    * subscribes authenticated user to firestore collection
    * retrieves messages in firestore
  */
  componentDidMount() {
      //checks if user is on or offline
      NetInfo.isConnected.fetch().then(isConnected => {
        //IF the user is ONLINE
        if (isConnected) {
          console.log('online');
          this.setState({
            isConnected: true,
          })
          //authenticate user via firebase
          this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            //update with current user data
            if (!this.props.navigation.state.params.name) {
            this.setUser(user.uid);
            this.setState({
              uid: user.uid,
              loggedInText: "Welcome!"
            });
          } else {
            this.setUser(user.uid, this.props.navigation.state.params.name)
            this.setState({
              uid: user.uid,
              loggedInText: "Welcome!"
            });
          }
          /*
            this.setState({
              uid: user.uid,
              user: {
                _id: user.uid,
                name: this.props.navigation.state.params.userName,
                avatar: 'https://placeimg.com/140/140/any',
              },
              loggedInText: 'Welcome!'
            });*/

            // create a reference to the active user's documents (messages)
            //this.referenceChatUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);

            // listen for collection changes for current user
            //this.unsubscribeMessageUser = this.referenceChatUser.onSnapshot(this.onCollectionUpdate);

            // listen for changes
            this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate)
          });


          //IF the user is OFFLINE
        } else {
          console.log('offline');
          this.setState({
            isConnected: false,
          });
          //get messages from async storage
          this.getMessages();
        }

});
    /*
    this.setState({
      messages: [
        {
          _id: 'msg0',
          text: this.props.navigation.state.params.userName + ' has entered the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    }) */
  }

  componentWillUnmount() {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribe(); //this.unsubscribeMessageUser();
    }

//GiftedChat functions
  /**
    * GiftedChat render bubble
    * @function renderBubble
    * sets the background color of message bubbles
  */
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

    /**
    * don't display toolbar if the user is offline
    * @function renderInputToolbar
    */  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      )
    }
  }

  /**
    * CustomActions from the CustomActions component
  */
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };


  /**
    * renders map view for user to share location
  */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }


  //render components
  render() {
    /**
    * user's name and choosen background color from start screen
    */
    return (
      <View style={{flex: 1, backgroundColor: this.props.navigation.state.params.color}}>
          <GiftedChat
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderBubble={this.renderBubble.bind(this)}
            renderActions={this.renderCustomActions.bind(this)}
            renderCustomView={this.renderCustomView.bind(this)}
            messages={this.state.messages}
            //inverted={false}
            onSend={messages => this.onSend(messages)}
            user={this.state.user}
          />
          {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    );
  }
};


/**
* styles section
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',

  }
});
