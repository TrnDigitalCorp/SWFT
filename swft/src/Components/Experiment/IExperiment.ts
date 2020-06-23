import { IUserPersonaField, IActivity } from '../Activity/interfaces/IActivityForm';
import { IActivityGridModel } from "../../Models/IActivityGridModel";
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IExperimentProps {
    FormMode: string;
    ExpId : number;
    ParentId? : number;
}
export interface IExperimentState {
    Mode: string;
    EID: number;
    AID: number;
    Experiment : IExperiment;
    TopLabel: string;
    Projects: IProject[];
    ExperimentActivities: IActivityGridModel[];
    ShowAddActivity: "Add"|"Edit"|"View"|"None";
    ShowDialog: "DeletePrompt"|"UnsavedEditForm"|"UnsavedAddEditFormViewClick"|"UnsavedAddForm"|"UnsavedAddEditForm"|"CloneActConfirmation"|"CloseExpForm"|"None";
    PlanActivityLabel: string;
    ExperimentErrMsgs:IExperimentErrMsgs;
    //FormStatus: string;   //ExperimentNotSaved, NoActivities, ActivitiesPresent, ActivitiesCompleted, ExperimentStarted
    InfoMessage: string;  
    SaveExpProcessing: boolean;
    RedirectUri: string;
    PlanexLoading: boolean;
    HeaderMessage: string;
    HeaderMessageType: MessageBarType;
    DisableForm: boolean;
    DisableAdd: boolean;
    SelectedActivities: IActivityGridModel[];
    PreviousStartDate: Date;
    ExperimentNotSaved: boolean;  
    HideDeleteDialog: boolean;
    DeleteNotes: string;
    DeleteErrorMessage: string;
    FormActionLoading:boolean;
    FormAction:"LoadForm"|"CreatedActivity"|"ShowMessage";
    FormActionMsg:string;
    FormId:any;
    HideCloneDialog: boolean;
    DisableDelete: boolean;
  }
  export interface IExperiment{
    Id: number;
    Name: string;
    StartDate: Date;
    Description: string;
    StatusId: number;
    Remarks: string;
    Owner: IUserPersonaField[];
    ProjectId: number;
    UpdateActivities ?: boolean;
}
export interface IProject{
    Id: number;
    Name: string;
    Priority: number;
    Description: string;
}
export interface IValidationObj{
    ErrorMsgs:IExperimentErrMsgs;
    isValid:boolean;
}
export interface IExperimentErrMsgs{
    ExperimentName: string;
    StartDate: string;
    Remarks: string;
    ExperimentOwner: string;
    ProjectId: string;
}

export interface promptMsgs{
  MessageKey:string;
  MesssageString:string;
}