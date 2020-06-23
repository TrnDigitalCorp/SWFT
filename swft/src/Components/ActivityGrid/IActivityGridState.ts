import {IGroup, } from 'office-ui-fabric-react/lib/DetailsList';
import { IActivityGridModel } from "../../Models/IActivityGridModel";

export interface IActivityGridState{
    activities: IActivityGridModel[],
    groups: IGroup[],
    isLoading: boolean,
    gridLabel: string,
    showAllActivities: boolean,
    showAllActivitiesLoading: boolean,
    selectedActivityIndex: number,
    redirectURI: string,
    hideEditActBtn: boolean,
    hideEditExpBtn: boolean,
    errorMessage: string
}