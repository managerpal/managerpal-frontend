import React from 'react';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginScreen from "./components/login";
import MainContainer from "./components/mainContainer";
import RegisterScreen from "./components/register";
import LogoutScreen from "./components/logout";
import UpdateItemScreen from "./components/update_item";
import ProductDetails from "./components/productDetails";
import CreateItemScreen from "./components/create_item";

const Stack = createNativeStackNavigator();
function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="SignIn"
                component={LoginScreen}
                options={{
                  title: 'Sign in',
                }}
            />
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="MainContainer" component={MainContainer} />
            <Stack.Screen name="Log out" component={LogoutScreen}/>
            <Stack.Screen name="UpdateItemScreen" component={UpdateItemScreen}/>
            <Stack.Screen name="productDetails" component={ProductDetails}/>
            <Stack.Screen name="CreateItemScreen" component={CreateItemScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App
