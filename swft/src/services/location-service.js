import * as axios from 'axios';

var LocationService = {
    // SendEmail: () => {
    getLocationEquipmentData() {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/Location/GetLocationEquipment')
                .then(locationEquipments => {
                    resolve(locationEquipments.data);
                })
                .catch(error => {
                    console.log(error.response);
                    reject(error);
                });
        });
    },
};
export default LocationService;
