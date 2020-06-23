var sql = require('mssql');
class DbConnection {
    constructor(config, sql) {
        this.config = config;
        this.Sql = sql;
    }
    open() {
        return new Promise((resolve, reject) => {
            this.Sql.connect(this.config)
                .then(db => {
                    this.Db = db;
                    // console.log(db.connected);
                    resolve(db);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    openPool() {
        return new Promise((resolve, reject) => {
            var Connnection = new sql.ConnectionPool(this.config);
            Connnection.connect()
                .then(db => {
                    // this.Db = db;
                    console.log('Connected to MSSQL pool')
                    resolve(db);
                })
                .catch(error => {
                    console.log('Database Connection Failed! Bad Config: ', error);
                    reject(error);
                });
        });
    }

    close() {
        if (this.Db) {
            this.Db.close().catch(error => console.log(error));
        }
    }
}


module.exports = DbConnection;
