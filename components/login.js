import React from 'react';
import {
    SafeAreaView,
    Button,
    View,
    Text,
    TextInput,
    StyleSheet, Alert,
} from 'react-native';
import { Checkbox } from 'expo-checkbox';

import RegisterScreen from "./register";
function LoginScreen({navigation}) {
    const [textEmail, onChangeEmail] = React.useState('')
    const [textPW, onChangePW] = React.useState('')
    const [isChecked, setChecked] = React.useState(false)
    const [loginError, setLoginError] = React.useState('')

    const loginRequest = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: textEmail,
            password: textPW,
            remember: isChecked
        })
    }
    const loginRest = async() => {
        try {
            const response = await fetch('https://reqres.in/api/posts', loginRequest);
            const data = await response.json();

            if (response.status === 400) {
                Alert.alert(
                    'Login unsuccessful',
                    'Username/Password is wrong',
                    [{ text: 'Cancel', onPress: () => {}}]
                );
            } else {
                Alert.alert(
                    'Welcome Back',
                    'Login successful',
                    [{ text: 'Go to Home Page', onPress: () => {
                            navigation.navigate('MainContainer')
                        }
                    }]
                );
            }
        } catch (error) {
            console.log(error)
            setLoginError('Username/Password does not match');
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
                textContentType={'emailAddress'}
                placeholder={'Email'}
                style ={styles.input}
                editable
                onChangeText = {onChangeEmail}
                value = {textEmail}
            />
            <TextInput
                placeholder={'Password'}
                style ={styles.input}
                editable
                onChangeText = {onChangePW}
                value = {textPW}
                secureTextEntry={true}
            />
            <View
            style={styles.checkboxContainer}>
                <Checkbox
                    style = {styles.checkbox}
                    value = {isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? '#4630EB' : undefined}
                />
                <Text style={{textAlign: 'center'}}>
                    Remember Me
                </Text>
            </View>
            <Button
                onPress={() => loginRest()}
                title={'Sign In'}
                color={'#1300D5'}
            />
            <Button
                onPress={() => navigation.navigate('Register')}
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
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkbox: {
        margin: 10,
        alignSelf: "center"
    },
});

export default LoginScreen;