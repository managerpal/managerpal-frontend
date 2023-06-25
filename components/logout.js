import React from 'react';
import {
    SafeAreaView,
    Button,
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';
import LoginScreen from "./login";
const LogoutScreen = ({ navigation }) => {
    const logoutRequest = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    const logoutRest = async () => {
        try {
            const response = await fetch('https://reqres.in/api/posts', logoutRequest);
            const data = await response.json();

            if (data.status == 400) {
                return (
                    <Text style={{ color: 'red' }}>
                        {data.status}
                    </Text>
                );
            } else {
                navigation.navigate(LoginScreen);
            }
        } catch (error) {
            return (
                <Text style={{ color: 'red' }}>
                    Could not logout
                </Text>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 28, fontWeight: '500', marginBottom: 20 }}>
                Logout Screen
            </Text>
            <Button
                onPress={() => logoutRest()}
                title="Logout"
                color="#1300D5"
            />
        </SafeAreaView>
    );
};

export default LogoutScreen;
