export interface ICalendarControlProps{
    handleChange: (Date:any,flag:boolean)=>void,
    calDate: any;
}
export interface ICalendarControlState{
    calDate: any;
    lastDisabled: boolean;
    nextDisabled: boolean;
    offset: number;
}