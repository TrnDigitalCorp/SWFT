const ExperimentRepository = require('../DataAccess/ExperimentRepository');
const assert = require('assert');


const expRepository = new ExperimentRepository();
const mapToProjects = project => {
    assert(project, 'Projects not found.');

    return {
        Id: project.Id,
        Name: project.Name,
        Priority: project.Priority,
        Description: project.Description
    };
};

class ExperimentManager {
    getProjects() {        
        return new Promise((resolve, reject) => {
            expRepository.getProjects().then(projects => {resolve(projects)
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    }    
    addExperiment(expObject){
        return new Promise((resolve, reject)=>{
            expRepository.addExperiment(expObject).then((result => {
                resolve(result.id);
            }))
            .catch(error => reject(error));
        });
    }
    updateExperiment(expObject){
        return new Promise((resolve, reject)=>{
            expRepository.updateExperiment(expObject).then((result => {
                resolve(result);
            }))
            .catch(error => reject(error));
        });
    }
    getExperiment(expId){
        return new Promise((resolve, reject) => {
            expRepository.getExperiment(expId)
                .then(expData => resolve(expData))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    getActivitiesForExp(expId) {        
        return new Promise((resolve, reject) => {
            expRepository
                .getActivitiesForExp(expId)
                .then(gridData => resolve(gridData))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }    
    deleteExperiment(expId,notes) {
        assert(expId, 'Experiment Id is required');
        assert(notes, 'Notes is required');

        return new Promise((resolve, reject) => {
            expRepository
                .deleteExperiment(expId,notes)
                .then((result) => resolve(result))
                .catch(error => reject(error));
        });
    }
    deleteMutipleActivities(jsonObj) {        
        return new Promise((resolve, reject) => {
            expRepository
                .DeleteMutipleActivities(jsonObj)
                .then(gridData => resolve(gridData))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }    
    cloneExperiment(expId){
        return new Promise((resolve, reject) => {
            expRepository
                .cloneExperiment(expId)
                .then(cloneId => resolve(cloneId))
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

module.exports = ExperimentRepository;
