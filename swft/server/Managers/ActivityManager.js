const assert = require('assert');

const ActivityRepository = require('../DataAccess/ActivityRepository');
const activityRepository = new ActivityRepository();

const mapToActivityDatato = activity => {
    assert(activity, 'Activity is required');
    return {       
        ExperimentId: activity.ExperimentId,
        ExperimentOwner: activity.ExperimentOwner,
        ExperimentOwnerName: activity.ExperimentOwnerName,
        ExperimentStatusId: activity.ExperimentStatusId,
        ExperimentStartDate: activity.ExperimentStartDate,
        ActivityId: activity.ActivityId,
        ActivityName: activity.ActivityName,
        DayOffset: activity.DayOffset,
        ActivityDescription: activity.ActivityDescription,
        ActivityDate:activity.ActivityDate,
        ActivityDayOffset: activity.ActivityDayOffset,
        BookedByEmail: activity.BookedByEmail,
        BookedForEmail: activity.BookedForEmail,
    };
};
const mapToActivityIdData = activity => {
}

class ActivityManager {
    addActivity(jsonObj) {
        const activity = jsonObj;
        assert(jsonObj.ActivityName, 'Activity Name is required');
        assert(jsonObj.ActivityDate, 'Activity Date is required');
        return new Promise((resolve, reject) => {
            activityRepository
                .addActivity(activity)
                .then(result => {
                    resolve(result.id)
                })
                .catch(error => reject(error));
        });
    }
    findActivityById(id) {
        assert(id, 'Id is required');

        return new Promise((resolve, reject) => {
            activityRepository
                .findActivityById(id)
                .then(activity =>
                    resolve(activity),
                )
                .catch(error => reject(error));
        });
    }
    cloneActivity(jsonObj) {
        assert(jsonObj.ActivityId, 'Activity Id is required');
        return new Promise((resolve, reject) => {
            activityRepository
                .cloneActivity(jsonObj)
                .then(newActivity =>
                    resolve(newActivity),
                )
                .catch(error => reject(error));
        });
    }
    findActivitiesByTitle(title) {
        assert(title, 'Title is required');

        return new Promise((resolve, reject) => {
            activityRepository
                .findActivitiesByTitle(title)
                .then(activitys =>
                    resolve(
                        activitys.map(activity =>
                            mapToActivityDto(activity),
                        ),
                    ),
                )
                .catch(error => reject(error));
        });
    }
    listActivities() {
        return new Promise((resolve, reject) => {
            activityRepository
                .listActivities()
                .then(activitys =>
                    resolve(
                        activitys.map(activity =>
                            mapToActivityDto(activity),
                        ),
                    ),
                )
                .catch(error => reject(error));
        });
    }
    removeActivity(id,notes) {
        assert(id, 'Id is required');
        assert(notes, 'Notes is required');

        return new Promise((resolve, reject) => {
            activityRepository
                .removeActivity(id,notes)
                .then((result) => resolve(result))
                .catch(error => reject(error));
        });
    }
    updateActivity(id, activity) {
        return new Promise((resolve, reject) => {
            activityRepository
                .updateActivity(id, activity)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }
    updateDiscard(id, jsonObj) {
        const activity = jsonObj;
        activity.updatedDate = new Date();
        return new Promise((resolve, reject) => {
            activityRepository
                .updateActivity(id, activity)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }
    removeMultipleActivity(idArray) {
        const activity = idArray;
        return new Promise((resolve, reject) => {
            activityRepository
                .updateManyActivity(activity)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }
}

module.exports = ActivityManager;
