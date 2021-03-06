/**
* @class CustomActions
* @requires prop-types
* @requires react
* @requires react-native
* @requires expo-permissions
* @requires expo-image-picker
* @requires expo-location
* @requires firebase
* @requires firestore
*/
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

//import firebase/firestore
import firebase from "firebase";
import "firebase/firestore";


// create CustomActions class
export default class CustomActions extends Component {

  /**
    * lets user pick an image from their device's image library to send
    * @function pickImage
  */
  pickImage = async () => {
      try {
        //get Permission to access CAMERA_ROLL
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        //IF permission is granted contiue
        if (status === 'granted') {
          // let user pick an image
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, //only images are allowed
          }).catch(error => console.log(error));

          //check if user cancelled image selection
          if (!result.cancelled) {
            //if not send picked image
            const imageUrl = await this.uploadImage(result.uri);
            this.props.onSend({ image: imageUrl })
          }
        }
      } catch (error) {
      console.log(error.message)
    }
  }

  /**
    * lets user take photo to send
    * @function takePhoto
  */
  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl })
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
    * gets and sends user's location
    * @function getLocation
  */
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status === 'granted') {
        let result = await Location.getCurrentPositionAsync({}).catch(error => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            }
          })
        }
      }
    }catch (error) {
      console.log(error.message)
    }
  }

  /**
    * uploads user's image to cloud storage
    * @function uploadImage
  */
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      //this will make a unique file name for each image uploaded
      let uriParts = uri.split('/')
      let imageName = uriParts[uriParts.length - 1]

      const ref = firebase.storage().ref().child(`${imageName}`)
      const snapshot = await ref.put(blob);
      blob.close();
      const imageUrl = await snapshot.ref.getDownloadURL();
      return imageUrl;
    }catch (error) {
      console.log(error.message)
    }
  }


  /**
    * adds list of options for actions
  */
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a picture');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    )
  }

  render() {
    /**
    * UI for bringing up the list of actions
    */
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

/**
* styles section
*/
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
