import { IShiftData, ICalendarData } from "./ICalendar";

export interface ICalendarCoinProps{
    shiftData: IShiftData[];
    locationCapacity: number;
    location: ICalendarData;
    locationId: number;
    date: any;
    handleIconClick: (event:any, date:any,  location:ICalendarData ,shiftData:IShiftData)=>void;
}
export interface ICalendarCoinState{
    shiftData: IShiftData[];
    date: any;
    locationId: number;
    locationCapacity: number;
}