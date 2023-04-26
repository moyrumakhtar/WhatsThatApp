import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Component } from 'react';

import signupscreen from './screens/signupscreen';
import loginscreen from './screens/loginscreen';


const stackNav = createNativeStackNavigator();
const tabNav = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <stackNav.Navigator initialRouteName='login'>
          <stackNav.Screen name="signup" component={signupscreen} options={{headerShown: false}} />
          <stackNav.Screen name="login" component={loginscreen} options={{headerShown: false}} />
        </stackNav.Navigator>
      </NavigationContainer>
    )
  }
}