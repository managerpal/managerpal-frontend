import React from 'react';
import {
    SafeAreaView,
    Button,
    Text,
} from 'react-native';

const ProfileScreen = ({navigation}) => {
    return (
        <SafeAreaView>
            <Text style={{
                textAlign: 'center',
                fontSize: 28,
                fontWeight: '500',
                marginBottom: 20
            }}>
                Profile
            </Text>
            <Button
                title={'Logout'}
                onPress={() => navigation.navigate('SignIn')}
            />
        </SafeAreaView>
    )
}

export default ProfileScreen