import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import SearchScreen from "./search";
import ProfileScreen from "./profile";
import AlertScreen from "./alert";
import UpdateScreen from "./update";

const profileName = "Profile"
const searchName = "Search"
const alertName = "Alert"
const updateName = "Update"

const Tab = createBottomTabNavigator();
function MainContainer() {
    return (
        <Tab.Navigator
            initialRouteName={updateName}
            screenOptions={( {route} ) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name
                    if (rn === profileName) {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    } else if (rn === searchName) {
                        iconName = focused ? 'search-circle' : 'search-circle-outline';
                    } else if (rn === alertName) {
                        iconName = focused ? 'alert-circle' : 'alert-circle-outline'
                    } else if (rn === updateName) {
                        iconName = focused ? 'clipboard' : 'clipboard-outline'
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            })}
            tabBarOptions={{
                activeTintColor: '#1300D5',
                inactiveTintColor: 'grey',
                labelStyle: { fontSize: 10 },
                tabStyle: { paddingTop: 10 },
                style: { height: 200}
            }}
        >
            <Tab.Screen component = {UpdateScreen} name={"Update"}/>
            <Tab.Screen component={SearchScreen} name={"Search"}/>
            <Tab.Screen component ={AlertScreen} name={"Alert"}/>
            <Tab.Screen component = {ProfileScreen} name={"Profile"}/>
        </Tab.Navigator>
    )
}

export default MainContainer;