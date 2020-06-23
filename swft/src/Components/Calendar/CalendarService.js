import * as _ from 'lodash';
import AppConfig from '../../Constans';
import CalendarDatatService from '../../services/calendar-service';
import ShiftService from '../../services/shift-service';
import * as Utils from "../utils/Utils";
import LocationService from '../../services/location-service';

const moment = require('moment');
export const today = new Date();

export function formatCalDate(date) {
    if (date) {
        return moment.utc(date).format(AppConfig.Calendar.CalendarDateFormat);
    } else {
        return moment().format(AppConfig.Calendar.CalendarDateFormat);
    }
}

export function getLocationsformLocEquip(locationEquipArr) {
    var arrayTofilter = [...locationEquipArr],
    locationIdArr = [], resultantArr = [];
    _.each(arrayTofilter,(locEquipRecord) => {
        if(locationIdArr.indexOf(locEquipRecord.LocationId) === -1){
            locationIdArr.push(locEquipRecord.LocationId);
            let obj = {};
            var equipNames  =_.map(_.filter(locationEquipArr,{LocationId:locEquipRecord.LocationId}),'EquipmentName');
            obj.LocationId = locEquipRecord.LocationId;
            obj.LocationName = locEquipRecord.LocationName;
            obj.LocationDescription = locEquipRecord.LocationDescription;
            obj.LocationCapacity = locEquipRecord.LocationCapacity;
            obj.EquipmentArr = [];
            if(equipNames && equipNames.length>0){
                obj.EquipmentArr = equipNames;
            }
            resultantArr.push({...obj});
        }
    });
    return resultantArr;
}
export function filterByLocationIdDate(calData, locationId, date) {
    var filteredCalData = [];
    filteredCalData = _.filter(calData, {
        LocationId: locationId,
        ActivityDate: date,
    });
    return filteredCalData;
}
export function formatActivityHeaderDate(date){
    let _d = new Date(date);
    // return Utils.getDateString(_d, "Da DD-MM");
    return moment.utc(_d).format(AppConfig.Calendar.NextDateDispString);
}
export function filterByLocationShiftIdDate(calData, locationId, date,shiftId) {
    var filteredCalData = [];
    filteredCalData = _.filter(calData, {
        LocationId: locationId,
        ActivityDate: date,
        ShiftId: shiftId,
    });
    return filteredCalData;
}
export function formLocationDateJson(nextDatesArr, locationData, shiftData, calendarData, currUserEmail) {    
    var resultantJsonArr = [];
    for (let index = 0; index < locationData.length; index++) {
        const eachLocation = locationData[index];
        let obj = {};
        obj.LocationCapacity = eachLocation.LocationCapacity;
        obj.LocationDescription = eachLocation.LocationDescription;
        obj.LocationId = eachLocation.LocationId;
        obj.LocationName = eachLocation.LocationName;
        obj.CalData = [];
        let shiftObjDataObj = [];
        for (let jndex = 0; jndex < nextDatesArr.length; jndex++) {
            const shiftObjArr = [];
            //remeber tbd is removed here
            for (let sndex = 0; sndex < shiftData.length - 1; sndex++) {
                const eachShiftObj = shiftData[sndex];
                var shiftObjLocal = {
                    ShiftId: eachShiftObj.Id,
                    ShiftName: eachShiftObj.Name,
                    ActivityNumber: 0,
                    ShiftColor: 'White',
                    isStar: false,
                };
                shiftObjArr.push(JSON.parse(JSON.stringify(shiftObjLocal)));
            }
            const eachNextDates = nextDatesArr[jndex];
            var objNextDates = {
                DayIndex: eachNextDates.DayIndex,
                ShiftData: shiftObjArr.splice(0),
                Date: eachNextDates.DateStringDB,
            };
            shiftObjDataObj.push(JSON.parse(JSON.stringify(objNextDates)));
        }
        obj.CalData = shiftObjDataObj.splice(0);
        resultantJsonArr.push(obj);
    }
    console.log('ResultantObj', resultantJsonArr);
    console.log('calendarData', calendarData);
    var completeObj = {};
    var returnObj = groupCalendarDataByLocByShift(calendarData, resultantJsonArr, currUserEmail);
    var actCountObjArr = countShiftWiseTotalPerDay(nextDatesArr, shiftData, returnObj.activitiesData);
    completeObj.calendarData = returnObj.calendarData;
    completeObj.activitiesData = returnObj.activitiesData;
    completeObj.totolCountArr = actCountObjArr;
    console.log(completeObj);
    return completeObj;
}
/**
 * Returns array for calendar row with the number of uniq users per shift per day in all locations
 * @param {next 7 days array} nextDatesArr 
 * @param {four shifts data} shiftData 
 * @param {Calendar activities data} calendarData 
 */
function countShiftWiseTotalPerDay(nextDatesArr,shiftData, calendarData){
    var resultantArr = []; 
    for (let jndex = 0; jndex < nextDatesArr.length; jndex++) {
        const eachNextDates = nextDatesArr[jndex];
        const shiftObjArr = [];
        //remeber tbd is removed here
        for (let sndex = 0; sndex < shiftData.length - 1; sndex++) {
            const eachShiftObj = shiftData[sndex];
            var filterByShiftDate = _.map(_.filter(calendarData,{ActivityDate:eachNextDates.DateStringDB,ShiftId:eachShiftObj.Id}),'BookedForEmail');
            var uiqActIds = filterByShiftDate?_.uniq(filterByShiftDate):[];   
            var shiftObjLocal = {
                    ShiftId: eachShiftObj.Id,
                    ShiftName: eachShiftObj.Name,
                    ActivityNumber: uiqActIds?uiqActIds.length:0,
                    ShiftColor: 'White',
                    isStar: false,
                };
            shiftObjArr.push({...shiftObjLocal});
        }
        var objNextDates = {
            DayIndex: eachNextDates.DayIndex,
            ShiftData: shiftObjArr.splice(0),
            Date: eachNextDates.DateStringDB,
            TotalInLocation:0
        };
        resultantArr.push({...objNextDates});
    }
    return resultantArr;
}
function groupCalendarDataByLocByShift(calendarData, locationDateJson, currUserEmail) {
    var resultantGroupedArr = locationDateJson,groupedEquipmentsArr= [];
    for (let index = 0; index < resultantGroupedArr.length; index++) {
        const eachLocationDateJson = resultantGroupedArr[index];
        var locCapacity = eachLocationDateJson.LocationCapacity;
        _.each(eachLocationDateJson.CalData, function (dayobj) {
            let groupByLocationAndDate = _.filter(calendarData, {
                LocationId: eachLocationDateJson.LocationId,
                ActivityDate: dayobj.Date,
            });
            let groupedByEquip = Utils.groupByEquipment(groupByLocationAndDate); 
            dayobj.TotalInLocation = groupedByEquip.length > 0 ? groupedByEquip.length : 0;
            if (groupedByEquip.length > 0) {
              _.forEach(groupedByEquip, (value)=>{groupedEquipmentsArr.push(value)});
                let groupByShift = _.groupBy(groupedByEquip, 'ShiftId');
                if (groupByShift) {
                    _.each(dayobj.ShiftData, function (shiftObj) {
                        var shiftActivities = groupByShift[shiftObj.ShiftId];
                        if (shiftActivities) {
                            var bookedForArr = [];
                            bookedForArr =  _.map(shiftActivities,'BookedForEmail');
                            // bookedByArr = _.map(shiftActivities,'BookedByEmail');
                            // let allPersonEmail = bookedForArr.concat(bookedByArr);
                            let uniqPersons = _.uniq(bookedForArr);
                            shiftObj.ActivityNumber = uniqPersons.length;
                            shiftObj.ShiftColor = indicateShiftColor(uniqPersons.length,locCapacity);
                            shiftObj.isStar = isCurrUserData(shiftActivities,currUserEmail);
                        }
                    });
                }
            }
        });
    }
    var returnObj ={};
    returnObj.calendarData = resultantGroupedArr;
    returnObj.activitiesData = groupedEquipmentsArr;
    return returnObj;
}

function indicateShiftColor(noOfActivities,locCapacity){
    if(noOfActivities === 0 ) {
        return 'White';
    }
    if(noOfActivities< locCapacity) {
        return 'Green';
    }
    if(noOfActivities === locCapacity) {
        return 'Grey';
    }
    if(noOfActivities> locCapacity) {
        return 'Red';
    } 
}
function isCurrUserData(shiftActivities,currUserEmail){
    // var allBookedByEmails = _.map(shiftActivities,'BookedByEmail');
    var allBookedForEmails = _.map(shiftActivities,'BookedForEmail');
    if(allBookedForEmails && allBookedForEmails.indexOf(currUserEmail)!==-1){
        return true;
    }
    return false;
}
export function getShiftDataForCalendar() {
    return new Promise((resolve, reject) => {
        ShiftService.getShiftsData()
            .then(shifts => resolve(shifts))
            .catch(error => {
                reject(error);
            });
    });
}
export function getCalendarDataByDate(activityDate) {
    return new Promise((resolve, reject) => {
        CalendarDatatService.getCalendarData(activityDate)
            .then(calData => {    
                resolve(calData);
            })
            .catch(error => {
                reject(error);
            });
    });
}
export function getLocationsEquipments() {
    return new Promise((resolve, reject) => {
        CalendarDatatService.getLocationdata()
            .then(locationEquipData => resolve(locationEquipData))
            .catch(error => {
                reject(error);
            });
    });
}
const daysArr = ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'];
export function getNextDaysArr(startDate, daysToAdd) {
    var strdateSting= moment(startDate).format(AppConfig.DateFormats.NoTimeDate);
    var aryDates = [];
    if (daysToAdd > 0) {
        aryDates = [];
        for (var i = 0; i <= daysToAdd; i++) {
            var currentDate = new Date(strdateSting);
            currentDate.setDate(currentDate.getDate() + i);
            // var  nextDateObjStr = moment.utc(currentDate).format(AppConfig.DateFormats.NoTimeDate);
            var  nextDateObj = currentDate;//new Date(nextDateObjStr);
            var arrdateObj = {};
            arrdateObj.DayIndex = daysArr[i];
            arrdateObj.Day = Utils.getDayName(currentDate.getDay(), true, false);
            arrdateObj.DateObj = nextDateObj;
            arrdateObj.DateString = moment(nextDateObj).format(AppConfig.Calendar.NextDateDispString);
            arrdateObj.DateStringDB =  moment(nextDateObj).format(AppConfig.Calendar.CalendarDateFormat) + '.000Z';
            aryDates.push({...arrdateObj});
        }
    }
    console.log(aryDates);
    return aryDates;
}

export const CalendarLinks = [
    {
        order: 1,
        Name: 'View  My Scheduled Activities',
        RedirectURI: '/MyActivities',
    },
    {
        order: 2,
        Name: 'Plan an experiment (series of activities)',
        RedirectURI: '/PlanExperiment',
    },
    {
        order: 2,
        Name: 'Plan an individual activity',
        RedirectURI: '/PlanExperiment',
    },
    {
        order: 3,
        Name: 'Plan office space usage',
        RedirectURI: '/PlanActivity',
    },
];
