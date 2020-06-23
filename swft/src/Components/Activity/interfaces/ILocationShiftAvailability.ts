import { IActivityEquipment, IActivityLocation, IActivityShift } from "./IActivityForm";

export interface ILocationShiftAvailabilityProps{
    activityDate:any;
    office?:boolean;
    Locations:IActivityLocation[];
    Shifts:IActivityShift[];
    sendLsaArr:(lsaArr:any) => void;
}
export interface ILocationShiftAvailability{
    ShiftId: number;
    ShiftName: string;
    ShiftDisplayName: string;
    LocationId: number;
    LocationName: string;
    LocationDescription: string;
    NoOfActivities: number;
    LocationCapacity: number;
    IndicationColor: string;
    OnAlert:boolean;
    Status: string;
}
export interface ILocationShiftAvailabilityState{
    isLoaded: boolean;
    selectedDate: any;
    shiftLocationDataArr: ILocationShiftAvailability[];
    errorMsg:string;
    showErrorMsg:boolean;
}