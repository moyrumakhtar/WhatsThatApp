import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Component } from 'react';

import SignUpscreen from './screens/signupscreen';
import LogInscreen from './screens/loginscreen';

import ChatsScreen from "./screens/chatsscreen";
import SettingsScreen from './screens/settingsscreen';
import ContactsScreen from './screens/contactsscreen';
import BlockScreen from './screens/blockusersscreen';
import Editscreen from './screens/editscreen';
import SingleChatScreen from './screens/singlechatscreen';

const tabNav = createBottomTabNavigator();
const stackNav = createNativeStackNavigator();

function chatStack() {
  return (
    <stackNav.Navigator
    initialRouteName="chats">
      <stackNav.Screen name="chats" component={ChatsScreen} options={{ headerShown: false }}/>
      <stackNav.Screen name="singleChat" component={SingleChatScreen} options={{ headerShown: false }}/>
    </stackNav.Navigator>
  )
}

function settingStack() {
  return (
    <stackNav.Navigator
    initialRouteName="setting">
      <stackNav.Screen name="settings" component={SettingsScreen} options={{ headerShown: false }}/>
      <stackNav.Screen name="edit" component={Editscreen} options={{ headerShown: false }}/>
    </stackNav.Navigator>
  )
}

function contactStack() {
  return (
    <stackNav.Navigator
    initialRouteName="contacts">
      <stackNav.Screen name="contacts" component={ContactsScreen} options={{ headerShown: false }}/>
      <stackNav.Screen name="blocked" component={BlockScreen} options={{ headerShown: false }}/>
    </stackNav.Navigator>
  )
}

function mainTabs() {
  return (

    <tabNav.Navigator 
      initialRouteName="chats"
      screenOptions={({ route }) => ({
        tabBarStyle: { height: 70 },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "chats") {
            return (
              <Ionicons name={focused
                ? "chatbubbles" : "chatbubbles"}
                size={30}
                color={color}
              />
            );
          }
          else if (route.name === "settings") {
            return (
              <Ionicons name={focused
                ? "settings" : "settings"}
                size={30}
                color={color}
              />
            );
          }
          else if (route.name === "contacts") {
            return (
              <FontAwesome name={focused
                ? "address-book" : "address-book"}
                size={30}
                color={color}
              />
            );
          }
        },
        
        tabBarInactiveTintColor: '#C0C0C0',
        tabBarActiveTintColor: '#14c83c',
        headerShown: false,

      })}
    >
      <tabNav.Screen name="contacts" component={contactStack} />
      <tabNav.Screen name="chats" component={chatStack} />
      <tabNav.Screen name="settings" component={settingStack} />
    </tabNav.Navigator>

  )
}

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <stackNav.Navigator initialRouteName="main">
          <stackNav.Screen name="signup" component={SignUpscreen} options={{ headerShown: false }} />
          <stackNav.Screen name="login" component={LogInscreen} options={{ headerShown: false }} />
          <stackNav.Screen name="main" component={mainTabs} options={{ headerShown: false }} />
        </stackNav.Navigator>
      </NavigationContainer>
    )
  }
}