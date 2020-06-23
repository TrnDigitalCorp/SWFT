import * as axios from 'axios';
import AppConfig from '../Constans';
var moment = require('moment');

function processCalendarData(calenderDate) {
    let jsonObj = {};
    try {
        jsonObj.CalenderDate = calenderDate
            ? moment(calenderDate).format(AppConfig.Calendar.CalendarDateFormat)
            : '';
    } catch (error) {
        console.log(error.response);
        jsonObj = false;
    }
    return jsonObj;
}
var CalendarDataService = {
    getCalendarData(activityDate) {
        return new Promise((resolve, reject) => {
            let payLoadObj = processCalendarData(activityDate);
            if (!payLoadObj) {
                let msg =
                    'Error in processing Data. Activity Date is not found';
                reject(msg);
            }
            axios
                .post('/api/Calendar', {jsonObj: payLoadObj})
                .then(calendarData => { 
                    resolve(calendarData.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
    getLocationdata() {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/Location')
                .then(locations => {
                    resolve(locations.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
};
export default CalendarDataService;
