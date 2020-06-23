import { IActivityShift, IActivityErrors } from "./IActivityForm";

export interface IDateAndShiftsProps{
    shiftTimmings: IActivityShift[];
    selectedShiftIds: number[];
    errorMsgs:IActivityErrors;
    activityDate: any;
    viewForm?:boolean;
    ExpId?:number|null;
    ExpDate?:any;
    Offset?: number;
    handleFormFieldChange: (value:any, proprety:string)=>void;
}
export interface IDateAndShiftsState{
    shiftTimmings:IActivityShift[];
    errorMsgs:IActivityErrors;
    activityDate:any;
    selectedShiftIds:number[];
    Offset?: number;
    ExpDate?: any;
}