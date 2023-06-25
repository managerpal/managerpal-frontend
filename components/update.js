import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import UpdateItemScreen from "./update_item";

const UpdateScreen = ( {navigation} ) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Please scan item QR code');
    const [item, setItem] = useState('test');

    // API call to search for item exist
    const itemExist = async () => {
        const itemExist = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itemName: item
            })
        };
        try {
            const response = await fetch('https://web.postman.co/workspace/My-Workspace~1baef2b9-bec7-452d-88bf-07805f7e6ea4/request/27917960-207da089-5dca-46cf-a4d5-d352c4cf6663', itemExist);
            const data = await response.json();
            if (response.status === 400) {
                Alert.alert(
                    'Error',
                    'Item does not exist',
                    [{ text: 'Cancel', onPress: () => {}}]
                );
            } else {
                navigation.navigate('UpdateItemScreen',
                    {
                        item: data.item,
                        arriving: data.arriving,
                        arrivingQty: data.arrivingQty,
                        quantity: data.quantity,
                        manual: false
                    }
                )
            }
        } catch (error) {
            return (<Text> {error} </Text>)
        }
    };
    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
    }

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    // After scanning
    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        setText('Item scanned')
        setItem(data)
        console.log( {item} )
        itemExist()
    };

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>)
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{ margin: 10 }}>No access to camera</Text>
                <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
            </View>)
    }

    // Return the View
    return (
        <View style={styles.container}>
            <View style={styles.barcodebox}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{ height: 400, width: 400 }} />
            </View>
            <Text style={styles.maintext}>{text}</Text>
            <Button
                title={'Enter Manually'}
                onPress={() => {
                    navigation.navigate('UpdateItemScreen',
                        {
                            item: '',
                            arriving: false,
                            arrivingQty: 0,
                            quantity: 0,
                            manual: true
                        }
                    )
                }}
            />
            <Button
                title={'Create new item'}
                onPress={() => {
                    navigation.navigate('CreateItemScreen')
                }}
            />
            {scanned &&
                <Button
                    title={'Scan again'}
                    onPress={() => {
                        setScanned(false)
                        setText('Please scan item QR code')
                    }
                } color='tomato' />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    barcodebox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'tomato'
    }
});

export default UpdateScreen
