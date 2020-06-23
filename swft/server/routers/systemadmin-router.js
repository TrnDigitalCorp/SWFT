'use strict';

// package references
const express = require('express');

// app references
const SystemAdminManager = require('../Managers/SystemAdminManager');

// initialization
const systemAdminManager = new SystemAdminManager();

// build router

const systemadminRouter = () => {
    const router = express.Router();

    
    router 
    .get('/', (request, response) => {
        systemAdminManager
            .getSystemAdmins()
            .then(systemadminData => response.json(systemadminData))
            .catch(error => {
                console.log(error);
                response.status(500).send(error);
            });
    });

    return router;
};

module.exports = systemadminRouter;
