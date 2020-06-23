import { IUserPersonaField, IActivityErrors } from "./IActivityForm";

export interface INamePersonVisitorProps{
    activityName:string;
    showVisitorField:boolean;
    viewForm?:boolean;
    visitorEmail:string;
    selectedFor:IUserPersonaField[];
    errorMsgs:IActivityErrors;
    handleOnChange:(eventObj:any)=>void;
}
export interface INamePersonVisitorState{
    activityName:string;
    errorMsgs:IActivityErrors;
    showVisitorField:boolean;
    visitorEmail:string;
    selectedFor:IUserPersonaField[];
}