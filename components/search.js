import React from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert, FlatList} from 'react-native';

const SearchScreen = ( {navigation} ) => {
    // const [itemarray, setItemArray] = React.useState([])
    //
    // const searchGet = async () => {
    //     const search = {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //     };
    //     try {
    //         const response = await fetch('https://reqres.in/api/posts', search);
    //         const data = await response.json();
    //         if (!response.ok) {
    //             throw new Error('Item retrieve failed');
    //         } else {
    //             const names = data.map(item => item.product_name);
    //             setItemArray(names);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         Alert.alert('Submission failed', error.message);
    //     }
    // };

    // For testing
    const itemarray = [
        {
            id: '1',
            item: 'First Item',
            quantity: '1',
            arrivingQty: '1'
        },
        {
            id: '2',
            item: 'Second Item',
            quantity: '2',
            arrivingQty: '2'
        },
        {
            id: '3',
            item: 'Third Item',
            quantity: '3',
            arrivingQty: '3'
        },
        {
            id: '4',
            item: 'Fourth Item',
            quantity: '4',
            arrivingQty: '4'
        },
        {
            id: '5',
            item: 'Fifth Item',
            quantity: '5',
            arrivingQty: '5'
        }
    ]

    const Item = ( {title, qty, arr} ) => (
        <View>
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('productDetails',
                    {
                        item: title,
                        quantity: qty,
                        arrivingQty: arr,
                    }
                )}
            >
                <View style={styles.infoContainer}>
                    <Text style={styles.name}> {title} </Text>
                    <Text style={styles.qty}>Quantity: {qty} </Text>
                    <Text style={styles.qty}>Arriving: {arr}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView>
            <FlatList
                data={itemarray}
                renderItem={
                    ({item}) => <Item title={item.item}
                                     qty = {item.quantity}
                                     arr = {item.arrivingQty}
                    />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
        marginHorizontal: 20
    },
    infoContainer: {
        padding: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    qty: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 5,
        marginTop: 5
    },
});

export default SearchScreen