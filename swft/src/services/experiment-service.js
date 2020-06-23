import * as axios from 'axios';
import AppConfig from '../Constans';
const moment = require('moment');

function processExperiment(experiment) {
    let jsonObj = {};
    jsonObj.Id = experiment.Id;
    jsonObj.Name = experiment.Name;
    jsonObj.Description = experiment.Description;
    jsonObj.ProjectId = experiment.ProjectId;
    jsonObj.Remarks = experiment.Remarks;
    jsonObj.Owner = experiment.Owner;
    jsonObj.StatusId = 1;
    jsonObj.UpdateActivities = experiment.UpdateActivities;
    jsonObj.StartDate = experiment.StartDate
    ? moment(experiment.StartDate).format(AppConfig.PlanExperiment.ExpDateFormat)
    : '';
    return jsonObj
}
let ExperimentService = {
    getProjects() {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/Experiment/GetProjects')
                .then(projects => {
                    resolve(projects);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    addExperiment(experiment){
        return new Promise((resolve, reject)=>{
            axios
            .post('/api/Experiment/Add', processExperiment(experiment))
            .then(result => {
                resolve(result.data);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    },
    updateExperiment(experiment){
        return new Promise((resolve, reject)=>{           
            axios
            .post('/api/Experiment/Update', processExperiment(experiment))
            .then(result => {
                resolve(result.data.recordsets);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    },
    getExperiment(id){
        return new Promise((resolve, reject) => {
            axios
                .get(`/api/Experiment/${id}`)
                .then(res => {
                    let _expObj = res.data.recordset.length > 0  ? res.data.recordset[0] : null;
                    if(_expObj){
                        var expDate =_expObj.StartDate?new Date(moment.utc(_expObj.StartDate).format(AppConfig.DateFormats.NoTimeDate)):null;
                        let _experiment = {
                            "Id": _expObj.Id,
                            "Name": _expObj.Name,
                            "StartDate": expDate? expDate:null,
                            "Description": _expObj.Description,
                            "StatusId": _expObj.StatusId,
                            "Remarks": _expObj.Remarks,
                            "ProjectId": _expObj.ProjectId,
                            "Owner": [{
                                "Email": _expObj.Owner,
                                "DisplayName": _expObj.OwnerName
                            }]
                        }; 
                        resolve(_experiment);
                    }
                    else{
                        resolve(null);   
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    getActivitiesForExp(id){
        return new Promise((resolve, reject) => {
            axios
                .get(`/api/Experiment/${id}/activities`)
                .then(res => {
                    resolve(res.data);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    deleteExperiment(expId, notes){
        return new Promise((resolve, reject) => {
            axios
                .post('/api/Experiment/Delete', {
                    "ExperimentId": expId,
                    "Notes": notes
                })
                .then(res => {
                    resolve(res.data);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    deleteActivities(jsonOnj){
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/Experiment/activities/delete`,jsonOnj)
                .then(res => {
                    resolve(res.data);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    cloneExperiment(expId){
        return new Promise((resolve, reject) => {
            axios
                .post('/api/Experiment/Clone', {
                    "ExperimentId": expId
                })
                .then(res => {
                    resolve(res.data.output);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    CloneActivity(actObj){
        return new Promise((resolve, reject) => {
            axios
                .post('/api/Activity/Clone', actObj)
                .then(res => {
                    resolve(res.data);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
};
export default ExperimentService;