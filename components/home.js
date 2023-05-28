import React from 'react';
import {
    SafeAreaView,
    Button,
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';

const HomeScreen = ({navigation}) => {
    return (
        <SafeAreaView>
            <Text style={{
                textAlign: 'center',
                fontSize: 28,
                fontWeight: '500',
                marginBottom: 20
            }}>
                Home
            </Text>
            <Button
                title={'Logout'}
                onPress={() => navigation.navigate('LoginScreen')}
            />
        </SafeAreaView>
    )
}

export default HomeScreen