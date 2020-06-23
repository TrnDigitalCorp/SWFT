const ActivityGridRepository = require('../DataAccess/ActivityGridRepository');
const assert = require('assert');

const activityGridRepository = new ActivityGridRepository();
const mapToActivityGrid = grid => {
    assert(grid, 'Activities not found for this user.');

    return {
        ActivityId: grid.ActivityId,
		ActivityName: grid.ActivityName,
		ActivityDate: grid.ActivityDate,
		ActivityDescription: grid.ActivityDescription,
		BookedByEmail: grid.BookedByEmail,
		BookedForEmail: grid.BookedForEmail,
		DayOffset: grid.DayOffset,
		ExperimentId: grid.ExperimentId,
		ExperimentName: grid.ExperimentName,
		Owner: grid.Owner,
		ShiftName: grid.ShiftName,
		LocationName: grid.LocationName,
		EquipmentName: grid.EquipmentName
    };
};

class ActivityGridManager {
    getActivitiesForUser(jsonObj) {        
        //assert(jsonObj.UserEmail, 'User email is required');
        return new Promise((resolve, reject) => {
            activityGridRepository
                .getActivityGridData(jsonObj)
                //.then(gridData => resolve(gridData.map(result => mapToActivityGrid(result))))
                .then(gridData => resolve(gridData))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }    
    getExpWithoutActivities(jsonObj) {        
        return new Promise((resolve, reject) => {
            activityGridRepository
                .getExpWithoutActivities(jsonObj)
                .then(gridData => resolve(gridData))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }    
}

module.exports = ActivityGridManager;
