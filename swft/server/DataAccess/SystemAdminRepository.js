const config = require('../config');
const dbConfig = config.dbConfig;
var sql = require('mssql');
const DbConnection = require('./DbConnection');
const dbConnection = () => new DbConnection(dbConfig, sql);

class SystemAdminRepository {
    getSystemAdminData() {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.runSystemAdminDataSP(db)
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
    runSystemAdminDataSP(db) {
        return new Promise((resolve, reject) => {
            db.request()                
                .execute(config.GetSystemAdminDataSP)
                .then(result => {
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
module.exports = SystemAdminRepository;
