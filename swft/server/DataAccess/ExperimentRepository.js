const config = require('../config');
const dbConfig = config.dbConfig;
var sql = require('mssql');
const DbConnection = require('./DbConnection');
const dbConnection = () => new DbConnection(dbConfig, sql);

class ExperimentRepository {
    getProjects(){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection.openPool().then(db => {
                db.request()                  
                .execute(config.GetAllProjectsDataSP)
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
        });        
    }
    addExperiment(json){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection.openPool().then(db=>{
                db.request()
                .input('ProjectId', sql.NVarChar(255), json.ProjectId)
                .input('ExpName', sql.NVarChar(255), json.Name)
                .input('ExpStartDate', sql.VarChar(50), json.StartDate)
                .input('ExpDescription', sql.NVarChar, json.Description)
                .input('ExpRemarks', sql.NVarChar, "")
                .input('ExpOwner', sql.NVarChar(255), json.Owner[0].Email)
                .input('ExpOwnerName', sql.NVarChar(255), json.Owner[0].DisplayName)
                .output('ExperimentId', sql.Int)
                .execute(config.CreateExperiment)
                .then(result => {
                    // connection.close();
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    // connection.close();
                    reject(error);
                });
            });
        });    
    } 
    updateExperiment(json){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection.openPool().then(db=>{
                db.request()
                .input('ExperimentId', sql.Int, json.Id)
                .input('ProjectId', sql.Int, json.ProjectId)
                .input('ExpName', sql.NVarChar(255), json.Name)
                .input('ExpStartDate', sql.VarChar(50), json.StartDate)
                .input('ExpDescription', sql.NVarChar, json.Description)
                .input('StatusId', sql.Int, json.StatusId)
                .input('ExpRemarks', sql.NVarChar, json.Remarks)
                .input('ExpOwner', sql.NVarChar(255), json.Owner[0].Email)
                .input('ExpOwnerName', sql.NVarChar(255), json.Owner[0].DisplayName)
                .input('UpdateActivities', sql.Bit, json.UpdateActivities ? 1 : 0)
                .output('ExeStatus', sql.Int)
                .execute(config.UpdateExperiment)
                .then(result => {
                    // connection.close();
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    // connection.close();
                    reject(error);
                });
            });
        });    
    }   
    getExperiment(id){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection.openPool().then(db=>{
                db.request()
                .input('expId', sql.Int, id)
                .execute(config.GetExperiment)
                .then(result => {
                    // connection.close();
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    // connection.close();
                    reject(error);
                });
            });
        });    
    }
    getActivitiesForExp(expId){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection.openPool().then(db => {
                db.request()
                .input('userEmail', sql.VarChar(255), null)
                .input('statusId', sql.Int, 1)                
                .input('experimentId', sql.Int, expId)     
                .execute(config.GetActivitiesForUser)
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
    deleteMutipleActivities(jsonobj){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection.openPool().then(db => {
                db.request()
                .input('ActivityIds', this.formTableTypeData(jsonobj.ActivityIds))
                .input('Notes', sql.VarChar(255), jsonobj.Notes)    
                .execute(config.CancelMulActivities)
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
        });
    } 
    deleteExperiment(expId, notes){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection.open().then(db => {
            db.request()
            .input('ExperimentId', sql.Int, expId)
            .input('Notes', sql.NVarChar, notes)
            .execute(config.CancelExperimentOrActivity)
                .then(result => {
                    connection.close();
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    connection.close();
                    reject(error);
                });
            });
        });
    }
    cloneExperiment(expId){
        const connection = dbConnection();
        return new Promise((resolve, reject) => {
            connection.open().then(db => {
            db.request()
            .input('ExperimentId', sql.Int, expId)
            .output('CloneExpId', sql.Int)
            .output('CloneId', sql.Int)
            .execute(config.CloneExperiment)
                .then(result => {
                    connection.close();
                    resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    connection.close();
                    reject(error);
                });
            });
        });
    }
}
module.exports = ExperimentRepository;
