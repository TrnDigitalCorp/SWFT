import * as axios from 'axios';

let ActivityGridService = {
    getActivitiesForUser(userEmail, statusId, experimentId) {
        return new Promise((resolve, reject) => {
            axios
                .post('/api/ActivityGrid/GetActivityGridForUser', {
                    "UserEmail": userEmail,
                    "StatusId": statusId,
                    "ExperimentId": experimentId
                })
                .then(activityGridData => {
                    resolve(activityGridData);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    GetExpWithoutActivitiesGridForUser(userEmail, statusId, experimentId) {
        return new Promise((resolve, reject) => {
            axios
                .post('/api/ActivityGrid/GetExperimentGridForUser', {
                    "UserEmail": userEmail,
                    "StatusId": statusId,
                    "ExperimentId": experimentId
                })
                .then(activityGridData => {
                    resolve(activityGridData);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
};
export default ActivityGridService;