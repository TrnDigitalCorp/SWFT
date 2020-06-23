import * as axios from 'axios';
import AppConfig from '../Constans';

function processShiftLocationAvailability(activityObj) {
    let jsonObj = {};
    try {
        jsonObj.ActivityDate = activityObj.activityDate
            ? activityObj.activityDate
            : '';
    } catch (error) {
        console.log(error.response);
        jsonObj = false;
    }
    return jsonObj;
}
var ShiftService = {
    // SendEmail: () => {
    getShiftsData() {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/Shifts')
                .then(shifts => {
                    resolve(shifts.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
    getShiftLocationAvaliability(activityObj) {
        return new Promise((resolve, reject) => {
            let payLoadObj = processShiftLocationAvailability(activityObj);
            if (!payLoadObj) {
                let msg = 'Error in processing Data. Activity Date not found';
                reject(msg);
            }
            axios
                .post('/api/Shifts/GetLocationAvailability', {
                    jsonObj: payLoadObj,
                })
                .then(shiftLocationAvailabilities => {
                    resolve(shiftLocationAvailabilities.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
};
export default ShiftService;
