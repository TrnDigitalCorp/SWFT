// package references
const express = require('express');

// app references
const ProjectManager = require('../Managers/ProjectManager');

// initialization
const projectManager = new ProjectManager();

// build router

const projectRouter = () => {
    const router = express.Router();

    router
    .get('/', (request, response) => {
        projectManager
            .listProjects()
            .then(projects => response.json(projects))
            .catch(error => {
                console.log(error);
                response.status(500).send(error);
            });
    });

    return router;
};

module.exports = projectRouter;
