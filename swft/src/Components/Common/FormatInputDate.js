import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import AppConfig from '../../Constans';
import CacheManager from '../../services/CachecManager';

/**
 * moment format YYYY-MM-DD HH:mm:ss
 * @ inputDate should be javascriptDateObj
 * @timeZone default from app config or else the user selection
 */
export function formUTCDate(inputDate, inputTz) {
    var date = 0,
        month = 0,
        year = 0,
        hrs = 0,
        mins = 0,
        dateStr = '',
        tzDate = '',
        utcDate = '',
        dateZone = '',
        dateInput = '';

    dateZone = inputTz ? inputTz : AppConfig.TimeZone;
    dateInput = _.isDate(inputDate) ? inputDate : new Date(inputDate);
    year = formatZero(dateInput.getFullYear());
    month = formatZero(dateInput.getMonth() + 1);
    date = formatZero(dateInput.getDate());
    hrs = formatZero(dateInput.getHours());
    mins = formatZero(dateInput.getMinutes());
    var format = AppConfig.flatPickrOutputFormat; //'YYYY-MM-DD HH:mm:ss';
    dateStr = year + '-' + month + '-' + date + 'T' + hrs + ':' + mins + ':00';
    tzDate = moment.tz(dateStr, format, dateZone);
    utcDate = moment(tzDate).utc().format(AppConfig.utcDateFormat);
    testZones(tzDate);
    // console.log('dateStr:' + dateStr);
    // console.log('UTC Date:' + utcDate);
    return utcDate;
}
export function convrtDateToTZ(inputDate, inputTz) {
    var tzDate = '',
        utcDate = '';
    if (inputDate && inputTz) {
        tzDate = moment(inputDate).utc();
        utcDate = moment.tz(tzDate, inputTz).format(AppConfig.utcDateFormat);
        // console.log('UTC Date:' + utcDate);
    }
    return utcDate;
}
function formatZero(value) {
    let valueStr = '';
    if (value <= 9) {
        valueStr = '0' + value;
    } else {
        valueStr = value;
    }
    return valueStr;
}
function testZones(tzDate) {
    var obj = {};
    var format = 'DD/MM/YYYY hh:mm:ss A Z z';
    obj.Brisbane = moment.tz(tzDate, 'Australia/Brisbane').format(format);
    obj.Shanghai = moment.tz(tzDate, 'Asia/Shanghai').format(format);
    obj.NewYork = moment.tz(tzDate, 'America/New_York').format(format);
    obj.Denver = moment.tz(tzDate, 'America/Denver').format(format);
    obj.Kolkata = moment.tz(tzDate, 'Asia/Kolkata').format(format);
    // console.log(obj);
}
/**
 * input UTC string
 * output bool = true if greater than now
 */
export function CheckGreaterThanNow(inputDate) {
    var momentNow = moment.now(),
        cmpDate = moment.utc(inputDate),
        flag = false;
    flag = cmpDate.diff(momentNow) > 0;
    return flag;
}
export function formatInputDateField(inputUTCStr) {
    let inputUTC = '',
        outputDate = '';
    if (inputUTCStr) {
        inputUTC = moment(inputUTCStr).utc();
        outputDate = inputUTC.format(AppConfig.utcDateFormat);
    }
    return outputDate;
}
export function convrtUtcToTz(inputUTCStr, tz) {
    let inputUTC = moment(inputUTCStr).utc(),
        outputDate = '',
        zone = '';
    if (inputUTCStr) {
        zone = tz ? tz : AppConfig.TimeZone;
        outputDate = moment
            .tz(inputUTC, zone)
            .format(AppConfig.flatPickrInputFormat);
    }
    return outputDate;
}
export function convrtUtcToTzString(inputUTCStr, tz) {
    let inputUTC = moment(inputUTCStr).utc(),
        outputDate = '',
        zone = '';
    if (inputUTCStr && tz) {
        zone = tz ? tz : AppConfig.TimeZone;
        outputDate = moment
            .tz(inputUTC, zone)
            .format(AppConfig.viewFormDateFormat);
    }
    return outputDate;
}
export function formatGridDate(inputDate, inputFormat) {
    let outDateStr = '',
        utcDate = '';
    try {
        let appConfig = CacheManager.getCacheItem('AppConfig');
        if (appConfig && appConfig.value) {
            let AppConfiguration = appConfig.value;
            let format = AppConfiguration.dateFormat
                ? AppConfiguration.dateFormat
                : AppConfig.dateFormat;
            let dispformat = inputFormat ? inputFormat : format;
            let tz = AppConfiguration.TimeZone
                ? AppConfiguration.TimeZone
                : AppConfig.TimeZone;
            utcDate = moment(inputDate).utc();
            outDateStr = moment.tz(utcDate, tz).format(dispformat);
            return outDateStr;
        } else {
            utcDate = moment(inputDate).utc();
            outDateStr = moment
                .tz(utcDate, AppConfig.TimeZone)
                .format(AppConfig.dateFormat);
            return outDateStr;
        }
    } catch (err) {
        console.log('Err:convertUtcToTz', err);
        utcDate = moment(inputDate).utc();
        outDateStr = moment
            .tz(utcDate, AppConfig.TimeZone)
            .format(AppConfig.dateFormat);
        return outDateStr;
    }
}

export function getUtcString(tzDate) {
    let utcDate = moment(tzDate).utc().format(AppConfig.utcDateFormat);
    return utcDate;
}
export function getFlatPickrString(tzDate) {
    let utcDate = moment(tzDate).utc().format(AppConfig.flatPickrInputFormat);
    return utcDate;
}
