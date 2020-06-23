const ShiftRepository = require('../DataAccess/ShiftRepository');
const assert = require('assert');

const shiftRepository = new ShiftRepository();
const mapToShift = shift => {
    assert(shift, 'Shifts not found, which are required');

    return {
        Id: shift.Id,
        Name: shift.Name,
        StartHour: shift.StartHour,
        StartMin: shift.StartMin,
        EndHour: shift.EndHour,
        EndMin: shift.EndMin,
        DisplayName: shift.DisplayName,
    };
};
const mapToShiftLocationAvailabilities = shift => {
    assert(shift, 'Shift Location Availability not found, which are required');

    return {
        ShiftId: shift.ShiftId,
        ShiftDisplayName: shift.ShiftDisplayName,
        LocationId: shift.LocationId,
        LocationName: shift.LocationName,
        LocationDescription: shift.LocationDescription,
        NoOfActivities: shift.NoOfActivities,
        LocationCapacity: shift.LocationCapacity,
        IndicationColor: shift.Color,
    };
};

class ShiftStorageManager {
    findShiftById(id) {
        assert(id, 'Shift Id is required');
        return new Promise((resolve, reject) => {
            shiftRepository
                .getShiftDataById(id)
                .then(shift => resolve(mapToShift(shift)))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    listShifts() {
        return new Promise((resolve, reject) => {
            shiftRepository
                .getShiftData()
                .then(shifts =>
                    resolve(shifts.map(result => mapToShift(result))),
                )
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    listShiftLocationAvailability(jsonObj) {
        const selectionObbj = jsonObj;
        return new Promise((resolve, reject) => {
            shiftRepository
                .getShiftLocationAvailability(selectionObbj.ActivityDate)
                .then(shiftLocationAvailabilities =>
                    resolve(shiftLocationAvailabilities),
                )
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

module.exports = ShiftStorageManager;
