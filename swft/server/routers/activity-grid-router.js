// package references
const express = require('express');

// app references
const ActivityGridManager = require('../Managers/ActivityGridManager');

// initialization
const activityGridManager = new ActivityGridManager();

// build router

const activityGridRouter = () => {
    const router = express.Router();

    router       
    .post('/GetActivityGridForUser', (request, response) => {
        const jsonObj = request.body;
            activityGridManager
                .getActivitiesForUser(jsonObj)
                .then(activityGrid =>
                    response.json(activityGrid),
                )
                .catch(error => {
                    console.log(error);
                    response.status(500).send(error);
                });
    })
    .post('/GetExperimentGridForUser', (request, response) => {
        const jsonObj = request.body;
            activityGridManager
                .getExpWithoutActivities(jsonObj)
                .then(experimentGrid =>
                    response.json(experimentGrid),
                )
                .catch(error => {
                    console.log(error);
                    response.status(500).send(error);
                });
    });
    return router;
};

module.exports = activityGridRouter;
