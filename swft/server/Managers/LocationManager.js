const LocationRepository = require('../DataAccess/LocationRepository');
const assert = require('assert');

const locationRepository = new LocationRepository();
const mapToLocation = location => {
    assert(location, 'Location not found, which are required');
    return {
        LocationId: location.LocationId,
        LocationName: location.LocationName,
        LocationCapacity: location.LocationCapacity,
        LocationDescription: location.LocationDescription,
    };
};
const mapToLocationEquipment = locationEquipment => {
    assert(
        locationEquipment,
        'Location Equipment not found, which are required',
    );
    return {
        LocationId: locationEquipment.LocationId,
        LocationName: locationEquipment.LocationName,
        LocationDescription: locationEquipment.LocationDescription,
        LocationCapacity: locationEquipment.LocationCapacity,
        EquipmentTypeId: locationEquipment.EquipmentTypeId,
        EquipmentId: locationEquipment.EquipmentId,
        EquipmentName: locationEquipment.EquipmentName,
    };
};

class LocationStorageManager {
    findLocationById(id) {
        assert(id, 'Location Id is required');
        return new Promise((resolve, reject) => {
            locationRepository
                .getLocationDataById(id)
                .then(location => resolve(mapToLocation(location)))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    listLocations() {
        return new Promise((resolve, reject) => {
            locationRepository
                .getLocationData()
                .then(locations =>
                    resolve(locations.map(result => mapToLocationEquipment(result))),
                )
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    listLocationEquipments() {
        return new Promise((resolve, reject) => {
            locationRepository
                .getLocationEquipmentData()
                .then(locations =>
                    resolve(
                        locations.map(result => mapToLocationEquipment(result)),
                    ),
                )
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

module.exports = LocationStorageManager;
