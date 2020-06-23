import { IActivityShift } from "./IActivityForm";

export interface ISwitchSelectorProps{
    handleChangeFunction: (updatedArr:IActivityShift[])=>void ;
    labelHead: string;
    required: boolean;
    viewForm?:boolean;
    arrayInput: IActivityShift[];
}
export interface ISwitchSelectorState{
    arrayInput: IActivityShift[];
}