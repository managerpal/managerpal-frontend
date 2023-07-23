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
    const [alertFilter, setAlertFilter] = React.useState(5)

    const [itemqty, setItemQty] = React.useState([])
    const [itemArray, setItemArray] = useState([]);
    const [itemID, setItemID] = React.useState([]);

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
                const names = data.items.map(item => item.name);
                setItemArray(names);
                const id = data.items.map(item => item.id);
                setItemID(id)
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

    const [profit, setProfit] = useState(null);
    const [totalSold, setTotalSold] = useState(null);
    const  salesAPI = async (productId, dates) => {
        let endPoint = 'https://managerpal.seewhyjay.dev/inventory/product_detailed'
        if (productId) {
            endPoint += `?product_id=${productId}`;
        }
        if (dates) {
            const [startDate, endDate] = dates.split(',');
            endPoint += `&dates=${startDate},${endDate}`;
        }
        try {
            const response = await fetch(endPoint);
            const data = await response.json();
            if (response.status === 400) {
                throw new Error('Sales retrieve failed');
            } else {
                setProfit(data.profit)
                setTotalSold(data.total_sold)
                console.log(endPoint)
            }
        } catch (error) {
            console.log('salesAPI has an error ' + error);
        }
    };

    const [profitArray, setProfitArray] = useState([]);
    const [soldArray, setTotalSoldArray] = useState([]);

    React.useEffect(() => {
        let tempProfArr = []
        let tempSoldArr = []
        arrivingGETAPI()
        searchGet()
    }, []);

    // const barData = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];

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