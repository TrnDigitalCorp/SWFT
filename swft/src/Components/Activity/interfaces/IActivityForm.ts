import { ILocationShiftAvailability } from "./ILocationShiftAvailability";

export interface IUserPersonaField{
    DisplayName:string;
    Email:string;
    UserLogin?:string;
}
export interface IActivity{
    ExperimentId?:number|null;
    ExperimentOwner?:string|null;
    ExperimentStatusId?:number|null;
    ExperimentStartDate?:any;
    ActivityStatus?:number|null;
    Id?:number;
    DayOffset:number|0;
    activityDate: any;
    selectedShiftIds: number[];
    activityName: string;
    activityDescription: string;
    bookedForEmail: IUserPersonaField[];
    bookedByEmail: IUserPersonaField
    visitorEmail: string;
    selectedLocations: number[];
    selectedEquipments: number[];
    showVisitorField:boolean;
}
export interface IActivityErrors{
    activityDate?: string;
    activityName?: string;
    selectedShiftIds?: string;
    activityDescription?: string;
    bookedForEmail?: string;
    visitorEmail?: string;
    selectedLocations?: string;
    activityNotes?: string;
}
export interface IActivityLocation{
    LocationId: number;
    LocationName: string;
    LocationDescription: string;
}
export interface IActivityShift{
    Id: number;
    Name: string;
    StartHour: number;
    StartMin: number;
    EndHour: number;
    EndMin:number;
    DisplayName: string;
    isSelected:boolean;
}
export interface IActivityEquipment{
    LocationId: number;
    LocationName: string;
    LocationDescription: string;
    EquipmentTypeId: number;
    EquipmentId: number;
    EquipmentName: string;
}
export interface IActivityFormState{
    newActivity: IActivity;
    errorMsgs: IActivityErrors;
    ShiftTimmings: IActivityShift[];
    Locations: IActivityLocation[];
    selectedFor:IUserPersonaField[];
    Equipments: IActivityEquipment[];
    locationEquipKey:any;
    isLoaded: boolean;
    showErrorMsg:boolean;
    SaveFlag:boolean;
    isCreated:boolean;
    actionType:'Update'|'Delete'|'Create'|'Clone'|'Denied'|'Nothing'|'Failed';
    errorMsg: string;
    formFieldKey:any;
    hideCancelDialog:boolean;
    isRedirect:boolean;
    LSAFullyBooked:boolean;
    LsaArr:ILocationShiftAvailability[];

}
export interface IEditActivityFormState{
    editActivity: IActivity;
    InitialShifts:IActivityShift[], 
    LocationEquipmentData:IActivityEquipment[]
    editActivityId: number;
    errorMsgs: IActivityErrors;
    ShiftTimmings: IActivityShift[];
    Locations: IActivityLocation[];
    selectedFor:IUserPersonaField[];
    Equipments: IActivityEquipment[];
    locationEquipKey:any;
    isLoaded: boolean;
    showErrorMsg:boolean;
    SaveFlag:boolean;
    isCreated:boolean;
    isUpdated:boolean;
    isDeleted:boolean;
    isRedirect:boolean;
    canEdit:boolean;
    errorMsg: string;
    hideDeleteDialog:boolean;
    hideUpdateDialog:boolean;
    hideCancelDialog:boolean;
    hideCloneDialog:boolean;
    activityNotes: string;
    formFieldKey:any;
    isClone:boolean;
    viewForm?:boolean;
    actionType:'Update'|'Delete'|'Create'|'Clone'|'Denied'|'Nothing'|'Failed';
    LSAFullyBooked:boolean;
    LsaArr:ILocationShiftAvailability[];

}
export interface IEditActivityFormProps{
    Id:number;
    office?:boolean;
    viewForm?:boolean;
    ExpData?:IExpPropsToActivity;
    NotPopActions?:boolean;    
    handleActivityActions?: (property:any,actionType:"LoadForm"|"CreatedActivity"|"ClonedActivity"|"UpdatedActivity"|"CloseForm"|"DeleteActivity"|"ViewToEdit") => void;
}
export interface IExpPropsToActivity{
    ExpStartDate:any;
    ExpOwnerEmail:string;
    ExpId: number;
    ExperimentNotSaved?: boolean;
}
export interface IActivityFormProps{
    office?:boolean;
    clonedActivity?:IActivityFormState;
    ExpData?:IExpPropsToActivity;
    NotPopActions?:boolean;    
    handleActivityActions?: (property:any,actionType:"LoadForm"|"CreatedActivity"|"CloseForm") => void;
}
    
