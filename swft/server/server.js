// package references
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const dotEnvConfig = require('dotenv').config();

// app references
const calendarRouter = require('./routers/calendar-router');
const locationRouter = require('./routers/location-router');
const shiftRouter = require('./routers/shift-router');
const activityGridRouter = require('./routers/activity-grid-router');
const systemAdminRouter = require('./routers/systemadmin-router');
const activityRouter = require('./routers/activity-router');
const experimentRouter = require('./routers/experiment-router');

// initialization
const PORT = process.env.PORT || 3001;

const PROJECT_ROOT = path.join(__dirname, '..');
// configure server

const server = express();

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cors());
server.use(morgan('combined'));
server.use(express.static(path.join(PROJECT_ROOT, 'server/build')));

server.use('/api/Shifts', shiftRouter(PORT));
server.use('/api/Location', locationRouter(PORT));
server.use('/api/Calendar', calendarRouter(PORT));
server.use('/api/ActivityGrid', activityGridRouter(PORT));
server.use('/api/SystemAdmin', systemAdminRouter(PORT));
server.use('/api/Activity', activityRouter(PORT));
server.use('/api/Experiment',experimentRouter(PORT));

server.get('/*', (req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, 'server/build/index.html'));
});

// start server

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ...`);
});
