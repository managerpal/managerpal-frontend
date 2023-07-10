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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
            // console.log(endPoint + ' productDetails endpoint')
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

    return (
        <SafeAreaView>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {item}
                </Text>
            </View>
            <View style={styles.QRCodeBox}>
                <View>
                    <Text style={styles.info}> QR Code for: {item}</Text>
                    <Text style={styles.moreInfo}> Save this QR code and scan it in "Update" page for faster updating </Text>
                </View>
                <View style ={{alignItems: 'center'}}>
                    <QRCode value={item}/>
                </View>
            </View>
            <View style={styles.line} />
            <View>
                <Text style={styles.smallerTitle}> Product Details </Text>
                <Text style={styles.text}>Instock Quantity: {quantity} </Text>
                <Text style={styles.text}>Total Arriving: {arrQty.reduce((acc, curr) => acc + curr, 0)} </Text>
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
        fontSize: 24,
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
    calendarStart: {
        marginLeft: 20,
        width: Dimensions.get('window').width / 1.5 - 40,
    },
    calendarEnd: {
        marginRight: 20,
        width: Dimensions.get('window').width / 1.5 - 40,
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
    QRCodeBox: {
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: "center",
        padding: 12
    },
    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        margin: 20
    }
})

export default ProductDetails