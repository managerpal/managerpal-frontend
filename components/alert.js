import {Alert, Button, FlatList, SafeAreaView, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";
import SelectDropdown from 'react-native-select-dropdown'
import {get} from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const AlertScreen = ( {navigation} ) => {
    const [itemarray, setItemArray] = React.useState([])
    const [itemqty, setItemQty] = React.useState([])
    const [itemID, setID] = React.useState([])

    const [filterArray, setFilterArray] = React.useState([])

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
                const qty = data.items.map(item => item.qty !== null ? item.qty : 0);
                setItemQty(qty)
                const id = data.items.map(item => item.id);
                setID(id)
            }
        } catch (error) {
            console.log('searchGet has an error the error is here' + error);
            Alert.alert('Submission failed', error.message);
        }
    };

    React.useEffect(() => {
        searchGet().then(() => {
            console.log(itemarray + ' full item array in alert page');
            console.log(itemqty + ' full qty list in alert page');
        });
    }, []);

    const dropdown = [1, 2, 3, 5, 10, 15, 20]

    const getFilteredItems = (val) => {
        let tempArray = []
        console.log(val)
        for (let i = 0; i <= itemarray.length; i++) {
            if (itemqty[i] <= val) {
                tempArray.push(itemarray[i])
            }
        }
        setFilterArray(tempArray)
        console.log(filterArray + ' filtered items in alert page')
    }

    const Item = ({ title, qty}) => (
        <View>
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate('productDetails', {
                        item: title,
                        quantity: qty,
                        id: itemID[itemarray.indexOf(title)]
                    })
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
            <View>
                <Text style={styles.info}> Select quantity to filter by</Text>
                <Text style={styles.moreInfo}> Items shown have instock quantity less than or equal to quantity selected </Text>
            </View>
            <SelectDropdown
                buttonStyle={styles.dropdown}
                buttonTextStyle={styles.dropdownText}
                data={dropdown}
                onSelect={(selectedItem, index) => {
                    getFilteredItems(selectedItem)
                }}
                defaultButtonText={'Select filter'}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
            />
            <FlatList
                data={filterArray}
                renderItem={({ item, index }) => (
                    <Item title={itemarray[index]}
                          qty={itemqty[index]}
                    />
                )}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        marginTop: 20,
        marginRight: 20,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdownText: {
        color: '#444',
        textAlign: 'center'
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
        color: 'red'
    },
    info: {
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    },
    moreInfo: {
        fontSize: 14,
        fontWeight: '200',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
})

export default AlertScreen