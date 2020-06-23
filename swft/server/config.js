module.exports = {
    server: {
        port: process.env.PORT || 3000,
        https: false,
    },
    dataSource: 'sql',
    dbConfig: {
        server: process.env.SERVER, // Use your SQL server name
        database: process.env.DATABASE, // Database to connect to
        user: process.env.SQL_USER_LOGIN, // Use your username
        password: process.env.SQL_USER_PSWD, // Use your password
        port: 1433,
        connectionTimeout: 300000,
        requestTimeout: 300000,
        // Since we're on Windows Azure, we need to set the following options
        options: {
            encrypt: true,
        },
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    },
    GetCalendarDataSP: process.env.USP_GET_CALENDAR_DATA_ALL,
    GetAllLocationDataSP: process.env.USP_GET_LOCATION_DATA_ALL,
    GetAllShiftDataSP: process.env.USP_GET_SHIFTS_DATA_ALL,
    GetAllLocationAndEquipments: process.env.USP_GET_LOCATION_AND_EQUIPMENT,
    GetActivitiesForUser: process.env.USP_GET_ACTIVITIES_FOR_USER,
    GetExpWithoutActiviesForUser: process.env.USP_GET_EXP_WITHOUT_ACTIVITIES_FOR_USER,
    GetShiftLocationAvailability:process.env.USP_GET_SHIFT_LOCATION_AVAILABILITY,
    GetSystemAdminDataSP:process.env.USP_GET_SYSTEM_ADMIN_DATA,
    CreateActivity:process.env.USP_CREATE_ACTIVITY,
    GetActivityByID:process.env.USP_GET_ACTIVITY_BY_ID,
    CancelExperimentOrActivity:process.env.USP_CANCEL_EXPERIMENT_ACTIVITY,
    UpdateActivity:process.env.USP_UPDATE_ACTIVITY,
    GetAllProjectsDataSP:process.env.USP_GET_PROJECTS_DATA_ALL,
    CreateExperiment: process.env.USP_CREATE_EXPERIMENT,
    UpdateExperiment: process.env.USP_UPDATE_EXPERIMENT,
    CancelMulActivities: process.env.USP_CANCEL_ACTIVITIES,
    GetExperiment: process.env.USP_GET_EXPERIMENT, 
    CloneActivity: process.env.USP_CLONE_ACTIVITY,
    CloneExperiment: process.env.USP_CLONE_EXPERIMENT
};
