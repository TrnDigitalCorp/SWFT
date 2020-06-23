import { IExperimentErrMsgs, IExperiment, IValidationObj } from "./IExperiment";
import { IUserPersonaField } from "../Activity/interfaces/IActivityForm";

export const InitalExpErrrMsgs:IExperimentErrMsgs = { 
    ExperimentName: '',
    StartDate: '',
    Remarks: '',
    ExperimentOwner: '',
    ProjectId: ''
}
export const validateExpFields = (newExperiment:IExperiment) :IValidationObj => {
    var validationObj:IValidationObj ={
        isValid:true,
        ErrorMsgs:{...InitalExpErrrMsgs}
    };
    try {
        if (isNaN(new Date(newExperiment.StartDate).getTime())) {
            validationObj.ErrorMsgs.StartDate = "Activity Date is required field.";
            validationObj.isValid = false;
        }
        if (!newExperiment.ProjectId) {
            validationObj.ErrorMsgs.ProjectId = 'Project/Study is required field.';
            validationObj.isValid = false;
        }
        if (!newExperiment.Name) {
            validationObj.ErrorMsgs.ExperimentName = 'Experiment Name is required field.';
            validationObj.isValid = false;
        }
        else{
            if(newExperiment.Name.trim() === ''){
                validationObj.ErrorMsgs.ExperimentName = 'Experiment Name cannot be empty.';
                validationObj.isValid = false;
            }
        }
        let owner:IUserPersonaField[] = newExperiment.Owner;
        if (owner.length < 1) {
            validationObj.ErrorMsgs.ExperimentOwner = "Experiment Owner is required field.";
            validationObj.isValid = false;
        } 
    } catch (error) {
        console.log(error);
        validationObj.isValid = false;
    }
    return validationObj;
}
    
    