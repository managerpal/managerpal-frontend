import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import UpdateItemScreen from "./update_item";

const UpdateScreen = ( {navigation} ) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Please scan item QR code');
    const [item, setItem] = useState('test');

    // API call to search for item exist (for QR code)
    const [itemarray, setItemArray] = React.useState([])
    const [itemID, setID] = React.useState([])
    const [itemqty, setItemQty] = React.useState([])

    const searchGet = async () => {
        const search = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        try {
            const response = await fetch('https://managerpal.seewhyjay.dev/inventory/list_products', search);
            const data = await response.json();
            if (response.status === 400) {
                throw new Error('Item retrieve failed');
            } else {
                const names = data.items.map(item => item.name);
                setItemArray(names);
                const id = data.items.map(item => item.id);
                setID(id)
                const qty = data.items.map(item => item.qty !== null ? item.qty : 0);
                setItemQty(qty)
            }
        } catch (error) {
            console.log('searchGet has an error the error is here' + error);
            Alert.alert('Submission failed', error.message);
        }
    };

    React.useEffect(() => {
        searchGet();
    }, []);

    const itemExist = async (item) => {
        return itemarray.includes(item);
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
        const scannedItem = data
        setScanned(true);
        setText('Item scanned')
        setItem(scannedItem)
        console.log('item scanned is: ' + item + ' in handleBarCodeScanned')

        if (itemExist(scannedItem)) {
            const index = itemarray.indexOf(scannedItem)
            const qty = itemqty[index]
            const ID = itemID[index]
            console.log(ID + ' : item ID after barcode scan')
            console.log(qty + ' : quantity after barcode scan')
            console.log(item + ' : item name after barcode scan')

            navigation.navigate('UpdateItemScreen', {
                ID: ID,
                item: item,
                quantity: qty,
                manual: false
            })
        } else {
            Alert.alert('Error',
                data + ' ' + ' ' + item + ' ' + itemExist(item),
                [{ text: 'Cancel', onPress: () => {}}]
                )
        }
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
                    onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                    }
                    style={{ height: 400, width: 400 }} />
            </View>
            <Text style={styles.maintext}>{text}</Text>
            <Button
                title={'Enter Manually'}
                onPress={() => {
                    navigation.navigate('UpdateItemScreen',
                        {
                            ID: 0,
                            item: '',
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
