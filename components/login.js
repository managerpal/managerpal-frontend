import React from 'react';
import {
    SafeAreaView,
    Button,
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';

import HomeScreen from "./home";

const LoginScreen = ({ navigation }) => {
    const [textUser, onChangeUser] = React.useState('')
    const [textPW, onChangePW] = React.useState('')

    const loginRequest = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'onChangeUser',
            password: 'onChangePW'
        })
    }
    const loginRest = async() => {
        try {
            await fetch(
                'https://reqres.in/api/posts', loginRequest)
                .then(response => {
                    response.json()
                        .then(navigation.navigate(HomeScreen))
                })
        }
        catch (error) {
            return (
                <Text style={{color: 'red'}}>
                    Username/Password does not match
                </Text>
            )
        }
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <Text
                style={{
                    textAlign:'center',
                    fontSize: 28,
                    fontWeight: '500',
                    marginBottom: 20
                }}>
                Welcome
            </Text>
            <TextInput
                textContentType={'username'}
                placeholder={'Username'}
                style ={styles.input}
                editable
                onChangeText = {onChangeUser}
                value = {textUser}
            />
            <TextInput
                placeholder={'Password'}
                style ={styles.input}
                editable
                onChangeText = {onChangePW}
                value = {textPW}
            />
            <Button
                onPress={() => loginRest()}
                title={'Sign In'}
                color={'#1300D5'}
            />
            <Button
                onPress={() => navigation.navigate('RegisterScreen')}
                title = {'Register here'}
                color={'#1300D5'}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 20,
        borderWidth: 2,
        padding: 10,
        minWidth: 50
    },
});

export default LoginScreen;