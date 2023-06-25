import React, { useState } from 'react';
import {Text, View, StyleSheet, Button, Alert, SafeAreaView, TextInput} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import {Checkbox} from "expo-checkbox";

const UpdateItemScreen = ( {route, navigation} ) => {
    const { ID, item, quantity, manual } = route.params

    const [id, setID] = React.useState(ID)
    const [item_man, setItem] = React.useState(item)
    const [qty, setQty] = React.useState(quantity)

    // const [arr_man, setArr] = React.useState(arriving)
    // const [arrQty_man, setArrQty] = React.useState(arrivingQty)
    const [action, setAction] = React.useState('')
    const [price, setPrice] = React.useState(0.00)
    const [date_day, setDate_day] = React.useState(0)
    const [date_month, setDate_month] = React.useState('')
    const [date_year, setDate_year] = React.useState(0)
    const [user, setUser] = React.useState('')
    // const [isChecked, setChecked] = React.useState(false)

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
            const response = await fetch('localhost/inventory/update', submit);
            const data = await response.json();
            if (response.status === 400) {
                throw new Error('Submission failed');
            } else {
                console.log(item_man)
                Alert.alert(
                    'Successful',
                    item_man + ' has been successfully updated',
                    [{ text: 'Cancel', onPress: () => navigation.navigate('MainContainer') }]
                );
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Submission failed', error);
        }
    };

    // onSubmit of the entire form
    const onSubmit = () => {
        if (action === 'Arrive') {
            if (!isChecked) {
                Alert.alert(
                    'Error',
                    'Please confirm item has arrived',
                    [{ text: 'Cancel', onPress: () => {} }]
                );
            } else {
                submitPost()
            }
        } else {
            submitPost()
        }
    }

    // To generate all the items for the dropdown
    // need API to return name (item) only
    let itemarray = []
    let itemID = []
    let itemQty = []
    const manualGet = async () => {
        const manual = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        try {
            const response = await fetch('localhost/inventory/list', manual);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Item retrieve failed');
            } else {
                for (const dta of data) {
                    itemarray.push(dta.name);
                    itemID.push(dta.id);
                    itemQty.push(dta.qty)
                }
                itemarray.push('')
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Submission failed', error.message);
        }
    };

    // API call to GET "arriving" information
    let arrGetAPI
    const arrivingGETAPI = async () => {
        try {
            const endPoint = 'localhost/inventory/arriving'
            const response = await fetch(endPoint);
            const data = await response.json();
            if (data.response === '200') {

            } else {

            }
        } catch (error) {
            console.log(error);
            Alert.alert('Submission failed', error.message);
        }
    };

    // API call to POST "arriving" information
    const arrivingPOSTAPI = async () => {
        try {
            const endPoint = 'localhost/inventory/arriving'

            // GET request
            const response = await fetch(endPoint);
            const data = await response.json();
            if (data.response === '200') {

            } else {

            }

            // POST request
            const POST = await fetch (endPoint,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: id,
                    }),
                }
            )
            const updateData = await POST.json();
            if (updateData.response === '200') {

            } else {

            }

        } catch (error) {
            console.log(error);
            Alert.alert('Submission failed', error.message);
        }
    };
    const itemExist = (name) => {
        const index = itemarray.indexOf(name)
        setItem(name)
        setQty(itemQty[index])
        setID(itemID[index])

        setArr(data.arriving)
        setArrQty(data.arrivingQty)

    }

    let updateManView;

    if (manual) {
        updateManView = (
            <SelectDropdown
                buttonStyle={styles.dropdown}
                buttonTextStyle={styles.dropdownText}
                data={itemarray}
                onSelect={(selected, index) => {
                    setItem(selected);
                    itemExist()
                }}
                defaultButtonText={'Select Item'}
                buttonTextAfterSelection={(selected, index) => {
                    return selected;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
            />
        );
    } else {
        updateManView = (
            <Text style={styles.text}>
                Item: {item_man}
            </Text>
        );
    }

    // For dropdown of actions
    const createDropdownAction = () => {
        if (arr_man) {
            console.log('item is arriving: ' + arr_man)
            return ["Buy", "Sell", "Arrived"]
        } else {
            console.log('item is arriving: ' + arr_man)
            return ["Buy", "Sell"]
        }
    }

    let actionsView;
    if (manual && item_man !== null || !manual) {
        actionsView =
            <View style={styles.rowContain}>
                <Text style={styles.text}>
                    Action:
                </Text>
                <SelectDropdown
                    buttonStyle={styles.dropdown}
                    buttonTextStyle={styles.dropdownText}
                    data={createDropdownAction()}
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
                data={months}
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

    // actual display
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
                    <Checkbox
                        style = {styles.checkbox}
                        value = {isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? '#4630EB' : undefined}
                    />
                    <Text>
                        Confirm {arrQty_man} of {item_man} has arrived
                    </Text>
                </View>
                <Button title={'Submit'} onPress={() => {onSubmit()}} />
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
                {updateManView}
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