import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Component } from 'react';

import HomeScreen from './screens/homescreen';
import SignUpscreen from './screens/signupscreen';
import LogInscreen from './screens/loginscreen';


const stackNav = createNativeStackNavigator();
const tabNav = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <stackNav.Navigator initialRouteName='login'>
          <stackNav.Screen name="signup" component={SignUpscreen} options={{headerShown: false}} />
          <stackNav.Screen name="login" component={LogInscreen} options={{headerShown: false}} />
          <stackNav.Screen name="home" component={LogInscreen} options={{headerShown: false}} />
        </stackNav.Navigator>
      </NavigationContainer>
    )
  }
}