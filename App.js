import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Component } from 'react';

import signupscreen from './screens/signupscreen';

const stackNav = createNativeStackNavigator();
const tabNav = createBottomTabNavigator();

export default class App extends Component()
{
  render() {
    return (
      <NavigationContainer>
        <stackNav.Navigator initialRouteName = 'signup'>
          <stackNav.Screen name = "signup" Component = { signupscreen} />
        </stackNav.Navigator>
      </NavigationContainer>
    )
  }
}