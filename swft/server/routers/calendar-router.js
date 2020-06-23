'use strict';

// package references
const express = require('express');

// app references
const CalendarManager = require('../Managers/CalendarManager');

// initialization
const calendarManager = new CalendarManager();

// build router

const calendarRouter = () => {
    const router = express.Router();

    router.post('/', (request, response) => {
        const {jsonObj} = request.body;
        if (!jsonObj.CalenderDate) {
            response.status(400).send('Calendar Date is required');
        } else {
            calendarManager
                .getCalendarData(jsonObj)
                .then(calendarData => {
                    response.json(calendarData)
                })
                .catch(error => {
                    console.log(error);
                    response.status(500).send(error);
                });
        }
    });

    return router;
};

module.exports = calendarRouter;
