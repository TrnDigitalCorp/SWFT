import * as axios from 'axios';

var SystemAdminService = {
    // SendEmail: () => {
    getSystemAdmin() {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/SystemAdmin')
                .then(systemAdmin => {
                    resolve(systemAdmin.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
};
export default SystemAdminService;
