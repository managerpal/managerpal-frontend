import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    Alert,
    SafeAreaView,
    Dimensions,
    Touchable,
    TouchableOpacity
} from 'react-native';
import QRCode from 'react-native-qrcode-svg'
import SelectDropdown from 'react-native-select-dropdown'
import {Calendar, LocaleConfig} from 'react-native-calendars';

const ProductDetails = ( {route} ) => {
    const {item, quantity, id} = route.params

    const [dropdown, setDropdown] = useState();

    // Date related
    const [start_day, setStart_Day] = useState(new Date().getDay())
    const [start_month, setStart_Month] = useState(new Date().getMonth() - 1)
    const [start_year, setStart_Year] = useState(new Date().getFullYear())
    const [end_day, setEnd_Day] = useState(new Date().getDay())
    const [end_month, setEnd_Month] = useState(new Date().getMonth())
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
                console.log(data)
            }
        } catch (error) {
            console.log('updatesAPI has an error ' + error);
            Alert.alert('Updates retrieval failed', error.message);
        }
    };

    // To create the different views,
    // One for when all updates is selected
    // One for when all sales is selected
    // One for nothing

    const createViews = (sel) => {
        if (sel === 'View all Updates') {
            return (
                <View>

                </View>
            )
        } else if (sel === 'View all Sales') {
            return (
                <View>

                </View>
            )
        } else if (sel === 'View all Sales') {
            return (
                <View>
                </View>
            )
        }
    }

    React.useEffect(() => {
        updatesAPI(id, null, date)
        createViews(dropdown)
    }, [dropdown, start_day, start_month, start_year, end_day, end_month, end_year]);

    return (
        <SafeAreaView>
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
            <View>
                <SelectDropdown
                    buttonStyle={styles.dropdown}
                    buttonTextStyle={styles.dropdownText}
                    data={['View all Updates', 'View all Sales', '']}
                    onSelect={(selected, index) => {
                        setDropdown(selected)
                    }}
                    defaultButtonText={'Select View'}
                    buttonTextAfterSelection={(selected, index) => {
                        return selected;
                    }}
                    rowTextForSelection={(item, index) => {
                        return item;
                    }}
                />
            </View>
            <View>
                {createViews(dropdown)}
            </View>
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
    smallerTitle: {
        textAlign:'left',
        fontSize: 28,
        fontWeight: '300',
        marginBottom: 10,
        marginLeft: 20
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
    dropdown: {
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
