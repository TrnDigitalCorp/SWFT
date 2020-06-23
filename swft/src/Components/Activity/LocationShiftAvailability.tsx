import * as React from 'react';
import {
    MessageBar,
    MessageBarType,
} from 'office-ui-fabric-react/lib/MessageBar';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import {getShiftLocationAvaliability, formLocationShiftAvailabilityArr, formatActivityDate} from './ActivityService';
import {Icon} from 'office-ui-fabric-react';
import { ILocationShiftAvailabilityProps, ILocationShiftAvailabilityState, ILocationShiftAvailability } from './interfaces/ILocationShiftAvailability';
import AppConfig from '../../Constans';
import './StickyTable.css';
import _ from 'lodash';
import { IActivityShift } from './interfaces/IActivityForm';
import { Z_STREAM_END } from 'zlib';

const uuidv4 = require('uuid/v4');

export default class LocationShiftAvailability extends React.Component<ILocationShiftAvailabilityProps,ILocationShiftAvailabilityState> {
    constructor(props:ILocationShiftAvailabilityProps) {
        super(props);
        this.state = {
            isLoaded: false,
            selectedDate: new Date(formatActivityDate()),
            shiftLocationDataArr: [],
            errorMsg:'',
            showErrorMsg:false
        };
    }
    componentDidMount() {
        const {activityDate} = this.props;
        this.setState({
            selectedDate: activityDate,
        });
        this.callForShiftLocationAvailabilityData(activityDate);
    }
    callForShiftLocationAvailabilityData(activityDate:any) {
        const{Locations,Shifts} = this.props;
        getShiftLocationAvaliability({activityDate})
        .then(shiftLocationAvailabilities => {
                if (shiftLocationAvailabilities) {
                    var lsaArr:any = formLocationShiftAvailabilityArr(Locations,Shifts,shiftLocationAvailabilities,this.props.office);               
                    this.setState({
                        shiftLocationDataArr: lsaArr,
                        isLoaded: true,
                    });
                    this.props.sendLsaArr(lsaArr);
                }
                else{
                    this.setState({
                        isLoaded:true,
                        showErrorMsg: true,
                        errorMsg: AppConfig.ActivityForm.ErrorLSADataFetchMessage
                    }); 
                    console.log("No Shift Location Availabilities");
                }
            })
            .catch(error => {
                this.setState({
                    isLoaded:true,
                    showErrorMsg: true,
                    errorMsg: AppConfig.ActivityForm.ErrorLSADataFetchMessage
                });
                console.log(error);
            });
    }
    componentDidUpdate(prevProps:ILocationShiftAvailabilityProps,prevState:ILocationShiftAvailabilityState ) {
        const {activityDate} = this.props;
        if (prevProps.activityDate !== activityDate) {
            this.setState({
                isLoaded: false,
            });
            this.callForShiftLocationAvailabilityData(activityDate);
        }
    }
    renderErrorMsg(msg:string){
        return(
            <MessageBar messageBarType={MessageBarType.error}>
                {msg}
            </MessageBar>
        );
    }
    reduceLSAByLocations = (lsaArr: ILocationShiftAvailability[], shiftArr: IActivityShift[])=>{
        const locationSortedData = _.orderBy([...lsaArr], ['LocationName', 'ShiftName']);
        let reducedArr: any[] = [];
        _.forEach(locationSortedData, (item, ind)=>{
            let reducedItems = reducedArr.filter((l)=>{return l.LocationId===item.LocationId});
            if(reducedItems.length===0){
                //create a copy of the item with location properties only
                let _locationItem = Object.assign({}, {
                    "LocationId": item.LocationId, 
                    "LocationName": item.LocationName, 
                    "LocationDescription": item.LocationDescription
                });
                _.set(_locationItem, "status-"+item.ShiftId, item.Status);
                _.set(_locationItem, "count-"+item.ShiftId, item.NoOfActivities);
                _.set(_locationItem, "color-"+item.ShiftId, item.IndicationColor);
                reducedArr.push(_locationItem);
            }
            else{
                let _locationItem = reducedItems[0];
                _.set(_locationItem, "status-"+item.ShiftId, item.Status);
                _.set(_locationItem, "count-"+item.ShiftId, item.NoOfActivities);
                _.set(_locationItem, "color-"+item.ShiftId, item.IndicationColor);
            }
        });    
        return reducedArr;
    }
    render() {
        const {isLoaded, shiftLocationDataArr,showErrorMsg,errorMsg} = this.state;
        const reducedArr = this.reduceLSAByLocations(shiftLocationDataArr, this.props.Shifts);
        const sortedShifts = _.orderBy([...this.props.Shifts], ['Name']);
        return (
            <div className={'LocationShiftAvailability'}>
                {isLoaded ? (showErrorMsg?this.renderErrorMsg(errorMsg)
                    :(<div>
                        {shiftLocationDataArr.length === 0 ? (
                            <>
                                <MessageBar>
                                    No Activities for the day!.
                                    <Icon
                                        iconName="Emoji2"
                                        className="iconPadClasss"
                                    />
                                </MessageBar>
                            </>
                        ) : (
                            <table className="stickyTable">
                                <thead>
                                    <tr key={'row0'}>                                        
                                        <th key={'loc0'}>Location</th>
                                        {
                                            sortedShifts.map((s)=>{ return <th key={'shift'+s.Id}>{s.Name}</th>; })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {reducedArr.map(
                                        (_locItem, _ind) => {
                                            return (
                                                <tr key={uuidv4()}>                                                    
                                                    <td key={ 'loc' + _locItem.LocationId } title={ _locItem.LocationDescription }>
                                                        {_locItem.LocationName}
                                                    </td>
                                                    {
                                                        sortedShifts.map((s)=>{ return (
                                                            <td key={ 'shift' + s.Id + _ind } className={ 'rowColor' + _.get(_locItem, 'color-'+s.Id) }>
                                                                {this.props.office?_.get(_locItem, 'count-'+s.Id):_.get(_locItem, 'status-'+s.Id)}  
                                                            </td>
                                                        );})
                                                    }                                                    
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>)
                ) : (
                    <>
                        <div className="sectionSpinner">
                            <Spinner
                                size={SpinnerSize.large}
                                label={'Loading...'}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }
}
