const config = require('../config');
const dbConfig = config.dbConfig;
var sql = require('mssql');
const DbConnection = require('./DbConnection');
const dbConnection = () => new DbConnection(dbConfig, sql);

class ActivityGridRepository {
    getActivityGridData(jsonObject) {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.getActivityGridForUserFromDB(db, jsonObject)
                        .then(result => {
                            resolve(result);
                        })
                        .catch(error => {
                            console.log(error);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    getActivityGridForUserFromDB(db, jsonObject) {
        return new Promise((resolve, reject) => {
            db.request()
                .input('userEmail', sql.VarChar(255), jsonObject.UserEmail)
                .input('statusId', sql.Int, jsonObject.StatusId)                
                .input('experimentId', sql.Int, jsonObject.ExperimentId)     
                .execute(config.GetActivitiesForUser)
                .then(result => {
                    console.log(result);
                    // connection.close();
                    resolve(result.recordset);
                })
                .catch(error => {
                    console.log(error);
                    // connection.close();
                    reject(error);
                });
        });
    }
    getExpWithoutActivities(jsonObject) {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.getExpWithoutActivitiesFromDB(db, jsonObject)
                        .then(result => {
                            resolve(result);
                        })
                        .catch(error => {
                            console.log(error);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    getExpWithoutActivitiesFromDB(db, jsonObject) {
        return new Promise((resolve, reject) => {
            db.request()
                .input('ownerEmail', sql.VarChar(255), jsonObject.UserEmail)
                .input('statusId', sql.Int, jsonObject.StatusId)   
                .execute(config.GetExpWithoutActiviesForUser)
                .then(result => {
                    console.log(result);
                    // connection.close();
                    resolve(result.recordset);
                })
                .catch(error => {
                    console.log(error);
                    // connection.close();
                    reject(error);
                });
        });
    }
    
}
module.exports = ActivityGridRepository;
