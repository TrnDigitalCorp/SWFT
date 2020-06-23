// package references
const express = require('express');

// app references
const ExperimentManager = require('../Managers/ExperimentManager');

// initialization
const expManager = new ExperimentManager();

// build router
const ExperimentRouter = () => {
    const router = express.Router();

    router       
    .get('/GetProjects', (request, response) => {
        expManager
            .getProjects()
            .then(projects => {
                response.json(projects);
            })
            .catch(error => {
                console.log(error);
                response.status(500).send(error);
        });
    })
    .post('/Add', (request, response) => {
        const jsonObj = request.body;
        if (!jsonObj.Name) {
            response.status(400).send('Experiment Name is required');
        } else if (!jsonObj.StartDate) {
            response.status(400).send('Experiment Start Date is required');
        } else if (jsonObj.Owner.Length < 1 || !jsonObj.Owner[0].Email) {
            response.status(400).send('Experiment Owner is required');
        } else if (!jsonObj.ProjectId) {
            response.status(400).send('Experiment Project is required');
        } else {
            expManager
                .addExperiment(jsonObj)
                .then(result => response.status(201).send(result))
                .catch(error => {
                    console.log(error.message);
                    response.status(500).send(error.message);
                });
        }
    })
    .post('/Update', (request, response) => {
        const jsonObj = request.body;
        if (!jsonObj.Id) {
            response.status(400).send('Experiment Id is required');
        } else if (!jsonObj.Name) {
            response.status(400).send('Experiment Name is required');
        } else if (!jsonObj.StartDate) {
            response.status(400).send('Experiment Start Date is required');
        } else if (jsonObj.Owner.Length < 1 || !jsonObj.Owner[0].Email) {
            response.status(400).send('Experiment Owner is required');
        } else if (!jsonObj.ProjectId) {
            response.status(400).send('Experiment Project is required');
        } else {
            expManager
                .updateExperiment(jsonObj)
                .then(result => response.status(201).send(result))
                .catch(error => {
                    console.log(error.message);
                    response.status(500).send(error.message);
                });
        }
    })
    .get('/:id', (request, response) => {
        const {id} = request.params;
        if (!id) {
            response.status(400).send('Id is required');
        } else {
            expManager.getExperiment(id)
                .then(experiment => response.json(experiment))
                .catch(error => {
                    console.log(error);
                    response.status(500).send();
                });
        }
    })
    .get('/:id/activities', (request, response) => {
        const {id} = request.params;
        if (!id) {
            response.status(400).send('Id is required');
        } else {
            expManager.getActivitiesForExp(id)
                .then(activities => response.json(activities))
                .catch(error => {
                    console.log(error);
                    response.status(500).send();
                });
        }
    })
    .post('/Delete', (request, response) => {
        const jsonObj = request.body;
        if (!jsonObj.ExperimentId) {
            response.status(400).send('Experiment Id is required');
        } else if (!jsonObj.Notes) {
            response.status(400).send('Notes is required');
        } else {
            expManager
                .deleteExperiment(jsonObj.ExperimentId,jsonObj.Notes)
                .then(() =>
                    response.status(200).send('Experiment deleted'),
                )
                .catch(error => {
                    console.log(error.message);
                    response.status(500).send();
                });
        }
    })
    .post('/activities/delete', (request, response) => {
        const jsonObj = request.body;
        if(jsonObj.ActivityIds.length < 1){
            response.status(400).send('Activity Array is empty');
        }
        else {
            expManager.deleteMutipleActivities(jsonObj)
                .then(activities => response.json(activities))
                .catch(error => {
                    console.log(error);
                    response.status(500).send();
                });
        }
    })
    .post('/Clone', (request, response) => {
        const jsonObj = request.body;
        if (!jsonObj.ExperimentId) {
            response.status(400).send('Experiment Id is required');
        } else {
            expManager
                .cloneExperiment(jsonObj.ExperimentId)
                .then((res) =>
                    response.send(res)
                )
                .catch(error => {
                    console.log(error.message);
                    response.status(500).send();
                });
        }
    })
    return router;
};

module.exports = ExperimentRouter;
