import React, { useState } from 'react';
import {Text, View, StyleSheet, Button, Alert, SafeAreaView, TextInput} from 'react-native';

const CreateItemScreen = ( {navigation} ) => {
    const [item, setItem] = React.useState('')

    const createItem = async () => {
        const createItem = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: item
            })
        };
        try {
            const response = await fetch('https://managerpal.seewhyjay.dev/inventory/add_product', createItem);
            const data = await response.json();
            if (response.status === 400) {
                console.log(response.status)
                Alert.alert(
                    'Error',
                    'Error in creating new item',
                    [{ text: 'Cancel', onPress: () => {}}]
                );
            } else {
                Alert.alert(
                    'Success',
                    'Successfully created new item',
                    [{ text: 'Cancel', onPress: () => navigation.navigate('MainContainer')}]
                );
            }
        } catch (error) {
            return (<Text> {error} </Text>)
        }
    };

    return (
        <SafeAreaView>
            <View style={styles.card}>
                <Text
                    style={styles.title}>
                    Create Item
                </Text>
            </View>
            <View style={styles.rowContain}>
                <Text style={styles.text}>
                    New item:
                </Text>
                <TextInput
                    style={styles.textinput}
                    placeholder={'Enter New Item Name'}
                    editable
                    onChangeText = {setItem}
                    value = {item}
                />
            </View>
            <Button
                title={'Submit'}
                onPress={() => {
                    Alert.alert(
                        'Confirm',
                        'Do you want to add ' + item,
                        [
                            {
                                text: 'Cancel', onPress: () => {}
                            },
                            {text: 'OK', onPress: () => createItem()}
                        ]
                    );
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign:'center',
        fontSize: 28,
        fontWeight: '500',
        textAlignVertical: 'center'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: 'black',
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 1,
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: "center",
        padding: 15
    },
    textinput: {
        marginLeft: 20,
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        textAlign: 'center'
    },
    text: {
        textAlign: 'left',
        fontSize: 20,
        fontWeight: '400',
        marginLeft: 30,
        marginTop: 20,
        textAlignVertical: 'center'
    },
    rowContain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginTop: 20,
        marginBottom: 20
    },
})

export default CreateItemScreen