const config = require('../config');
const dbConfig = config.dbConfig;
var sql = require('mssql');
const DbConnection = require('./DbConnection');
const dbConnection = () => new DbConnection(dbConfig, sql);

class LocationRepository {
    getLocationDataById(grantRequest) {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.getLocationDataFromDb(db, id)
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
                    // //connection.close();
                    reject(error);
                });
        });
    }
    getLocationData() {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.getLocationDataFromDb(db)
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
    getLocationEquipmentData() {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.getLocationEquipmentDataFromDb(db)
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
                    // //connection.close();
                    reject(error);
                });
        });
    }
    getLocationDataFromDb(db) {
        return new Promise((resolve, reject) => {
            db.request()
                .execute(config.GetAllLocationDataSP)
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
    getLocationEquipmentDataFromDb(db) {
        return new Promise((resolve, reject) => {
            db.request()
                .execute(config.GetAllLocationAndEquipments)
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
module.exports = LocationRepository;
