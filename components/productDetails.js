import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Alert,
    Button,
    SafeAreaView, TouchableOpacity, FlatList,
    ScrollView, Dimensions
} from 'react-native';
import QRCode from 'react-native-qrcode-svg'
import SelectDropdown from 'react-native-select-dropdown'
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

const ProductDetails = ( {route} ) => {
    const {item, quantity, id} = route.params

    const [dropdownView, setDropdownView] = useState('');
    const [updates, setUpdates] = useState([]);

    // Date related
    const [start_day, setStart_Day] = useState(new Date().getDate())
    const [start_month, setStart_Month] = useState(new Date().getMonth() + 1)
    const [start_year, setStart_Year] = useState(1900)
    const [end_day, setEnd_Day] = useState(new Date().getDate())
    const [end_month, setEnd_Month] = useState(new Date().getMonth() + 1)
    const [end_year, setEnd_Year] = useState(new Date().getFullYear())
    const [date, setDate] =
        useState(start_year + '-' + start_month + '-' + start_day +
            ',' + end_year + '-' + end_month + '-' + end_day)

    // To get arriving information for that item
    const [arrQty, setArrQty] = useState([]);
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
        arrivingGETAPI(id);
        // console.log(id + ' item id')
    }, [item]);

    // API call for all updates
    const updatesAPI = async (productId, num, dates) => {
        const updates = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        let endPoint = 'https://managerpal.seewhyjay.dev/inventory/list_updates'
        if (productId) {
            endPoint += `?product_id=${productId}`;
        }
        if (num) {
            endPoint += `&num=${num}`
        }
        if (dates) {
            const [startDate, endDate] = dates.split(',');
            endPoint += `&dates=${startDate},${endDate}`;
        }
        try {
            const response = await fetch(endPoint, updates);
            const data = await response.json();
            if (response.status === 400) {
                throw new Error('Update retrieve failed');
            } else {
                setUpdates(data)
                console.log(data)
                console.log(endPoint + ' updates endpoint')
            }
        } catch (error) {
            console.log('updatesAPI has an error ' + error);
            // Alert.alert('Updates retrieval failed', error.message);
        }
    };

    const [profit, setProfit] = useState(null);
    const [totalBought, setTotalBought] = useState(null);
    const [totalExpense, setTotalExpense] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState(null);
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
                setTotalBought(data.total_bought)
                setTotalExpense(data.total_expense)
                setTotalRevenue(data.total_revenue)
                setTotalSold(data.total_sold)
                console.log(endPoint)
            }
        } catch (error) {
            console.log('salesAPI has an error ' + error);
        }
    };

    const [salesObject, setSalesObject] = useState(null);

    React.useEffect(() => {
        updatesAPI(id, null, date)
        salesAPI(id, date)
        createViews(dropdownView)
        console.log(date + ' current filter date')
    }, [dropdownView, date]);

    // For the green or red display in Updates
    const displayArr = (title, arr) => {
        if (title == 'buy' && arr == true) {
            return (
                <Text style={styles.qtyTrue}>
                    Order has arrived
                </Text>
            )
        }
        if (title == 'buy' && arr == false) {
            return (
                <Text style={styles.qtyFalse}>
                    Order has not arrived
                </Text>
            )
        }
    }

    // For updates list
    const Item = ({ title, arr, qty, price, date }) => (
        <View>
            <TouchableOpacity
                style={styles.card}
                onPress={() => {}}
            >
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>Action: {title}</Text>
                    <Text>
                        {displayArr(title, arr)}
                    </Text>
                    <Text style={styles.qty}>Quantity: {qty}</Text>
                    <Text style={styles.qty}>Price: {price}</Text>
                    <Text style={styles.qty}>Date: {date}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    // To create the different views,
    // One for when all updates is selected
    // One for when all sales is selected
    // One for nothing

    const createViews = (sel) => {
        if (sel === 'View all Updates') {
            return (
                <View>
                    <SafeAreaView>
                        <FlatList
                            data={updates}
                            renderItem={({ item, index }) => (
                                <Item title={item.action}
                                      arr={item.arrived}
                                      qty={item.qty}
                                      price={item.price.toFixed(2)}
                                      date={item.date}
                                />
                            )}
                        />
                    </SafeAreaView>
                </View>
            )
        } else if (sel === 'View product performance') {
            return (
                <View style={styles.bigBox}>
                    <Text style={styles.info}>Finance information</Text>
                    <View style={styles.smallBoxForDate}>
                        <Text style={ profit < 0? styles.profitFalse : styles.profitTrue}>{profit}</Text>
                        <Text style={styles.boxText}>Total Profit</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.smallBox}>
                            <View style={styles.column}>
                                <Text style={styles.boxValue}>{totalExpense}</Text>
                                <Text style={styles.boxText}>Total</Text>
                                <Text style={styles.boxText}>Expense</Text>
                            </View>
                        </View>
                        <View style={styles.smallBox}>
                            <View style={styles.column}>
                                <Text style={styles.boxValue}>{totalRevenue}</Text>
                                <Text style={styles.boxText}>Total</Text>
                                <Text style={styles.boxText}>Revenue</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.info}>Stock information</Text>
                    <View style={styles.row}>
                        <View style={styles.smallBox}>
                            <View style={styles.column}>
                                <Text style={styles.boxValue}>{totalBought}</Text>
                                <Text style={styles.boxText}>Total</Text>
                                <Text style={styles.boxText}>Bought</Text>
                            </View>
                        </View>
                        <View style={styles.smallBox}>
                            <View style={styles.column}>
                                <Text style={styles.boxValue}>{totalSold}</Text>
                                <Text style={styles.boxText}>Total</Text>
                                <Text style={styles.boxText}>Sold</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else if (sel === '') {
            return (
                <View>
                </View>
            )
        }
    }

    // 'All', '1 month', '3 months', '6 months', '1 year'
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
        for (let i = 2023; i >= 1900; i--) {
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

    const changeCurrentDate = () => {
        setDate(start_year + '-' + start_month + '-' + start_day +
            ',' + end_year + '-' + end_month + '-' + end_day)
    }

    const [filterSelect, setFilterSelect] = useState(false)
    const filterDate = () => {
        if (filterSelect) {
            return (
                <View style={styles.bigBox}>
                    <View style={styles.columnForDate}>
                        <Text style={styles.info}>Set Filter</Text>
                        <View style={styles.smallBoxForDate}>
                            <View style={styles.column}>
                                <View style={styles.column}>
                                    <Text>Start Date</Text>
                                    <View style={styles.row}>
                                        <SelectDropdown
                                            buttonStyle={styles.dropdownDate}
                                            buttonTextStyle={styles.dropdownText}
                                            data={createDropdownDateDay()}
                                            onSelect={(selected, index) => {
                                                setStart_Day(selected)
                                            }}
                                            defaultButtonText={'D'}
                                            buttonTextAfterSelection={(selected, index) => {
                                                return selected;
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item;
                                            }}
                                        />
                                        <SelectDropdown
                                            buttonStyle={styles.dropdownDate}
                                            buttonTextStyle={styles.dropdownText}
                                            data={months()}
                                            onSelect={(selected, index) => {
                                                setStart_Month(selected)
                                            }}
                                            defaultButtonText={'M'}
                                            buttonTextAfterSelection={(selected, index) => {
                                                return selected;
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item;
                                            }}
                                        />
                                        <SelectDropdown
                                            buttonStyle={styles.dropdownDate}
                                            buttonTextStyle={styles.dropdownText}
                                            data={createDropdownDateYear()}
                                            onSelect={(selected, index) => {
                                                setStart_Year(selected)
                                            }}
                                            defaultButtonText={'Y'}
                                            buttonTextAfterSelection={(selected, index) => {
                                                return selected;
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item;
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.column}>
                                    <Text>End Date</Text>
                                    <View style={styles.row}>
                                        <SelectDropdown
                                            buttonStyle={styles.dropdownDate}
                                            buttonTextStyle={styles.dropdownText}
                                            data={createDropdownDateDay()}
                                            onSelect={(selected, index) => {
                                                setEnd_Day(selected)
                                            }}
                                            defaultButtonText={'D'}
                                            buttonTextAfterSelection={(selected, index) => {
                                                return selected;
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item;
                                            }}
                                        />
                                        <SelectDropdown
                                            buttonStyle={styles.dropdownDate}
                                            buttonTextStyle={styles.dropdownText}
                                            data={months()}
                                            onSelect={(selected, index) => {
                                                setEnd_Month(selected)
                                            }}
                                            defaultButtonText={'M'}
                                            buttonTextAfterSelection={(selected, index) => {
                                                return selected;
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item;
                                            }}
                                        />
                                        <SelectDropdown
                                            buttonStyle={styles.dropdownDate}
                                            buttonTextStyle={styles.dropdownText}
                                            data={createDropdownDateYear()}
                                            onSelect={(selected, index) => {
                                                setEnd_Year(selected)
                                            }}
                                            defaultButtonText={'Y'}
                                            buttonTextAfterSelection={(selected, index) => {
                                                return selected;
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item;
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Button title={'Submit Filter'} onPress={() => {
                            changeCurrentDate()
                            setFilterSelect(false)
                        }}/>
                    </View>
                </View>
            )
        } else {
            return
        }
    }


    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.card}>
                    <Text style={styles.title}>
                        {item}
                    </Text>
                </View>
                <View style={styles.bigBox}>
                    <View>
                        <Text style={styles.info}> QR Code for: {item}</Text>
                        <Text style={styles.moreInfo}> Save this QR code and scan it in "Update" page for faster updating </Text>
                    </View>
                    <View style ={{alignItems: 'center'}}>
                        <QRCode value={item}/>
                    </View>
                </View>
                <View style={styles.bigBox}>
                    <Text style={styles.info}> Product Details </Text>
                    <View style={styles.row}>
                        <View style={styles.smallBox}>
                            <View style={styles.column}>
                                <Text style={styles.boxValue}>{quantity}</Text>
                                <Text style={styles.boxText}> Instock </Text>
                            </View>
                        </View>
                        <View style={styles.smallBox}>
                            <View style={styles.column}>
                                <Text style={styles.boxValue}>{arrQty.reduce((acc, curr) => acc + curr, 0)}</Text>
                                <Text style={styles.boxText}> Arriving </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <SafeAreaView style={styles.row}>
                    <SelectDropdown
                        buttonStyle={styles.dropdown}
                        buttonTextStyle={styles.dropdownText}
                        data={['View all Updates', 'View product performance', '']}
                        onSelect={(selected, index) => {
                            setDropdownView(selected)
                        }}
                        defaultButtonText={'Select View'}
                        buttonTextAfterSelection={(selected, index) => {
                            return selected;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                    />
                    <Button
                        title={'Set Filter'}
                        onPress={() => filterSelect ? setFilterSelect(false) : setFilterSelect(true)}
                    />
                </SafeAreaView>
                <View>{filterDate()}</View>
                <View>
                    {createViews(dropdownView)}
                </View>
            </ScrollView>
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
        fontSize: 16,
        marginBottom: 8,
        marginLeft: 20,
        marginTop: 5,
    },
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
        aspectRatio: 1.3
    },
    row : {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    column : {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    dropdown: {
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        flex: 1,
        marginLeft: 20,
        marginRight: 20
    },
    dropdownDate: {
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#444',
        flex: 1,
        marginBottom: 20,
        margin: 0.8
    },
    dropdownText: {
        color: '#444',
        textAlign: 'center'
    },
    qty: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 5,
        marginTop: 5,
    },
    qtyTrue: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 5,
        marginTop: 8,
        color: 'green'
    },
    qtyFalse: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 5,
        marginTop: 5,
        color: 'red'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    smallBoxForDate: {
        backgroundColor: '#E5E7E3',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginLeft:20,
        width: '89%',
    },
    columnForDate: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'left',
        flex: 1
    },
    profitTrue: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 5,
        marginTop: 8,
        color: 'green'
    },
    profitFalse: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 5,
        marginTop: 5,
        color: 'red'
    },
})

export default ProductDetails

// LocaleConfig.locales['fr'] = {
//     monthNames: [
//         'January',
//         'February',
//         'March',
//         'April',
//         'May',
//         'June',
//         'July',
//         'August',
//         'September',
//         'October',
//         'November',
//         'December'
//     ],
//     monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
//     dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//     dayNamesShort: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
//     today: "Today"
// };
//
// LocaleConfig.defaultLocale = 'fr';
//
// const calendarStart = () => {
//     return (
//         <View>
//             <Calendar style = {styles.calendarStart}
//                       onDayPress={day => {
//                           setStartDate(day.dateString);
//                       }}
//                       markedDates={{
//                           [startDate]: {startDate: true, disableTouchEvent: true, selectedDotColor: 'orange'}
//                       }}
//             />
//         </View>
//     )
// }
//
// const calendarEnd =
//     <View>
//         <Calendar style = {styles.calendarEnd}
//                   onDayPress={day => {
//                       setEndDate(day.dateString);
//                   }}
//                   markedDates={{
//                       [endDate]: {endDate: true, disableTouchEvent: true, selectedDotColor: 'orange'}
//                   }}
//         />
//     </View>
//
// const dateBar =
//     <View>
//         <TouchableOpacity
//             style={{color: (startDate == '') ? 'grey' : 'black'}}
//             onPress={() => calendarStart()}
//         >
//             <Text>
//                 {(startDate == '') ? 'Start Date' : startDate}
//             </Text>
//         </TouchableOpacity>
//     </View>
//
// const enterDate = () => {
//
// }


// if (sel === 'All') {
//     setStart_Day(new Date().getDate())
//     setStart_Month(new Date().getMonth() + 1)
//     start_year(1900)
//     setEnd_Day(new Date().getDate())
//     setEnd_Month(new Date().getMonth() + 1)
//     setEnd_Year(new Date().getFullYear())
// }
// if (sel === '1 month') {
//     setStart_Day(new Date().getDate())
//     setEnd_Day(new Date().getDate())
//     if (new Date().getMonth() === 0) {
//         setStart_Month(12)
//         setEnd_Month(new Date().getMonth() + 1)
//         start_year(new Date().getFullYear() - 1)
//         setEnd_Year(new Date().getFullYear())
//     } else {
//         setStart_Month(new Date().getMonth() + 1)
//         start_year(new Date().getFullYear())
//         setEnd_Month(new Date().getMonth() + 1)
//         setEnd_Year(new Date().getFullYear())
//     }
// } if (sel === '3 months') {
//     setStart_Day(new Date().getDate())
//     setEnd_Day(new Date().getDate())
//     if (new Date().getMonth() === 0) {
//         setStart_Month(12)
//         setEnd_Month(new Date().getMonth() + 1)
//         start_year(new Date().getFullYear() - 1)
//         setEnd_Year(new Date().getFullYear())
//     } else {
//         setStart_Month(new Date().getMonth() + 1)
//         start_year(new Date().getFullYear())
//         setEnd_Month(new Date().getMonth() + 1)
//         setEnd_Year(new Date().getFullYear())
//     }
// }

// <View style={styles.container}>
//     <View>
//     <Text style={styles.text}>Set Filter</Text>
// </View>
// <View style={styles.filterContainer}>
//     <View style={styles.column}>
//         <Text style={styles.text}>
//             Start Date:
//         </Text>
//         <View style={styles.row}>
//             <SelectDropdown
//                 buttonStyle={styles.dropdown}
//                 buttonTextStyle={styles.dropdownText}
//                 data={createDropdownDateDay()}
//                 onSelect={(selected, index) => {
//                     setStart_Day(selected)
//                 }}
//                 defaultButtonText={'DD'}
//                 buttonTextAfterSelection={(selected, index) => {
//                     return selected;
//                 }}
//                 rowTextForSelection={(item, index) => {
//                     return item;
//                 }}
//             />
//             <SelectDropdown
//                 buttonStyle={styles.dropdown}
//                 buttonTextStyle={styles.dropdownText}
//                 data={months()}
//                 onSelect={(selected, index) => {
//                     setStart_Month(selected)
//                 }}
//                 defaultButtonText={'MM'}
//                 buttonTextAfterSelection={(selected, index) => {
//                     return selected;
//                 }}
//                 rowTextForSelection={(item, index) => {
//                     return item;
//                 }}
//             />
//             <SelectDropdown
//                 buttonStyle={styles.dropdown}
//                 buttonTextStyle={styles.dropdownText}
//                 data={createDropdownDateYear()}
//                 onSelect={(selected, index) => {
//                     setStart_Year(selected)
//                 }}
//                 defaultButtonText={'YY'}
//                 buttonTextAfterSelection={(selected, index) => {
//                     return selected;
//                 }}
//                 rowTextForSelection={(item, index) => {
//                     return item;
//                 }}
//             />
//         </View>
//     </View>
//     <View style={styles.toContainer}>
//         <Text style={styles.qty}>to</Text>
//     </View>
//     <View style={styles.column}>
//         <Text style={styles.text}>
//             End Date:
//         </Text>
//         <View style={styles.row}>
//             <SelectDropdown
//                 buttonStyle={styles.dropdown}
//                 buttonTextStyle={styles.dropdownText}
//                 data={createDropdownDateDay()}
//                 onSelect={(selected, index) => {
//                     setEnd_Day(selected)
//                 }}
//                 defaultButtonText={'DD'}
//                 buttonTextAfterSelection={(selected, index) => {
//                     return selected;
//                 }}
//                 rowTextForSelection={(item, index) => {
//                     return item;
//                 }}
//             />
//             <SelectDropdown
//                 buttonStyle={styles.dropdown}
//                 buttonTextStyle={styles.dropdownText}
//                 data={months()}
//                 onSelect={(selected, index) => {
//                     setEnd_Month(selected)
//                 }}
//                 defaultButtonText={'MM'}
//                 buttonTextAfterSelection={(selected, index) => {
//                     return selected;
//                 }}
//                 rowTextForSelection={(item, index) => {
//                     return item;
//                 }}
//             />
//             <SelectDropdown
//                 buttonStyle={styles.dropdown}
//                 buttonTextStyle={styles.dropdownText}
//                 data={createDropdownDateYear()}
//                 onSelect={(selected, index) => {
//                     setEnd_Year(selected)
//                 }}
//                 defaultButtonText={'YY'}
//                 buttonTextAfterSelection={(selected, index) => {
//                     return selected;
//                 }}
//                 rowTextForSelection={(item, index) => {
//                     return item;
//                 }}
//             />
//         </View>
//     </View>
// </View>
// </View>