import * as axios from 'axios';
import AppConfig from '../Constans';
const moment = require('moment');
function processDeleteActivity(id,notes) {
    let jsonObj = {};
    try {
        jsonObj.ActivityId = id;
        jsonObj.ExperimentId = 0;
        jsonObj.Notes = notes;
    } catch (error) {
        console.log(error);
        jsonObj = false;
    }
    return jsonObj;
}
function processActivity(activityObj,type) {
    let jsonObj = {};
    try {
        jsonObj.ActivityName = activityObj.activityName;
        jsonObj.ActivityDescription = activityObj.activityDescription;
        jsonObj.DayOffset = type === AppConfig.ActivityForm.OfcAndIndiActivityType? 0: activityObj.DayOffset;
        jsonObj.ActivityDate = activityObj.activityDate
        ? moment(activityObj.activityDate).format(AppConfig.ActivityForm.AtivityDateFormat)
        : '';
        jsonObj.ShiftIds = activityObj.selectedShiftIds;
        jsonObj.BookedByName = activityObj.bookedByEmail.DisplayName;
        jsonObj.BookedByEmail = activityObj.bookedByEmail.Email;
        jsonObj.IsEmployee = !activityObj.showVisitorField;
        if(activityObj.showVisitorField){
            jsonObj.BookedForEmail = activityObj.visitorEmail;
            jsonObj.BookedForName = activityObj.visitorEmail.split('@')[0];
        }else{
            if(activityObj.bookedForEmail.length>0){
                jsonObj.BookedForName = activityObj.bookedForEmail[0].DisplayName;            
                jsonObj.BookedForEmail = activityObj.bookedForEmail[0].Email; 
            }
            else{
                return false;
            }
        }      
        jsonObj.LocationIds = activityObj.selectedLocations;
        jsonObj.EquipmentIds = activityObj.selectedEquipments; 
        jsonObj.ExperimentId = activityObj.ExperimentId?activityObj.ExperimentId:null;
        if(activityObj.ExperimentId){
            let experimentDate = moment(activityObj.ExperimentStartDate);
            let actviityDate = moment(activityObj.activityDate);
            let offsetValue = Math.ceil(actviityDate.diff(experimentDate,'days'));
            jsonObj.DayOffset = offsetValue;
        }       
    } catch (error) {
        console.log(error);
        jsonObj = false;
    }
    return jsonObj;
}
var ActivityService = {
    cloneActivity(jsonObj) {
        return new Promise((resolve, reject) => {
            axios
            .post(`/api/Activity/Clone`,jsonObj)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
    getActivityById(id) {
        return new Promise((resolve, reject) => {
            axios
                .get(`/api/Activity/${id}`)
                .then(shifts => {
                    resolve(shifts.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
    deleteActivityRecordById(id,notes) {        
        return new Promise((resolve, reject) => {
            let payLoadObj = processDeleteActivity(id,notes);
            if (!payLoadObj) {
                let msg = 'Error in processing Data. Activity Date not found';
                reject(msg);
            }
            axios
                .put(`/api/Activity/Delete`,{jsonObj:payLoadObj})
                .then(shifts => {
                    resolve(shifts.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
    createActivityRecord(activityObj,type) {
        return new Promise((resolve, reject) => {
            let payLoadObj = processActivity(activityObj,type);
            if (!payLoadObj) {
                let msg = 'Error in processing Data. Activity Date not found';
                reject(msg);
            }else{
                payLoadObj.Notes = "Creation of activity by "+ payLoadObj.BookedByName +" for "+payLoadObj.BookedForName+" on "
            + payLoadObj.ActivityDate;
            }
            axios
                .post('/api/Activity', {
                    jsonObj: payLoadObj,
                })
                .then(activity => {
                    resolve(activity.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
    updateActivityRecord(activityObj,type,notes) {
        return new Promise((resolve, reject) => {
            let payLoadObj = processActivity(activityObj,type);
            if (!payLoadObj) {
                let msg = 'Error in processing Data. Activity Date not found';
                reject(msg);
            }else{
                payLoadObj.Id = activityObj.Id;
                payLoadObj.Notes = notes;
            }
            axios
                .put('/api/Activity', {
                    jsonObj: payLoadObj,
                })
                .then(activity => {
                    resolve(activity.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
    CloneIndividualActivity(actObj){
        return new Promise((resolve, reject) => {
            axios
                .post('/api/Activity/Clone', actObj)
                .then(res => {
                    resolve(res.data);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
};
export default ActivityService;
