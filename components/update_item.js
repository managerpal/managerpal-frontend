import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert, SafeAreaView, TextInput} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'

const UpdateItemScreen = ( {route, navigation} ) => {
    const { ID, item, quantity, manual } = route.params

    const [id, setID] = React.useState(ID)
    const [item_man, setItem] = React.useState(item)
    const [qty, setQty] = React.useState(quantity) // for sell quantity

    const [action, setAction] = React.useState('')
    const [price, setPrice] = React.useState(-1)
    const [date_day, setDate_day] = React.useState(0)
    const [date_month, setDate_month] = React.useState('')
    const [date_year, setDate_year] = React.useState(0)
    const [user, setUser] = React.useState('')

    const [update_id, setupdateID] = React.useState('') // for arriving

    // API POST request when submitting
    const submitPost = async () => {
        const submit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: id,
                action: action,
                price:  price/qty, // value sent is per piece
                quantity: qty,
                date: date_year + '-' + date_month + '-' + date_day,
                user: user,
            })
        };

        try {
            const response = await fetch('https://managerpal.seewhyjay.dev/inventory/update', submit);
            const data = await response.json();
            if (response.status === 400) {
                throw new Error('Submission failed');
            } else {
                console.log('submitPost, item being submitted is' + item_man)
                Alert.alert(
                    'Successful',
                    item_man + ' has been successfully updated',
                    [{ text: 'Cancel', onPress: () => navigation.navigate('MainContainer') }]
                );
            }
        } catch (error) {
            console.log(error + ' error is at submitPost');
            Alert.alert('Submission failed', error);
        }
    };

    // onSubmit of the entire form
    const onSubmit = () => {
        if (action === 'Arrived') {
            arrivingPOSTAPI()
        } else {
            if (price !== -1 && date_day !== 0 && date_month !== '' && date_year !== 0) {
                submitPost()
            } else {
               Alert.alert(
                   'Unsuccessful',
                   'Fields cannot be blank',
                   [{ text: 'Cancel', onPress: () => {}}]
               );
            }
        }
    }

    // To generate all the items for the dropdown
    const [itemarray, setItemArray] = React.useState([])
    const [itemID, setItemID] = React.useState([]);
    const [itemQty, setItemQty] = React.useState([]);

    const manualGet = async () => {
        const search = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        try {
            const response = await fetch('https://managerpal.seewhyjay.dev/inventory/list_products', search);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Item retrieve failed');
            } else {
                const names = data.items.map(item => item.name);
                setItemArray(names.concat(''));
                const ids = data.items.map(item => item.id);
                setItemID(ids);
                const qty = data.items.map(item => item.qty !== null ? item.qty : 0);
                setItemQty(qty);
            }
        } catch (error) {
            console.log(error + ' error is at manualGet');
            Alert.alert('Submission failed', error.message);
        }
    };

    React.useEffect(() => {
        manualGet();
        console.log(item_man + ' - name after initialisation - in React.useEffect updateItem')
    }, []);

    // API call to GET "arriving" information
    const [arrID, setArrID] = React.useState([]);
    const [arrQty, setarrQty] = React.useState([]);

    const arrivingGETAPI = async (productId) => {
        try {
            const request = {
                method: 'GET',
            };
            let endPoint = 'https://managerpal.seewhyjay.dev/inventory/arriving';
            if (productId) {
                endPoint += `?product_id=${productId}`;
            }
            const response = await fetch(endPoint, request);
            const data = await response.json();
            console.log(endPoint + ' end point for arriving')
            if (response.status === 200) {
                const arrIDs = data.items.map(item => item.id);
                const arrQtys = data.items.map(item => item.qty)
                setArrID(arrIDs)
                setarrQty(arrQtys)
            } else {
                console.log('status 400 error is at arrivingGETAPI')
                Alert.alert('Failure', 'Unable to retrieve arriving information');
            }
        } catch (error) {
            console.log(error + ' error is at arrivingGETAPI');
            Alert.alert('Failure', error.message);
        }
    };

    // API call to POST "arriving" information
    const arrivingPOSTAPI = async () => {
        try {
            const endPoint = 'https://managerpal.seewhyjay.dev/inventory/arriving'
            const response = await fetch(endPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: update_id,
                    arrived: true
                }),
            });
            const data = await response.json();
            if (response.status === 200) {
                Alert.alert(
                    'Successful',
                    item_man + ' has been successfully updated',
                    [{ text: 'Cancel', onPress: () => navigation.navigate('MainContainer') }]
                );
            } else {
                return (
                    Alert.alert('Update failed',
                        'error updating',
                        [{text: 'Cancel', onPress: () => {}}]
                    )
                )
            }
        } catch (error) {
            console.log(error + ' error is at arrivingPOSTAPI');
            Alert.alert('Update failed', error.message);
        }
    };

    const index = itemarray.indexOf(item_man)

    const updateManView =  () => {
        if (!manual) {
            React.useEffect(() => {
                arrivingGETAPI(ID);
            }, []);
            console.log(ID + ' updateManView - ID for QR code')
            console.log(item + ' updateManView - item name for QR code')
            console.log(quantity + 'updateManView - quantity for QR code')
        }
        return (
            <SelectDropdown
                buttonStyle={styles.dropdown}
                buttonTextStyle={styles.dropdownText}
                data={itemarray}
                onSelect={(selected, index) => {
                    setItem(selected);
                    setQty(itemQty[index]);
                    setID(itemID[index]);
                    arrivingGETAPI(itemID[index]);
                }}
                defaultValueByIndex={index}
                defaultButtonText={'Select Item'}
                buttonTextAfterSelection={(selected, index) => {
                    return selected;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
            />
        )
    }

    // For dropdown of actions
    const createDropdownAction = (item) => {
        if (arrID.length > 0) {
            return ["Buy", "Sell", "Arrived"]
        } else {
            return ["Buy", "Sell"]
        }
    }

    let actionsView;
    if (manual && item_man !== '' || !manual) {
        actionsView =
            <View style={styles.rowContain}>
                <Text style={styles.text}>
                    Action:
                </Text>
                <SelectDropdown
                    buttonStyle={styles.dropdown}
                    buttonTextStyle={styles.dropdownText}
                    data={createDropdownAction(item_man)}
                    onSelect={(selectedItem, index) => {
                        setAction(selectedItem)
                    }}
                    defaultButtonText={'Select Action'}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                        return item;
                    }}
                />
            </View>
    }

    // for dropdown of quantity (if action is sell)
    const createDropdownQty = () => {
        let result = []
        for (let i = 1; i <= qty; i++) {
            result.push(i);
        }
        return result;
    }

    // for dropdown of day
    const createDropdownDateDay = () => {
        let result = []
        for (let i = 1; i <= 31; i++) {
            result.push(i);
        }
        return result;
    }

    // for dropdown of year, starting from 2000 to 20223
    const createDropdownDateYear = () => {
        let result = []
        for (let i = 2000; i <= 2023; i++) {
            result.push(i);
        }
        return result;
    }

    const months = () => {
        let result = []
        for (let i = 1; i <= 12; i++) {
            result.push(i);
        }
        return result;
    }

    // for display of date (in buy and sell action)
    let date;
    date =
        <View style={styles.rowContain}>
            <Text style={styles.text}>
                Date:
            </Text>
            <SelectDropdown
                buttonStyle={styles.dropdown}
                buttonTextStyle={styles.dropdownText}
                data={createDropdownDateDay()}
                onSelect={(selected, index) => {
                    setDate_day(selected)
                }}
                defaultButtonText={'DD'}
                buttonTextAfterSelection={(selected, index) => {
                    return selected;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
            />
            <SelectDropdown
                buttonStyle={styles.dropdown}
                buttonTextStyle={styles.dropdownText}
                data={months()}
                onSelect={(selected, index) => {
                    setDate_month(selected)
                }}
                defaultButtonText={'MM'}
                buttonTextAfterSelection={(selected, index) => {
                    return selected;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
            />
            <SelectDropdown
                buttonStyle={styles.dropdown}
                buttonTextStyle={styles.dropdownText}
                data={createDropdownDateYear()}
                onSelect={(selected, index) => {
                    setDate_year(selected)
                }}
                defaultButtonText={'YY'}
                buttonTextAfterSelection={(selected, index) => {
                    return selected;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
            />
        </View>

    // for display of price (in buy and sell action)
    let pricedisplay;
    pricedisplay =
        <View style={styles.rowContain}>
            <Text style={styles.text}>
                Price:
            </Text>
            <TextInput
                style={styles.textinput}
                numeric
                keyboardType={'numeric'}
                placeholder={'Enter Total Price'}
                editable
                onChangeText = {setPrice}
                value = {price}
            />
        </View>

    // actual display after selecting action
    let content
    if (action === 'Sell') {
        content = (
            <View>
                <View style={styles.rowContain}>
                    <Text style={styles.text}>
                        Quantity:
                    </Text>
                    <SelectDropdown
                        buttonStyle={styles.dropdown}
                        buttonTextStyle={styles.dropdownText}
                        data={createDropdownQty()}
                        onSelect={(selected, index) => {
                            setQty(selected)
                        }}
                        defaultButtonText={'Enter Quantity'}
                        buttonTextAfterSelection={(selected, index) => {
                            return selected;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                    />
                </View>
                <View>
                    {pricedisplay}
                </View>
                <View>
                    {date}
                </View>
                <View style={styles.rowContain}>
                    <Text style={styles.text}>
                        User:
                    </Text>
                    <TextInput
                        style={styles.textinput}
                        placeholder={'Enter Buyer Username'}
                        editable
                        onChangeText = {setUser}
                        value = {user}
                    />
                </View>
                <Button title={'Submit'} onPress={() => {onSubmit()}} />
            </View>
        )
    }
    if (action === 'Buy') {
        content = (
            <View>
                <View style={styles.rowContain}>
                    <Text style={styles.text}>
                        Quantity:
                    </Text>
                    <TextInput
                        style={styles.textinput}
                        numeric
                        keyboardType={'numeric'}
                        placeholder={'Enter Quantity'}
                        editable
                        onChangeText = {setQty}
                        value = {qty}
                    />
                </View>
                <View style={styles.rowContain}>
                    {pricedisplay}
                </View>
                <View>
                    {date}
                </View>
                <Button title={'Submit'} onPress={() => {onSubmit()}} />
            </View>
        )
    }
    if (action === 'Arrived') {
        content = (
            <View>
                <View>
                    {date}
                </View>
                <View style={styles.arriveConfirm}>
                    <SelectDropdown
                        data={arrQty}
                        onSelect={(selected, index) => {
                            setupdateID(arrID[index])
                        }}
                    />
                </View>
                <Button title={'Submit'} onPress={() => {arrivingPOSTAPI()}} />
            </View>
        )
    }

    return (
        <SafeAreaView>
            <View style={styles.card}>
                <Text
                    style={styles.title}>
                    Update Item
                </Text>
            </View>
            <View style={styles.rowContain}>
                {updateManView()}
            </View>
            <View>
                {actionsView}
            </View>
            {content}
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
        marginTop: 10,
    },
    arriveConfirm: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginTop: 10,
        justifyContent: 'center'
    },
    dropdown: {
        marginRight: 20,
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdownText: {color: '#444', textAlign: 'center'},
    checkboxContainer: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkbox: {
        margin: 10,
        alignSelf: "center"
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
});
export default UpdateItemScreen

// // To retrieve information once item is selected manually
// const itemExist = async () => {
//     const itemExist = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             itemName: item_man
//         })
//     };
//     try {
//         const response = await fetch('https://reqres.in/api/posts', itemExist);
//         const data = await response.json();
//         if (response.status === 400) {
//             Alert.alert(
//                 'Error',
//                 'Update failed',
//                 [{ text: 'Cancel', onPress: () => {}}]
//             );
//         } else {
//             // setItem(data.item)
//             // setArr(data.arriving)
//             // setArrQty(data.arrivingQty)
//             // setQty(data.quantity)
//             setItem('test')
//             setArr(true)
//             setArrQty(2)
//             setQty(4)
//         }
//     } catch (error) {
//         return (<Text> {error} </Text>)
//     }
// };