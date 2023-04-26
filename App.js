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

const tabNav = createBottomTabNavigator();
const stackNav = createNativeStackNavigator();

function mainTabs() {
  return (

    <tabNav.Navigator
      initialRouteName='contacts'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "chats") {
            return (
              <Ionicons name={focused
                ? 'chatbubbles' : 'chatbubbles'}
                size={size}
                color={color}
              />
            );
          }
          else if (route.name === "settings") {
            return (
              <Ionicons name={focused
                ? 'settings' : 'settings'}
                size={size}
                color={color}
              />
            );
          }
          else if (route.name === "contacts") {
            return (
              <FontAwesome name={focused
                ? 'address-book' : 'address-book'}
                size={size}
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
      <tabNav.Screen name="contacts" component={ContactsScreen} />
      <tabNav.Screen name="chats" component={ChatsScreen} />
      <tabNav.Screen name="settings" component={SettingsScreen} />
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