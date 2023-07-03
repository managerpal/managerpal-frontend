import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert, FlatList} from 'react-native';

const SearchScreen = ( {navigation} ) => {
    const [itemarray, setItemArray] = React.useState([])

    const searchGet = async () => {
        const search = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        try {
            const response = await fetch('https://managerpal.seewhyjay.dev/inventory/list', search);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Item retrieve failed');
            } else {
                const names = data.items
                setItemArray(names)
            }
        } catch (error) {
            console.log(error + ' error is at searchGet API');
            Alert.alert('Submission failed', error.message);
        }
    };
    React.useEffect(() => {
        searchGet();
    }, []);

    const Item = ( {title, qty} ) => (
        <View>
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('productDetails',
                    {
                        item: title,
                        quantity: qty,
                    }
                )}
            >
                <View style={styles.infoContainer}>
                    <Text style={styles.name}> {title} </Text>
                    <Text style={styles.qty}>Quantity: {qty} </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView>
            <FlatList
                data={itemarray}
                renderItem={
                    ({item}) => <Item title={item.name}
                                     qty = {item.qty}
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
