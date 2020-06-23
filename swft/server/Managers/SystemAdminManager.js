const SystemAdminRepository = require('../DataAccess/SystemAdminRepository');
const assert = require('assert');

const systemAdminRepository = new SystemAdminRepository();
const mapTosysadmin = sysadmin => {   
    
    return {
        SystemAdminId: sysadmin.SystemAdminId,
        SystemAdminName: sysadmin.SystemAdminName,
        SystemAdminEmailId: sysadmin.SystemAdminEmailId,       
    };
};

class SystemAdminManager {
    getSystemAdmins(jsonObj) {       
        return new Promise((resolve, reject) => {
            systemAdminRepository
                .getSystemAdminData(jsonObj)
                .then(sysadminData => {
                    resolve(sysadminData.map(result => mapTosysadmin(result)));
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

module.exports = SystemAdminManager;
