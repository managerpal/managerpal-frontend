import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    Button,
    Text,
    View, StyleSheet, Alert, TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

const ProfileScreen = ({navigation}) => {
    const [itemqty, setItemQty] = React.useState([])
    const [alertFilter, setAlertFilter] = React.useState(5)

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
                const qty = data.items.map(item => item.qty !== null ? item.qty : 0);
                setItemQty(qty)
            }
        } catch (error) {
            console.log(error + ' error is at searchGet API');
            Alert.alert('Submission failed', error.message);
        }
    };

    // To get arriving information for all items
    const [arrQty, setArrQty] = React.useState([]);
    const arrivingGETAPI = async () => {
        try {
            const request = {
                method: 'GET',
            };
            let endPoint = 'https://managerpal.seewhyjay.dev/inventory/arriving';
            const response = await fetch(endPoint, request);
            const data = await response.json();
            if (response.status === 200) {
                const arrQtys = data.items.map((item) => item.qty);
                setArrQty(arrQtys);
            } else {
                console.log('status 400 error is at arrivingGETAPI');
                Alert.alert('Failure', 'Unable to retrieve arriving information');
            }
        } catch (error) {
            console.log(error + ' error is at arrivingGETAPI');
            Alert.alert('Failure', error.message);
        }
    };

    React.useEffect(() => {
        arrivingGETAPI().then(console.log(arrQty + ' arrQty in Profile page'))
        searchGet().then(console.log(itemqty))
        // console.log(id + ' item id')
    }, []);

    return (
        <SafeAreaView>
            <View style={styles.bigBox}>
                <Text style={styles.info}> Dashboard </Text>
                <View style={styles.row}>
                    <View style={styles.smallBox}>
                        <View style={styles.column}>
                            <Text style={styles.boxValue}>{arrQty.reduce((acc, curr) => acc + curr, 0)}</Text>
                            <Text style={styles.boxText}> Arriving </Text>
                        </View>
                    </View>
                    <View style={styles.smallBox}>
                        <View style={styles.column}>
                            <Text style={styles.boxValue}> {itemqty.filter(val => val <= alertFilter).length} </Text>
                            <Text style={styles.boxText}> Alert </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View>
                <View style={styles.bigBox}>
                    <Text style={styles.info}> Top products </Text>
                    <View style={styles.medalRow}>
                        <Ionicons name={'medal'} size={50} color='#E9C534' style={styles.icon}/>
                        <Text style={styles.boxValue}> Item 1 </Text>
                    </View>
                    <View style={styles.medalRow}>
                        <Ionicons name={'medal'} size={50} color='#B9B6AC' style={styles.icon}/>
                        <Text style={styles.boxValue}> Item 2 </Text>
                    </View>
                    <View style={styles.medalRow}>
                        <Ionicons name={'medal'} size={50} color='#A58E42' style={styles.icon}/>
                        <Text style={styles.boxValue}> Item 3 </Text>
                    </View>
                </View>
            </View>
            <View>
                <View style={styles.bigBox}>
                    <Button
                        title={'Logout'}
                        onPress={() => navigation.navigate('SignIn')}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    boxValue: {
        fontSize: 20,
    },
    boxText : {
        fontSize: 16,
        fontWeight: '100'
    },
    info: {
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    moreInfo: {
        fontSize: 14,
        fontWeight: '200',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    bigBox: {
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: "center",
        padding: 12
    },
    smallBox: {
        backgroundColor: '#E5E7E3',
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '40%',
        aspectRatio: 1.4
    },
    row : {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column : {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    medalRow : {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20
    }
})

export default ProfileScreen