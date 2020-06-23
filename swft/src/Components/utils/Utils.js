import AppConfig from '../../Constans';
const moment = require('moment');

export function groupByEquipment (rawArray) {            
    let groupedArr=[];
    rawArray.forEach((item, index)=>{
        let groupedItem = groupedArr.filter(i => {return i.ActivityId===item.ActivityId && i.ShiftId===item.ShiftId});
        if(groupedItem.length<1){
            groupedArr.push(item);
        }
        else{                
            if (groupedItem[0].EquipmentName != item.EquipmentName && item.EquipmentName!=null){
                groupedItem[0].EquipmentName = groupedItem[0].EquipmentName+"," + item.EquipmentName
            }
        }
    });    
    return groupedArr;        
}
export function formatCalDate(date) {
    if (date) {
        return moment(date).format(AppConfig.Calendar.CalendarDateFormat);
    } else {
        return moment().format(AppConfig.Calendar.CalendarDateFormat);
    }
}
export function strEqualsCI(string1, string2){
    return string1.toUpperCase()===string2.toUpperCase();
}
export function getDateString(date, format){
    if(date){
        let _d = new Date(date);
        if(format){
            switch(format){
                case "Da DD-MM": 
                    return getDayName(_d.getDay(), false, false) + " " + _d.getDate().toString().padStart(2,'0') + "-" + getMonthName(_d.getMonth(), false, false);                                        
                default:
                    return _d.toISOString();
            }
        }
        else{
            return _d.toISOString();
        }
    }
    else{
        return "";
    }
}
export function getDayName(dayNumber, long, allcaps){
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];    
    return (
        (long) ? 
            ( allcaps ? days[dayNumber].toUpperCase() : days[dayNumber]) : 
                ( allcaps ? days[dayNumber].toUpperCase().substring(0,3) : days[dayNumber].substring(0,3)));
}
export function getMonthName(monthNumber, long, allcaps){
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
    return (
        (long) ? 
            ( allcaps ? months[monthNumber].toUpperCase() : months[monthNumber]) : 
                ( allcaps ? months[monthNumber].toUpperCase().substring(0,3) : months[monthNumber].substring(0,3)));
}