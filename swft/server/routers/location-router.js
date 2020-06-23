// package references
const express = require('express');

// app references
const LocationManager = require('../Managers/LocationManager');

// initialization
const locationManager = new LocationManager();

// build router

const locationRouter = () => {
    const router = express.Router();

    router
        .get('/GetLocationEquipment', (request, response) => {
            locationManager
                .listLocationEquipments()
                .then(locationEquipments => response.json(locationEquipments))
                .catch(error => {
                    console.log(error);
                    response.status(500).send(error.message);
                });
        })
        .get('/:id', (request, response) => {
            const {id} = request.params;
            if (!id) {
                response.status(400).send('Id is required');
            } else {
                locationManager
                    .findLocationById(id)
                    .then(location => response.json(location))
                    .catch(error => {
                        console.log(error);
                        response.status(500).send(error);
                    });
            }
        })
        .get('/', (request, response) => {
            locationManager
                .listLocations()
                .then(locations => response.json(locations))
                .catch(error => {
                    console.log(error);
                    response.status(500).send(error);
                });
        });

    return router;
};

module.exports = locationRouter;
