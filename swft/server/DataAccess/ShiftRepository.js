const config = require('../config');
const dbConfig = config.dbConfig;
var sql = require('mssql');
const DbConnection = require('./DbConnection');
const dbConnection = () => new DbConnection(dbConfig, sql);

class ShiftRepository {
    getShiftDataById(grantRequest) {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .open()
                .then(db => {
                    this.getShiftDataFromDb(connection, id)
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
                    //connection.close();
                    reject(error);
                });
        });
    }
    getShiftData() {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.getShiftDataFromDb(db)
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
                    //connection.close();
                    reject(error);
                });
        });
    }
    getShiftLocationAvailability(activityDate) {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.getShiftLocationAvailabilityFromDb(
                        db,
                        activityDate,
                    )
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
                    //connection.close();
                    reject(error);
                });
        });
    }
    getShiftLocationAvailabilityFromDb(db, activityDate) {
        return new Promise((resolve, reject) => {
            db.request()
                .input('ActivityDate', sql.VarChar(50), activityDate)
                .execute(config.GetShiftLocationAvailability)
                .then(result => {
                    //connection.close();
                    resolve(result.recordset);
                })
                .catch(error => {
                    console.log(error);
                    //connection.close();
                    reject(error);
                });
        });
    }
    getShiftDataFromDb(db, id) {
        return new Promise((resolve, reject) => {
            db.request()
                .input('Id', sql.Int, id)
                .execute(config.GetAllShiftDataSP)
                .then(result => {
                    //connection.close();
                    resolve(result.recordset);
                })
                .catch(error => {
                    console.log(error);
                    //connection.close();
                    reject(error);
                });
        });
    }
    addDataToDB(db, grantRequest) {
        return new Promise((resolve, reject) => {
            db.request()
                .input('Name', sql.VarChar(500), grantRequest.Name)
                .input('Email', sql.VarChar(500), grantRequest.Email)
                .input('UserType', sql.VarChar(500), grantRequest.UserType)
                .input('SurveyDate', sql.DateTime, grantRequest.SurveyDate)
                .input(
                    'SurveyResult',
                    sql.VarChar(50),
                    grantRequest.SurveyResult,
                )
                .input('Company', sql.VarChar(500), grantRequest.Company)
                .output('id', sql.Int)
                .execute(config.InserScreeningResultsSP)
                .then(result => {
                    //connection.close();
                    resolve({id: result.output.id});
                })
                .catch(error => {
                    console.log(error);
                    //connection.close();
                    reject(error);
                });
        });
    }
}
module.exports = ShiftRepository;
