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

function RegisterScreen({ navigation }) {
    const [textEmail, onChangeEmail] = React.useState('')
    const [textUser, onChangeUser] = React.useState('')
    const [textPW, onChangePW] = React.useState('')
    const [textPWcopy, onChangePWcopy] = React.useState('')

    const register = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName: 'onChangeUser',
            password: 'onChangePW'
        })
    };

    const registerPost = async () => {
        try {
            await fetch(
                'https://reqres.in/api/posts', register)
                .then(response => {
                    response.json()
                        .then(navigation.navigate(LoginScreen));
                });
        }
        catch (error) {
            return (
                <Text style={{color: 'red'}}>
                    Please try again later
                </Text>
            )
        }
    }

    const usernameExist = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName: 'onChangeUser'
        })
    };
    let usernameExistMsg = 'Username not available'
    let usernameBool = false
    const usernameExistPost = async () => {
        try {
            await fetch(
                'https://reqres.in/api/posts', usernameExist)
                .then(response => {
                    response.json()
                        .then(() => {
                            usernameExistMsg = 'Username is available';
                            usernameBool = true;
                        });
                });
        }
        catch (error) {
            usernameExistMsg = 'Username is not available';
            usernameBool = false;
        }
    }

    return (
        <SafeAreaView>
            <Text style={{
                textAlign: 'center',
                padding: 20,
                fontSize: 28
            }}>
                Register
            </Text>
            <TextInput
                textContentType={'emailAddress'}
                placeholder={'example@email.com'}
                style ={styles.input}
                editable
                onChangeText = {onChangeEmail}
                value = {textEmail}
            />
            <TextInput
                textContentType={'username'}
                placeholder={'Username'}
                style ={styles.input}
                editable
                onChangeText = {onChangeUser}
                value = {textUser}
            />
            {/*<Text style={{*/}
            {/*    padding: 12,*/}
            {/*    color: usernameBool ? 'green' : 'red'*/}
            {/*}}>*/}
            {/*    {usernameExistMsg}*/}
            {/*</Text>*/}
            <TextInput
                textContentType={'newPassword'}
                placeholder={'Password'}
                style ={styles.input}
                editable
                onChangeText = {onChangePW}
                value = {textPW}
            />
            <TextInput
                placeholder={'Retype Password'}
                style ={styles.input}
                editable
                onChangeText = {onChangePWcopy}
                value = {textPWcopy}
            />
            <Button
                onPress={() => registerPost()}
                title = {'Register Now'}
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

export default RegisterScreen;