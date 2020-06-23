const config = require('../config');
const dbConfig = config.dbConfig;
var sql = require('mssql');
const DbConnection = require('./DbConnection');
const dbConnection = () => new DbConnection(dbConfig, sql);

class GrantStorageRepository {
    addGrantRequest(grantRequest) {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .open()
                .then(db => {
                    this.addDataToDB(connection, grantRequest)
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
                    connection.close();
                    reject(error);
                });
        });
    }
    addDataToDB(connection, grantRequest) {
        return new Promise((resolve, reject) => {
            connection.Db.request()
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
                    connection.close();
                    resolve({id: result.output.id});
                })
                .catch(error => {
                    console.log(error);
                    connection.close();
                    reject(error);
                });
        });
    }
}
module.exports = GrantStorageRepository;
