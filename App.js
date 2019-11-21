import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
//for pushing app content above keyboard
import KeyboardSpacer from 'react-native-keyboard-spacer'


// Create the navigator
const navigator = createStackNavigator({
    Start: { screen: Start},
    Chat: { screen: Chat}
});

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component
export default navigatorContainer;
