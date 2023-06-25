import React from 'react';

import {
    SafeAreaView,
    Button,
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert
} from 'react-native';

function RegisterScreen({ navigation }) {
    const [textEmail, onChangeEmail] = React.useState('');
    const [textUser, onChangeUser] = React.useState('');
    const [textPW, onChangePW] = React.useState('');
    const [textPWcopy, onChangePWcopy] = React.useState('');
    const [emailMsg, setEmailMsg] = React.useState('Please enter a valid email address');

    const registerPost = async () => {
        const register = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: textEmail,
                name: textUser,
                password: textPW
            })
        };

        try {
            const response = await fetch('http://localhost/auth/signup', register);
            const data = await response.json();
            if (response.status === 400) {
                throw new Error(data.error);
            } else {
                Alert.alert(
                    'Registration successful',
                    'Please log in again',
                    [{ text: 'Cancel', onPress: () => navigation.navigate('SignIn') }]
                );
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Registration failed', 'Please try again later');
        }
    };

    const isValidEmailF = (email) => {
        let regex = new RegExp('[a-zA-Z0-9]+@[a-z]+\\.[a-z]{2,3}');
        return regex.test(email);
    };

    const handleEmailChange = (email) => {
        onChangeEmail(email);
        if (isValidEmailF(email)) {
            setEmailMsg('');
        } else {
            setEmailMsg('Please enter a valid email address');
        }
    };

    // To handle password, ensure a strong password
    const [smallMsg, setSmallMsg] = React.useState('Password must contain a small letter character');
    const [capitalMsg, setCapitalMsg] = React.useState('Password must contain a capital letter character');
    const [numMsg, setNumMsg] = React.useState('Password must contain a number');
    const [specialMsg, setSpecialMsg] = React.useState('Password must contain a special character');
    const [lenMsg, setLenMsg] = React.useState('Password length must be more than 8 characters')
    let isSmall = (password) => /[a-z]/.test(password);
    let isCapital = (password) => /[A-Z]/.test(password);
    let isNumber = (password) => /[0-9]/.test(password);
    let isSpecial = (password) => /[\W_]/.test(password);
    let isLength = (password) => password.length > 8;
    const handlePasswordChange = (password) => {
        onChangePW(password)

        if (isSmall(password)) {
            setSmallMsg('Password contains a small letter character');
        } else {
            setSmallMsg('Password must contain a small letter character');
        }
        if (isCapital(password)) {
            setCapitalMsg('Password contains a capital letter character');
        } else {
            setCapitalMsg('Password must contain a capital letter character')
        }
        if (isNumber(password)) {
            setNumMsg('Password contains a number')
        } else {
            setNumMsg('Password must contain a number')
        }
        if (isSpecial(password)) {
            setSpecialMsg('Password contains a special character')
        } else {
            setSpecialMsg('Password must contain a special character')
        }
        if (isLength(password)) {
            setLenMsg('Password length is more than 8 characters')
        } else {
            setLenMsg('Password length must be more than 8 characters')
        }
    }

    // To check if password matches each other
    const [matchPWMsg, setMatchPW] = React.useState('Password do not match')
    let isValidPWCopy = (pw) => {
        return (pw == textPW) && (pw.length != 0)
    }
    const handleMatchPW = (pw) => {
        onChangePWcopy(pw);
        if (textPW == pw) {
            setMatchPW('Password matches')
        } else {
            setMatchPW('Password do not match')
        }
    }

    return (
        <SafeAreaView>
            <Text style={styles.heading}>
                Register
            </Text>
            <TextInput
                textContentType="emailAddress"
                placeholder="example@email.com"
                style={styles.input}
                onChangeText={handleEmailChange}
                value={textEmail}
            />
            <Text style={styles.errorText}>
                {emailMsg}
            </Text>
            <TextInput
                textContentType="username"
                placeholder="Username"
                style={styles.input}
                onChangeText={onChangeUser}
                value={textUser}
            />
            <TextInput
                placeholder="Password"
                style={styles.input}
                onChangeText={handlePasswordChange}
                value={textPW}
                secureTextEntry={true}
                textContentType={"none"}
            />
            <Text style={isSmall(textPW) ? styles.noErrorPW : styles.errorPW}>
                {smallMsg}
            </Text>
            <Text style={isCapital(textPW) ? styles.noErrorPW : styles.errorPW}>
                {capitalMsg}
            </Text>
            <Text style={isNumber(textPW) ? styles.noErrorPW : styles.errorPW}>
                {numMsg}
            </Text>
            <Text style={isSpecial(textPW) ? styles.noErrorPW : styles.errorPW}>
                {specialMsg}
            </Text>
            <Text style={isLength(textPW) ? styles.noErrorPW : styles.errorPW}>
                {lenMsg}
            </Text>
            <TextInput
                placeholder="Retype Password"
                style={styles.input}
                onChangeText={handleMatchPW}
                value={textPWcopy}
                secureTextEntry={true}
            />
            <Text style={(isValidPWCopy(textPWcopy)) ? styles.noErrorPW : styles.errorPW}>
                {matchPWMsg}
            </Text>
            <Button
                onPress={() => {
                    if (emailMsg === '' &&
                        textEmail.length != 0 &&
                        isSmall(textPW) &&
                        isCapital(textPW) &&
                        isNumber(textPW) &&
                        isSpecial(textPW) &&
                        isLength(textPW) &&
                        isValidPWCopy(textPWcopy)
                    ) {
                        isValidUsernamePost().then(() => {
                            registerPost();
                        });
                    } else {
                        Alert.alert(
                            'Registration unsuccessful',
                            'Some input fields are invalid',
                            [{ text: 'Cancel', onPress: () => {}}]
                        );
                    }
                }}
                title="Register Now"
                color="#1300D5"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    heading: {
        textAlign: 'center',
        padding: 20,
        fontSize: 28
    },
    input: {
        height: 40,
        margin: 20,
        borderWidth: 2,
        padding: 10,
        minWidth: 50
    },
    errorText: {
        color: '#FF0000',
        marginLeft: 20
    },
    errorPW : {
        marginLeft: 20,
        color: '#FF0000'
    },
    noErrorPW : {
        marginLeft: 20,
        color: 'green'
    }
});

export default RegisterScreen;