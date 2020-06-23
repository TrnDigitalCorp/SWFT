const config = require('../config');
const dbConfig = config.dbConfig;
var sql = require('mssql');
const DbConnection = require('./DbConnection');
const dbConnection = () => new DbConnection(dbConfig, sql);

class CalendarRepository {
    getCalendarData(calRequest) {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.runCalendarDataSP(db, calRequest)
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
                    // connection.close();
                    reject(error);
                });
        });
    }
    runCalendarDataSP(db, calRequest) {
        return new Promise((resolve, reject) => {
            db.request()
                .input('CalenderDate', sql.VarChar(50), calRequest.CalenderDate)
                .execute(config.GetCalendarDataSP)
                .then(result => {
                    // db.close();
                    resolve(result.recordset);
                })
                .catch(error => {
                    console.log(error);
                    // db.close();
                    reject(error);
                });
        });
    }
}
module.exports = CalendarRepository;
