const config = require('../config');
const dbConfig = config.dbConfig;
var sql = require('mssql');
const DbConnection = require('./DbConnection');
const dbConnection = () => new DbConnection(dbConfig, sql);

const convertObjectToArr = (dataArr)=>{
    let updatedArr = [];
   try {
        Object.keys(dataArr).forEach(function(key){
            var row = dataArr[key];
            updatedArr.push(row.Id);
        });
   } catch (error) {
       console.log(error);
   }
    return updatedArr;
}

class ActivityRepository {
    addActivity(activityData) {        
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.runActivityCreationSP(db, activityData)
                        .then(result => {
                            resolve({id:result.output.ActivityId});
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
    runActivityCreationSP(db, activityData) {       
        return new Promise((resolve, reject) => {
            db.request()
                .input('ActivityName', sql.NVarChar(255), activityData.ActivityName)
                .input('ActivityDescription', sql.NVarChar, activityData.ActivityDescription)
                .input('DayOffset', sql.Int, activityData.DayOffset)
                .input('ExperimentId', sql.Int, activityData.ExperimentId)
                .input('ActivityDate', sql.VarChar(50), activityData.ActivityDate)
                .input('BookedByEmail', sql.NVarChar(255), activityData.BookedByEmail)
                .input('BookedByName', sql.NVarChar(255), activityData.BookedByName)
                .input('BookedForName', sql.NVarChar(255), activityData.BookedForName)
                .input('BookedForEmail', sql.NVarChar(255), activityData.BookedForEmail)
                .input('ShiftIds', this.formTableTypeData(activityData.ShiftIds))
                .input('LocationIds', this.formTableTypeData(activityData.LocationIds))
                .input('EquipmentIds', this.formTableTypeData(activityData.EquipmentIds))
                .input('IsEmployee', sql.Bit,activityData.IsEmployee?1:0)
                .input('Notes', sql.NVarChar, activityData.Notes)
                .output('ActivityId', sql.Int)
                .execute(config.CreateActivity)
                .then(result => {
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    reject(err.message);
                });
            });
        }
        updateActivity(id,activityData) {        
            const connection = dbConnection();
            return new Promise((resolve, reject) => {
                connection
                .openPool()
                .then(db => {
                    this.runActivityUpdateSP(db, id,activityData)
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
                    reject(err.message);
                });
            });
        }
        runActivityUpdateSP(db,id,activityData) {       
            return new Promise((resolve, reject) => {
                db.request()
                .input('ActivityName', sql.NVarChar(255), activityData.ActivityName)
                .input('ActivityDescription', sql.NVarChar, activityData.ActivityDescription)
                .input('ExperimentId', sql.Int, activityData.ExperimentId)
                .input('DayOffset', sql.Int, activityData.DayOffset)
                .input('ActivityDate', sql.VarChar(50), activityData.ActivityDate)
                .input('BookedByEmail', sql.NVarChar(255), activityData.BookedByEmail)
                .input('BookedByName', sql.NVarChar(255), activityData.BookedByName)
                .input('BookedForName', sql.NVarChar(255), activityData.BookedForName)
                .input('BookedForEmail', sql.NVarChar(255), activityData.BookedForEmail)
                .input('ShiftIds', this.formTableTypeData(activityData.ShiftIds))
                .input('LocationIds', this.formTableTypeData(activityData.LocationIds))
                .input('EquipmentIds', this.formTableTypeData(activityData.EquipmentIds))
                .input('IsEmployee', sql.Bit,activityData.IsEmployee?1:0)
                .input('Notes', sql.NVarChar, activityData.Notes)
                .input('ActivityId', sql.Int,id)
                .execute(config.UpdateActivity)
                .then(result => {
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    reject(err.message);
                });
            });
        }
        formTableTypeData(arrayData){
            let  table = new  sql.Table();
            table.columns.add('ID', sql.Int);
            for (var i = 0; i <arrayData.length; i++) {  
                table.rows.add(arrayData[i]);  
            } 
            return table;
        }
        cloneActivity(jsonObj) {
            const connection = dbConnection();
            return new Promise((resolve, reject) => {
                connection
                .openPool()
                .then(db => {
                    this.runCloneActivityByIdSP(db, jsonObj)
                    .then(result => {
                        resolve({
                            id:result.output.CloneId
                        });
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
        runCloneActivityByIdSP(db, jsonObj) {
            return new Promise((resolve, reject) => {
                db.request()
                .input('ActivityId', sql.Int, jsonObj.ActivityId)
                //.input('ExperimentId', sql.Int, jsonObj.ExperimentId)
                .output('CloneId', sql.Int)
                .execute(config.CloneActivity)
                .then(result => {
                    // //connection.close();
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    // //connection.close();
                    reject(error);
                });
            });
        }
    findActivityById(id) {
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.runGetActivityByIdSP(db, id)
                        .then(result => {
                            resolve({
                                ActivytData:result[0],
                                ActivityLocation:convertObjectToArr(result[1]),
                                ActivityShift:convertObjectToArr(result[2]),
                                ActivityEquipment:convertObjectToArr(result[3])
                            });
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
    runGetActivityByIdSP(db, id) {
        return new Promise((resolve, reject) => {
            db.request()
                .input('ActivityId', sql.Int, id)
                .execute(config.GetActivityByID)
                .then(result => {
                    // //connection.close();
                    resolve(result.recordsets);
                })
                .catch(error => {
                    console.log(error);
                    // //connection.close();
                    reject(error);
                });
        });
    }
    removeActivity(id,notes){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection
                .openPool()
                .then(db => {
                    this.runCancelExperimentOrActivity(db, id,notes)
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
    runCancelExperimentOrActivity(db, id,notes) {
        return new Promise((resolve, reject) => {
            db.request()
            .input('ActivityId', sql.Int, id)
            .input('Notes', sql.NVarChar, notes)
            .execute(config.CancelExperimentOrActivity)
                .then(result => {
                    //connection.close();
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    //connection.close();
                    reject(error);
                });
        });
    }
}
module.exports = ActivityRepository;
