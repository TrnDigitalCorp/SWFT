import { IActivityComplete, ICalLocation } from "./ICalendar";

export interface IActivityTilesProps{
    maxTilesPerRow:number;
    LocationsData:ICalLocation[];
    activityTilesArr:IActivityComplete[];
    heading:string;
}
export interface IActivityTilesState{
    activityTilesArr:IActivityComplete[];
}