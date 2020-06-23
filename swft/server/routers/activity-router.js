// package references
const express = require('express');

// app references
const ActivityManager = require('../Managers/ActivityManager');

// initialization
const activityManager = new ActivityManager();

// build router

const ActivityRouter = () => {
    const router = express.Router();

    router
        .delete('/', (request, response) => {
            const {jsonObj} = request.body;
            console.log(jsonObj);
            if (!jsonObj.ActivityId) {
                response.status(400).send('Id is required');
            } else if (!jsonObj.Notes) {
                response.status(400).send('Id is required');
            } else {
                activityManager
                    .removeActivity(jsonObj.ActivityId,jsonObj.Notes)
                    .then(() =>
                        response.status(200).send('Activity deleted'),
                    )
                    .catch(error => {
                        console.log(error.message);
                        response.status(500).send();
                    });
            }
        })
        .get('/:id', (request, response) => {
            const {id} = request.params;

            if (!id) {
                response.status(400).send('Id is required');
            } else {
                activityManager
                    .findActivityById(id)
                    .then(Activity => response.json(Activity))
                    .catch(error => {
                        console.log(error);
                        response.status(500).send(error);
                    });
            }
        })
        .post('/Clone', (request, response) => {
            const jsonObj = request.body;
            if (!jsonObj.ActivityId) {
                response.status(400).send('Activity Id is required');
            } else {
                activityManager
                    .cloneActivity(jsonObj)
                    .then(newActivity => {
                        response.json(newActivity)
                    })
                    .catch(error => {
                        console.log(error);
                        response.status(500).send({error:error.message});
                    });
            }
        })
        .post('/', (request, response) => {
            const {jsonObj} = request.body;
            if (!jsonObj.ActivityName) {
                response.status(400).send('Activity Name is required');
            } else if (!jsonObj.ActivityDate) {
                response.status(400).send('Activity Date is required');
            } else if (!jsonObj.BookedByEmail) {
                response.status(400).send('Booked By Email Result is required');
            } else if (!jsonObj.BookedForEmail) {
                response.status(400).send('Booked For Email is required');
            } else {
                activityManager
                    .addActivity(jsonObj)
                    .then(id => response.status(201).send({id: id}))
                    .catch(error => {
                        console.log(error.message);
                        response.status(500).send(error.message);
                    });
            }
        })
        .put('/', (request, response) => {
            const {jsonObj} = request.body;
            if (!jsonObj.Id) {
                response.status(400).send('Activity Id is required');
            } else if (!jsonObj.ActivityName) {
                response.status(400).send('Activity Name is required');
            } else if (!jsonObj.ActivityDate) {
                response.status(400).send('Activity Date is required');
            } else if (!jsonObj.BookedByEmail) {
                response.status(400).send('Booked By Email Result is required');
            } else if (!jsonObj.BookedForEmail) {
                response.status(400).send('Booked For Email is required');
            } else {
                activityManager
                    .updateActivity(jsonObj.Id,jsonObj)
                    .then(id => response.status(201).send({id: id}))
                    .catch(error => {
                        console.log(error.message);
                        response.status(500).send(error.message);
                    });
            }
        })
        .put('/Delete', (request, response) => {
            const {jsonObj} = request.body;
            if (!jsonObj.ActivityId) {
                response.status(400).send('Id is required');
            } else if (!jsonObj.Notes) {
                response.status(400).send('Id is required');
            } else {
                activityManager
                    .removeActivity(jsonObj.ActivityId,jsonObj.Notes)
                    .then(() =>
                        response.status(200).send('Activity deleted'),
                    )
                    .catch(error => {
                        console.log(error.message);
                        response.status(500).send();
                    });
            }
        });

    return router;
};

module.exports = ActivityRouter;
