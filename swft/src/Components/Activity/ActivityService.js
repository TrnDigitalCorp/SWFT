import * as _ from 'lodash';
import ShiftService from '../../services/shift-service';
import LocationService from '../../services/location-service';
import AppConfig from '../../Constans';
import ActivityService from '../../services/activity-service';
import ExperimentService from '../../services/experiment-service';
var moment = require('moment');


export function formatActivityDate(date) {
    if (date) {
        return moment(date).format(AppConfig.ActivityForm.AtivityDateFormat);
    } else {
        return moment().format(AppConfig.ActivityForm.AtivityDateFormat);
    }
}
export function formatNonTimeDate(date) {
    if(date){
        return moment.utc(date).format(AppConfig.DateFormats.NoTimeDate);
    }else{
        return null;
    }
}
export function differentiateOfficeFromActivity(isOffice,locationDetails){

}
export function getUniqueLocationObjs(equipmentLocationsArr,office) {
    var pushedLocations = [];
    if(!office){
        //remove location Offfice form form
        pushedLocations.push(AppConfig.ActivityForm.officeSpaceUsageLocation);
    }
    let uniqArr = _.filter(equipmentLocationsArr, function (o) {
        if (pushedLocations.indexOf(o.LocationId) === -1) {
            pushedLocations.push(o.LocationId);
            let obj = {};
            obj.LocationId = o.LocationId;
            obj.LocationName = o.LocationName;
            obj.LocationDescription = o.LocationDescription;
            obj.LocationCapacity = o.LocationCapacity;
            return obj;
        }
    });
    return uniqArr;
}
export function formLocationShiftAvailabilityArr(locations,shifts,lsActivityData,isOffice) {
    var pushedLSAs = [];
    for (let locaIndex = 0; locaIndex < locations.length; locaIndex++) {
        let locationObj = locations[locaIndex];
        let lsaObj = {};
        lsaObj.LocationId = locationObj.LocationId;
        lsaObj.LocationName = locationObj.LocationName;
        lsaObj.LocationDescription = locationObj.LocationDescription;
        lsaObj.LocationCapacity = locationObj.LocationCapacity;
        for (let shiftIndex = 0; shiftIndex < shifts.length; shiftIndex++) {
            let shiftObj = shifts[shiftIndex];
            lsaObj.ShiftId = shiftObj.Id;
            lsaObj.ShiftName = shiftObj.Name;
            lsaObj.ShiftStartHour = shiftObj.StartHour;
            lsaObj.ShiftStartMin = shiftObj.StartMin;
            lsaObj.ShiftEndHour = shiftObj.EndHour;
            lsaObj.ShiftEndMin = shiftObj.EndMin;
            lsaObj.ShiftDisplayName = shiftObj.DisplayName;
            if(lsActivityData.length>0){
                let filterdlsaArr = _.filter(lsActivityData,{ShiftId:shiftObj.Id,LocationId:locationObj.LocationId});
                if(filterdlsaArr.length>0){
                    var bookedForArr = [];
                    bookedForArr =  _.map(filterdlsaArr,'BookedForEmail');
                    let uniqPersons = _.uniq(bookedForArr);
                    if(shiftObj.Id === AppConfig.ActivityForm.TBDRejectShiftId){
                        lsaObj.NoOfActivities = uniqPersons.length;
                        lsaObj.Status = uniqPersons.length +"/?";
                        lsaObj.IndicationColor = "Green";                        
                        lsaObj.OnAlert = false;                        
                    }else{
                        lsaObj.NoOfActivities = uniqPersons.length;
                        lsaObj.Status = uniqPersons.length + "/" +locationObj.LocationCapacity;
                        lsaObj.IndicationColor = uniqPersons.length >= locationObj.LocationCapacity ?"Red": "Green";
                        lsaObj.OnAlert = uniqPersons.length >= locationObj.LocationCapacity;
                    }
                }
                else{
                    if(shiftObj.Id === AppConfig.ActivityForm.TBDRejectShiftId){
                        lsaObj.NoOfActivities = 0;
                        lsaObj.Status = "0/?";
                        lsaObj.IndicationColor = "Green";  
                        lsaObj.OnAlert = false;                        
                    }else{
                        lsaObj.NoOfActivities = 0;
                        lsaObj.Status = "0/"+locationObj.LocationCapacity;
                        lsaObj.IndicationColor = "Green";
                        lsaObj.OnAlert = false;  
                    }
                }

            }
            else{
                if(shiftObj.Id === AppConfig.ActivityForm.TBDRejectShiftId){
                    lsaObj.Status = "0/?";
                    
                }else{
                    lsaObj.Status = "0/"+locationObj.LocationCapacity;
                }
                lsaObj.IndicationColor = "Green";
            }  
            if(isOffice){
                if(lsaObj.LocationId === AppConfig.ActivityForm.officeSpaceUsageLocation){
                    pushedLSAs.push(JSON.parse(JSON.stringify(lsaObj)));
                }
            }
            else{
                pushedLSAs.push(JSON.parse(JSON.stringify(lsaObj)));
            }          
        }
    }
 
    return _.orderBy(pushedLSAs,'ShiftName');
}
export function getShiftData() {
    return new Promise((resolve, reject) => {
        ShiftService.getShiftsData()
            .then(shifts => resolve(shifts))
            .catch(error => {
                reject(error);
            });
    });
}
export function getShiftLocationAvaliability(activityObj) {
    return new Promise((resolve, reject) => {
        ShiftService.getShiftLocationAvaliability(activityObj)
            .then(shiftLocationAvailabilities =>
                resolve(shiftLocationAvailabilities),
            )
            .catch(error => {
                reject(error);
            });
    });
}
export function getLocationEquipments() {
    return new Promise((resolve, reject) => {
        LocationService.getLocationEquipmentData()
            .then(shifts => resolve(shifts))
            .catch(error => {
                reject(error);
            });
    });
}
export function createActivity(activityObj,type) {
    return new Promise((resolve, reject) => {
        ActivityService.createActivityRecord(activityObj,type)
            .then(activity => resolve(activity))
            .catch(error => {
                reject(error);
            });
    });
}
export function cloneActivity(activityObj) {
    return new Promise((resolve, reject) => {
        ActivityService.CloneIndividualActivity(activityObj)
            .then(activity => resolve(activity))
            .catch(error => {
                reject(error);
            });
    });
}
export function updateActivity(activityObj,type,notes) {
    return new Promise((resolve, reject) => {
        ActivityService.updateActivityRecord(activityObj,type,notes)
            .then(activity => resolve(activity))
            .catch(error => {
                reject(error);
            });
    });
}
export function getActivityByID(activityId) {
    return new Promise((resolve, reject) => {
        ActivityService.getActivityById(activityId)
            .then(activity => resolve(activity))
            .catch(error => {
                reject(error);
            });
    });
}
export function deleteActivityRecordByID(id,notes) {
    return new Promise((resolve, reject) => {
        ActivityService.deleteActivityRecordById(id,notes)
            .then(deleteFlag => resolve(deleteFlag))
            .catch(error => {
                reject(error);
            });
    });
}
export function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
