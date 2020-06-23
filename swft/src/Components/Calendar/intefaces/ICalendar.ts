import { IActivityShift } from "../../Activity/interfaces/IActivityForm";
export interface INextDays{
    DayIndex: string;
    Day: string;
    DateObj: any;
    DateString: string;
    DateStringDB: string;
}

export interface IActivityComplete{
    LocationId: number;
    LocationName: string;
    LocationDescription: string;
    LocationCapacity: number;
    ActivityLocationID:number;
    ShiftId: number;
    ShiftName: string;
    ShiftDisplayName: string;
    NoOfActivities: number;
    ActivityId: number;
    ActivityName: string;
    ActivityDescription: string;
    ActivityDate:any;
    ActivityDayOffset: number;
    BookedByEmail: string;
    BookedForEmail: string;
    BookedForName: string;
    BookedByName: string;
    IsEmployee: number;
    EquipmentName: string;
    ExperimentId?: number;
    ExperimentName?: string;
}
export interface IShiftData{
    ActivityNumber:number;
    ShiftColor:string;
    ShiftName:string;
    ShiftId:number;
    isStar:boolean;
}
export interface ICalData{
    Date:string;
    DayIndex:string;
    ShiftData:IShiftData[];
    TotalInLocation:number;
}
export interface ICalendarData{
    LocationId: number;
    LocationName: string;
    LocationDescription: string;
    LocationCapacity: number;
    CalData:ICalData[];
}
export interface ICalLocation{
    LocationId: number;
    LocationName:string;
    LocationCapacity: number;
    LocationDescription: string;
    EquipmentArr:string[];
}
export interface ICalendarProps{
    handleShiftClick?:(tilesheadaing:string,activityArr:IActivityComplete[])=>void;
}
export interface ICalendarState{
    nextDays: INextDays[];
    calDate: any
    locationdata: ICalLocation[];
    shiftData: IActivityShift[];
    activitiesData: IActivityComplete[];
    calendarData: ICalendarData[];
    totolCountArr: ICalData[];
    isLoading: boolean;
    userClickAction: boolean;
    filteredData: IActivityComplete[];
    activityHeader: string;
    tilesListKey: any;
    gridHeight: number;
}