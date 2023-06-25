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
import SelectDropdown from 'react-native-select-dropdown'
import {Calendar, LocaleConfig} from 'react-native-calendars';

const ProductDetails = ( {route} ) => {
    const {item, arrivingQty, quantity} = route.params
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    LocaleConfig.locales['fr'] = {
        monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        dayNamesShort: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        today: "Today"
    };

    LocaleConfig.defaultLocale = 'fr';

    const calendarStart = () => {
        return (
            <View>
                <Calendar style = {styles.calendarStart}
                          onDayPress={day => {
                              setStartDate(day.dateString);
                          }}
                          markedDates={{
                              [startDate]: {startDate: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                          }}
                />
            </View>
        )
    }

    const calendarEnd =
        <View>
            <Calendar style = {styles.calendarEnd}
                      onDayPress={day => {
                          setEndDate(day.dateString);
                      }}
                      markedDates={{
                          [endDate]: {endDate: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                      }}
            />
        </View>

    const dateBar =
        <View>
            <TouchableOpacity
                style={{color: (startDate == '') ? 'grey' : 'black'}}
                onPress={() => calendarStart()}
            >
                <Text>
                    {(startDate == '') ? 'Start Date' : startDate}
                </Text>
            </TouchableOpacity>
        </View>

    const enterDate = () => {

    }

    return (
        <SafeAreaView>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {item}
                </Text>
            </View>
            <View>
                <Text style={styles.text}>Quantity: {quantity} </Text>
                <Text style={styles.text}>Arriving: {arrivingQty}</Text>
            </View>
            {dateBar}
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
    calendarStart: {
        marginLeft: 20,
        width: Dimensions.get('window').width / 1.5 - 40,
    },
    calendarEnd: {
        marginRight: 20,
        width: Dimensions.get('window').width / 1.5 - 40,
    }
})

export default ProductDetails