import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert, FlatList } from 'react-native';

const SearchScreen = ({ navigation }) => {
    const [itemArray, setItemArray] = useState([]);
    const [itemID, setItemID] = React.useState([]);
    const [itemqty, setItemQty] = React.useState([])

    // To get all the current items
    const searchGet = async () => {
        const search = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        try {
            const response = await fetch('https://managerpal.seewhyjay.dev/inventory/list_products', search);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Item retrieve failed');
            } else {
                const names = data.items.map(item => item.name);
                setItemArray(names);
                const id = data.items.map(item => item.id);
                setItemID(id)
                const qty = data.items.map(item => item.qty !== null ? item.qty : 0);
                setItemQty(qty)
            }
        } catch (error) {
            console.log(error + ' error is at searchGet API');
            Alert.alert('Submission failed', error.message);
        }
    };

    useEffect(() => {
        searchGet();
    }, [itemArray]);

    const Item = ({ title, qty}) => (
        <View>
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    navigation.navigate('productDetails', {
                        item: title,
                        quantity: qty,
                        id: itemID[itemArray.indexOf(title)]
                    })
                    // console.log(itemArray + ' product array in search')
                }

                }
            >
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{title}</Text>
                    <Text style={styles.qty}>Quantity: {qty}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView>
            <FlatList
                data={itemArray}
                renderItem={({ item, index }) => (
                    <Item title={itemArray[index]}
                          qty={itemqty[index]}
                    />
                )}
            />
        </SafeAreaView>
    );
};

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
        marginVertical: 15,
        marginHorizontal: 20,
    },
    infoContainer: {
        padding: 18,
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
        marginTop: 5,
    },
});

export default SearchScreen;


// const [arrSum, setArrSum] = useState([]);
// React.useEffect(() => {
//     let array = []
//     let index = 0
//
//     itemArray.forEach((item) => {
//         arrivingGETAPI(item.id);
//         console.log(index + ' ' + arrQty + ' temp array in useEffect, search page')
//         let curr
//         curr = arrQty.reduce((acc, curr) => acc + curr, 0)
//         array[index] = curr
//         index++
//     });
//
//     setArrSum(array)
// }, [itemArray]);
// console.log(arrSum + ' arrSum in useEffect, search page')

// For testing
// const itemarray = [
//     {
//         id: '1',
//         name: 'First Item',
//         qty: '1',
//     },
//     {
//         id: '2',
//         name: 'Second Item',
//         qty: '2',
//     },
//     {
//         id: '3',
//         name: 'Third Item',
//         qty: '3',
//     },
//     {
//         id: '4',
//         name: 'Fourth Item',
//         qty: '4',
//     },
//     {
//         id: '5',
//         name: 'Fifth Item',
//         qty: '5',
//     }
// ]
