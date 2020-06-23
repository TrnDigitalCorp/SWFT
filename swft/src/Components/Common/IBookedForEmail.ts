import { IUserPersonaField } from "../Activity/interfaces/IActivityForm";


export interface IBookedForEmailProps{
    updatePeoplePickerChange: (value:IUserPersonaField[],property:string)=>void;
    required: boolean;
    viewForm?: boolean;
    property: string;
    placeholderTxt: string;
    description?: string;
    people: IUserPersonaField[];
}
export interface IBookedForEmailState{
    selectedPeople: IUserPersonaField[];
    pickrKey: any;
}