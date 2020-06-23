// package references
const express = require('express');

// app references
// const grantRequestManager = require('../Services/grantRequestManager');
const GrantStorageManager = require('../Services/GrantStorageManager');

// initialization
// const communicationManager = new grantRequestManager();
const grantStorage = new GrantStorageManager();

// build router

const settingsRouter = () => {
    const router = express.Router();

    router.post('/', (request, response) => {
        const {jsonObj} = request.body;
        if (!jsonObj.Name) {
            response.status(400).send('User Name is required');
        } else if (!jsonObj.Email) {
            response.status(400).send('User Email is required');
        } else if (!jsonObj.SurveyResult) {
            response.status(400).send('Screening Result is required');
        } else {
            grantStorage
                .addGrantRequest(jsonObj)
                .then(id => response.status(201).send({id: id}))
                .catch(error => {
                    console.log(error);
                    response.status(500).send(error);
                });
        }
    });

    return router;
};

module.exports = settingsRouter;
