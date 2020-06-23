const CalendarRepository = require('../DataAccess/CalendarRepository');
const assert = require('assert');

const calendarRepository = new CalendarRepository();
const mapTocalendar = calendar => {
    assert(
        calendar,
        'calendar Location Availability not found, which are required',
    );
    return {
        LocationId: calendar.LocationId,
        LocationName: calendar.LocationName,
        LocationDescription: calendar.LocationDescription,
        LocationCapacity: calendar.Capacity,
        ActivityLocationID: calendar.ActivityLocationID,
        ShiftId: calendar.ShiftId,
        ShiftName: calendar.ShiftName,
        ShiftDisplayName: calendar.ShiftDisplayName,
        NoOfActivities: calendar.NoOfActivities,
        ActivityId: calendar.ActivityId,
        ActivityName: calendar.ActivityName,
        ActivityDescription: calendar.ActivityDescription,
        ActivityDate: new Date(calendar.ActivityDate),
        ActivityDayOffset: calendar.ActivityDayOffset,
        BookedByEmail: calendar.BookedByEmail,
        BookedForEmail: calendar.BookedForEmail,
        BookedByName: calendar.BookedByName,
        BookedForName: calendar.BookedForName,
        IsEmployee: calendar.IsEmployee,
        EquipmentName: calendar.EquipmentName,
        ActivityId: calendar.ActivityId,
        ExperimentId: calendar.ExperimentId,
        ExperimentName: calendar.ExperimentName,
    };
};

class CalendarStorageManager {
    getCalendarData(jsonObj) {
        assert(jsonObj.CalenderDate, 'Calerdar Date is required');
        return new Promise((resolve, reject) => {
            calendarRepository
                .getCalendarData(jsonObj)
                .then(calendarData => {
                    console.log("Manager", calendarData);
                    resolve(calendarData.map(result => mapTocalendar(result)));
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

module.exports = CalendarStorageManager;
