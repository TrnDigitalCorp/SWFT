import React, { Component } from 'react';
import {
    MessageBar,
    MessageBarType,
} from 'office-ui-fabric-react/lib/MessageBar';
import {Label} from 'office-ui-fabric-react/lib/Label';
import * as _ from 'lodash';
import { ILocationsAndEquipmentsProps, ILocationsAndEquipmentsState } from './interfaces/ILocationsAndEquipments';
import { IActivityEquipment, IActivityLocation } from './interfaces/IActivityForm';
import AppConfig from '../../Constans';

export default class LocationsAndEquipments extends Component<ILocationsAndEquipmentsProps,ILocationsAndEquipmentsState> {
    constructor(props:ILocationsAndEquipmentsProps) {
        super(props);
        this.state ={
            Equipments:[],
            Locations:[],
            selectedLocations:[],
            selectedEquipments:[],
            locationEquipKey:'1'
        }
    }
    componentDidMount() {
        const {Equipments,Locations,locationEquipKey,
            selectedLocations,
            selectedEquipments} = this.props;
        this.setState({
            Equipments:Equipments,
            Locations:Locations,
            selectedLocations:selectedLocations,
            locationEquipKey:locationEquipKey,
            selectedEquipments:selectedEquipments
        });
    }
    componentDidUpdate(prevProps:ILocationsAndEquipmentsProps, prevState:ILocationsAndEquipmentsState) {
        const {locationEquipKey,Equipments,Locations,
            selectedLocations,
            selectedEquipments} = this.props;
        if(locationEquipKey !=prevProps.locationEquipKey){
            this.setState({
                locationEquipKey:locationEquipKey,
                Equipments:Equipments,
                Locations:Locations,
                selectedLocations:selectedLocations,
                selectedEquipments:selectedEquipments
            });
        }
    }
    getOptionsSelected =(options:any)=>{
        var locValues:number[] = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                locValues.push(parseInt(options[i].id));
            }
        }
        return locValues ;
    }
    handleDropDownChange = (ev:any) => {
        let currTarget:any = ev.target.id;
        var options:any = ev.target.options;
        var values:number[]  = this.getOptionsSelected(options);
        this.setState({
            selectedEquipments: values,
        });
        this.props.handleEquipmentSelectionChange(values,currTarget);
    }
    handleLocationDropDownChange = (ev:any) => {
        let currTarget:any = ev.target.id;
        var options:any = ev.target.options;
        var equipmentsSelected:any = [];
        var locValues:number[]  = this.getOptionsSelected(options);
        const {selectedEquipments, Equipments} = this.state;
        if (selectedEquipments.length > 0) {
            var locSpecificEquips = [];
            locSpecificEquips = _.filter(Equipments, equipment => {
                if (locValues.indexOf(equipment.LocationId) !== -1 && equipment.EquipmentId) {
                    return equipment.EquipmentId;
                }
            });
            var locEquipmentIds:number[] = _.map(locSpecificEquips,'EquipmentId');
            equipmentsSelected = _.reject(selectedEquipments,(equipment) => {
                    if (locEquipmentIds.indexOf(equipment) === -1) 
                    {
                        return true;
                    }
            });
            this.setState({
                selectedLocations: locValues,
                selectedEquipments: equipmentsSelected,
            });
        } 
        else {
            this.setState({
                selectedLocations: locValues,
                selectedEquipments:[]
            });
        }
        this.props.handleLocationSelectionChange(locValues,equipmentsSelected)
    }
    renderEquipments = (equipments:IActivityEquipment[], selectedLocations:number[]) => {
        if (equipments.length > 0 && selectedLocations.length) {
            const {selectedEquipments} = this.state;
            var equipmentOptionsArr:any = [];
            equipmentOptionsArr = _.filter(equipments, equipment => {
                if (selectedLocations.indexOf(equipment.LocationId) !== -1 && equipment) {
                    return equipment;
                }
            });
            let options = equipmentOptionsArr.map((equipment:IActivityEquipment, key:any) => {
                if (
                    selectedEquipments && equipment.EquipmentId &&
                    selectedEquipments.indexOf(equipment.EquipmentId) !== -1
                ) {
                    return (
                        <option
                            id={equipment.EquipmentId?.toString()}
                            value={equipment.EquipmentName}
                            selected={true}
                            key={key + equipment.EquipmentName}
                        >
                            {equipment.EquipmentName}
                        </option>
                    );
                } else {
                    if(equipment.EquipmentId){
                        return (
                            <option
                                id={equipment.EquipmentId?.toString()}
                                value={equipment.EquipmentName}
                                key={key + equipment.EquipmentName}
                            >
                                {equipment.EquipmentName}
                            </option>
                        );
                    }                    
                }
            });
            return options;
        } else {
            return (
                <option value={0} disabled={true}>
                    Please select Location to populate Equipments
                </option>
            );
        }
    }
    renderLocations = (locations:IActivityLocation[],selectedLocations:number[]) => {
        let options:any = locations.map((location:IActivityLocation, key:any) => {
            if(selectedLocations.indexOf(location.LocationId)!==-1){
                return (
                    <option
                        id={location.LocationId?.toString()}
                        key={key + location.LocationName}
                        value={location.LocationId}
                        selected={true}>
                        {location.LocationName}
                    </option>
                );
            }
            else{
                return (
                    <option
                        id={location.LocationId?.toString()}
                        key={key + location.LocationName}
                        value={location.LocationId}
                        selected={false}>
                        {location.LocationName}
                    </option>
                );
            }
        });
        return options;
    }
    renderErrorMsgForField(msg:string,key:any){
        return(
             <div role="alert" key={key}>
                <p className="ms-TextField-errorMessage alertMsg">
                    <span data-automation-id="error-message">{msg}</span>
                </p>
            </div>
        );
    }
    render() {
        const{errorMsgs,viewForm} =this.props;
        const {
            Equipments,
            Locations,
            locationEquipKey,
            selectedLocations,
            selectedEquipments
        } = this.state;        
        return (
            <div className="ms-Grid-row selectSection">
                {Locations.length>0?(
                   <>
                        <div className="ms-Grid-col ms-sm4">
                            <Label
                                className={'requiredLabel'}>
                                Select Location
                            </Label>
                            <select
                                disabled={viewForm}
                                id="selectedLocations"
                                multiple={true}
                                required={true}
                                onChange={e => this.handleLocationDropDownChange(e)}>
                                {this.renderLocations(Locations,selectedLocations)}
                            </select>
                            {errorMsgs.selectedLocations?this.renderErrorMsgForField(errorMsgs.selectedLocations,'selectedLocationsError'):''}
                        </div>
                        <div className="ms-Grid-col ms-sm8">
                            <Label>
                                Select Equipment
                            </Label>
                            <select key={locationEquipKey}
                                disabled={viewForm}
                                id="selectedEquipments"
                                multiple
                                onChange={e => this.handleDropDownChange(e)}>
                                {this.renderEquipments(Equipments,selectedLocations)}
                            </select>
                        </div>
                    </>
                ):(
                    <MessageBar messageBarType={MessageBarType.error} className={"errorMsgInfo"}>
                        {AppConfig.ActivityForm.NoLocationEquipmentErrorMsg}
                    </MessageBar>
            )}
            </div>
        );
    }
}