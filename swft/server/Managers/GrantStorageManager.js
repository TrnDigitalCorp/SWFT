const GrantStorageRepository = require('../DataAccess/GrantStorageRepository');
const grantStorageRepository = new GrantStorageRepository();

class GrantStorageManager {
    addGrantRequest(jsonObj) {
        const grantRequest = jsonObj;
        grantRequest.SurveyDate = grantRequest.SurveyDate
            ? new Date(grantRequest.SurveyDate)
            : new Date();
        return new Promise((resolve, reject) => {
            grantStorageRepository
                .addGrantRequest(grantRequest)
                .then(result => resolve(result.id))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

module.exports = GrantStorageManager;
