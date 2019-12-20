# Introduction
Nat-chat is a chat app just like any other chat app. It was built with React-Native. The basic functionalities of this app include logging in, sending text messages, pictures, and sharing users' location. One of the features include chat screen colour customization. 


# Getting started
The two basic things you need you run this app is to install Expo and create a Firbase account.


## Expo
First install Expo by running:

`npm install expo-cli -g`

Then download the Expo App to your smartphone. More [details](https://expo.io) on Expo.


## Firebase
Create a Firebase [account](https://firebase.google.com) for data storage with the instructions below. 

1. go [https://firebase.google.com/](https://firebase.google.com/)

2. sign into your google account

3. click "Go to console"

4. click "add project"

5. follow onscreen instructions until it says "creating your project"

6. click "database" on the Develop tab 

7. click "Create Database" and select "start in test mode"

8. click "start collection" and name it "messages" and then press "auto id" and confirm on the following screen

9. click "Authentication", "set up sign-in method" and enable anonymous authentication

10. click "storage" to set up cloud storage</br>

11. click the gear just above the Develop tab, and select "project settings"

12. Click the button that will add Firebase to a web app, name it, and copy everything in the firebaseConfig and paste into the Chat.js file.

See the firebase [documentation](https://firebase.google.com/docs) for more information. Pay particular attention to the section on on how to initializing Cloud Firestore with your individual credentials.


# Library
[GiftedChat](https://github.com/FaridSafi/react-native-gifted-chat)


# Modules
run `npm install` to install all the modules:

* "expo": "^35.0.0",
* "expo-image-picker": "^7.0.0",
* "expo-location": "^7.0.0",
* "expo-permissions": "^7.0.0",
* "firebase": "^7.2.0",
* "prop-types": "^15.7.2",
* "react": "16.8.3",
* "react-dom": "16.8.3",
* "react-native": "https://github.com/expo/react-native/archive/sdk-35.0.0.tar.gz",
* "react-native-gesture-handler": "^1.4.1",
* "react-native-gifted-chat": "^0.11.0",
* "react-native-keyboard-spacer": "^0.4.1",
* "react-native-maps": "^0.26.1",
* "react-native-web": "^0.11.7",
* "react-navigation": "^4.0.10",
* "react-navigation-stack": "^1.9.3"


# Run
Start the app by running:

`npm start` or `expo start`

from your project folder.

The app will launch DevTools on port 19002. You can then run the app on a physical device or emulator by scanning the QR code.

For information on how to set up an emulator for testing, you  [visit](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/). 

Then press "Run on Android device/emulator" in the DevTools to launch the app on your emulator.




[Kanban board](https://trello.com/b/YPTtvu1G/chat-app)
