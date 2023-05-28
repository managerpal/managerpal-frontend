import React, {Component} from 'react';
import {Text, StyleSheet, View, SafeAreaView} from 'react-native';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Link } from '@react-navigation/native';

import LoginScreen from "./components/login";
import HomeScreen from "./components/home";
import RegisterScreen from "./components/register";

const Stack = createNativeStackNavigator();
function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen component={LoginScreen} name={"LoginScreen"}/>
          <Stack.Screen component = {HomeScreen} name={"HomeScreen"}/>
          <Stack.Screen component = {RegisterScreen} name={"RegisterScreen"}/>
        </Stack.Navigator>
      </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default App