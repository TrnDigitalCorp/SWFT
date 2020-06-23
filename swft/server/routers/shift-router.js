// package references
const express = require('express');

// app references
const ShiftManager = require('../Managers/ShiftManager');

// initialization
const shiftManager = new ShiftManager();

// build router

const shiftRouter = () => {
    const router = express.Router();

    router
        .post('/GetLocationAvailability', (request, response) => {
            const {jsonObj} = request.body;
            console.log(jsonObj);
            if (!jsonObj.ActivityDate) {
                response.status(400).send('Activity Date is required');
            } else {
                shiftManager
                    .listShiftLocationAvailability(jsonObj)
                    .then(shiftLocationAvailability =>
                        response.json(shiftLocationAvailability),
                    )
                    .catch(error => {
                        console.log(error);
                        response.status(500).send(error);
                    });
            }
        })
        .get('/:id', (request, response) => {
            const {id} = request.params;
            if (!id) {
                response.status(400).send('Id is required');
            } else {
                shiftManager
                    .findShiftById(id)
                    .then(shift => response.json(shift))
                    .catch(error => {
                        console.log(error);
                        response.status(500).send(error);
                    });
            }
        })
        .get('/', (request, response) => {
            shiftManager
                .listShifts()
                .then(shifts => response.json(shifts))
                .catch(error => {
                    console.log(error);
                    response.status(500).send(error);
                });
        });

    return router;
};

module.exports = shiftRouter;
