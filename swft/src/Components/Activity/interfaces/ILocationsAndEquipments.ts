import { IActivityEquipment, IActivityLocation, IActivityErrors } from "./IActivityForm";

export interface ILocationsAndEquipmentsProps{
    Equipments:IActivityEquipment[];
    Locations:IActivityLocation[];
    locationEquipKey:any;
    viewForm?:boolean;
    errorMsgs:IActivityErrors;
    selectedLocations:number[];
    selectedEquipments:number[];
    handleLocationSelectionChange:(locationvalues:any,equipmentValues:any)=>void;
    handleEquipmentSelectionChange:(values:any,property:string)=>void;
}
export interface ILocationsAndEquipmentsState{
    Equipments:IActivityEquipment[];
    Locations:IActivityLocation[];
    locationEquipKey:any;
    selectedLocations:number[];
    selectedEquipments:number[];
}