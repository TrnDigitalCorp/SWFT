import * as React from 'react';
import _ from 'lodash';
import {Icon} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import {
    MessageBar,
    MessageBarType,
} from 'office-ui-fabric-react/lib/MessageBar';

import CalendarControl from './CalendarControl';
import {
    getNextDaysArr,
    today,
    getCalendarDataByDate,
    getShiftDataForCalendar,
    formLocationDateJson,
    CalendarLinks,
    filterByLocationShiftIdDate,
    formatActivityHeaderDate,
    getLocationsEquipments,
    getLocationsformLocEquip,
} from './CalendarService';
import AppConfig from '../../Constans';
import CalendarCoin from './CalendarCoin';
import ActivityTiles from './ActivityTiles';
import { ICalendarProps, ICalendarState, ICalendarData, IShiftData, IActivityComplete, ICalData } from './intefaces/ICalendar';
import { BlockingSpinner } from '../Common/dialogs/BlockingSpinner';
import { UserInfoContext } from '../../Main';
import { groupByEquipment } from "../utils/Utils";
import TotalByDateShift from './TotalByDateShift';

const uuidv4 = require('uuid/v4');

export default class Calendar extends React.Component<ICalendarProps,ICalendarState> {    
    constructor(props:ICalendarProps) {
        super(props);
        Calendar.contextType = UserInfoContext;
        this.state = {
            nextDays: [],
            calDate: today,
            locationdata: [],
            shiftData: [],
            activitiesData: [],
            calendarData: [],
            totolCountArr:[] as ICalData[],
            isLoading: true,
            userClickAction: false,
            filteredData: [],
            activityHeader:'Activities',
            tilesListKey: uuidv4(),
            gridHeight: 0
        };
    }
    componentDidMount() {        
        this.setState({
            nextDays: getNextDaysArr(today, 6),
            isLoading: true
        });
        this.getDataFromDB(null, true);        
    }
    getDataFromDB = (updatedDate:any, isPageLoad:boolean) => {
        const promises = [];
        var calDate = updatedDate ? updatedDate : this.state.calDate,
        currUser = this.context.userName;
        if (isPageLoad) {
            promises.push(getLocationsEquipments());
            promises.push(getShiftDataForCalendar());
            promises.push(getCalendarDataByDate(calDate));
            Promise.all(promises)
                .then(responses => {                      
                    if (responses && responses.length > 0) {
                        const {nextDays} = this.state;
                        var locationEquiData =  getLocationsformLocEquip(responses[0]); 
                        var calendarDataArr = formLocationDateJson(nextDays,locationEquiData,responses[1],responses[2],currUser);  
                        this.setState({
                            locationdata: locationEquiData,
                            shiftData: responses[1],
                            activitiesData: calendarDataArr.activitiesData,
                            calendarData: calendarDataArr.calendarData,
                            totolCountArr:calendarDataArr.totolCountArr,
                            isLoading: false,
                        });                        
                    }                    
                })
                .then(() => {
                    let gridElement = document.getElementById('calendarGrid');                    
                    this.setState({
                        gridHeight: gridElement?gridElement.clientHeight: this.state.gridHeight
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            //else not page load - for change function 
            this.setState({isLoading: true});
            getCalendarDataByDate(calDate)
                .then(response => {
                    if (response) {
                        const {nextDays, locationdata, shiftData} = this.state;
                        var calendarDataArr = formLocationDateJson(nextDays,locationdata,shiftData,response,currUser);                       
                        this.setState({
                            activitiesData: calendarDataArr.activitiesData,
                            calendarData: calendarDataArr.calendarData,
                            totolCountArr:calendarDataArr.totolCountArr,
                            isLoading: false,
                        });                        
                    }
                })
                .then(() => {
                    let gridElement = document.getElementById('calendarGrid');                    
                    this.setState({
                        gridHeight: gridElement?gridElement.clientHeight: this.state.gridHeight
                    });                    
                })
                .catch(error => {
                    console.log(error);
                });
        }        
    }
    handleControlInput = (updatedDate:any, flag:boolean) => {
        this.setState({
            calDate: updatedDate,
            nextDays: flag
                ? getNextDaysArr(updatedDate, 6)
                : getNextDaysArr(updatedDate, 6),
        });
        this.getDataFromDB(updatedDate, false);
    }
    handleShiftClick = (event:any, date:any,  location:ICalendarData , shiftData:IShiftData) => {        
        event.preventDefault();
        var locationId =  location.LocationId;
        this.setState({
            userClickAction: true,
        });
        const {activitiesData,locationdata} = this.state;            
        var getfilteredData = filterByLocationShiftIdDate(
            activitiesData,
            locationId,
            date,
            shiftData.ShiftId
        );        
        //var groupedByEquip = groupByEquipment(getfilteredData);
    
        var activityHeader:string = formatActivityHeaderDate(date) + " "+ shiftData.ShiftName + "|"+location.LocationName +" - "+shiftData.ActivityNumber+"/"+location.LocationCapacity ;
        this.setState({
            userClickAction: false,
            filteredData: getfilteredData,
            tilesListKey: uuidv4(),
            activityHeader
        });
        // this.props.handleShiftClick(activityHeader, getfilteredData);
    }        

    loadSpinner = (labelTxt:string,isLoading:boolean) => {
        return (
            <div className="centeredContainer">
                <BlockingSpinner label={labelTxt} hideDialog={!isLoading}/>
            </div>
        );
    }
    render() {
        const itemToDisplay = 4;
        const {
            calDate,
            nextDays,            
            calendarData,
            locationdata,
            isLoading,
            filteredData,
            activityHeader,
            userClickAction,
            totolCountArr,
            tilesListKey
        } = this.state;                
        return (
            <div style={{width:"100%", textAlign:"center",overflow:"auto"}}>  
                <div className="Calendar">
                <CalendarControl calDate={calDate} handleChange={this.handleControlInput} />
                    <div dir="ltr" style={{boxShadow: Depths.depth16}}>                        
                        <div className={"CalendarBody"}>                        
                        {!isLoading ? (
                            <div id="calendarGrid" className="CalendarGrid" style={{boxShadow: Depths.depth16, padding: "0px"}}>
                                {nextDays.length > 0 ? (
                                    <table>
                                        <thead>
                                            <tr key={'row0'}>
                                                <th key={'th1'}>Location</th>
                                                {nextDays.map((item, key) => {
                                                    return (
                                                        <th key={key}>
                                                            <div>
                                                                {item.DateString}
                                                            </div>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {calendarData.length > 0 &&(
                                                <>
                                                {calendarData.map((location:ICalendarData, key:any) => {
                                                    return (
                                                        <tr key={'Lockey'+location.LocationId}>
                                                            <td key={'col-loc' +location.LocationId}>
                                                                {location.LocationName}
                                                            </td>
                                                            {location.CalData.map((calData,key1) => {
                                                                return (
                                                                    <td key={'col-' +calData.DayIndex +key1}
                                                                        title={'No. of Activities: '+calData.TotalInLocation}>
                                                                        {calData.ShiftData  && (
                                                                            <CalendarCoin key={calData.DayIndex}
                                                                                locationCapacity={location.LocationCapacity}
                                                                                location={location}
                                                                                locationId={location.LocationId}
                                                                                date={calData.Date}
                                                                                shiftData={calData.ShiftData}
                                                                                handleIconClick={this.handleShiftClick}
                                                                            />
                                                                        )}
                                                                    </td>
                                                                )})}
                                                        </tr>
                                                    )})}
                                                    <TotalByDateShift TotalCountArr={totolCountArr}/>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    this.loadSpinner('Processing Calendar',isLoading)
                                )}
                            </div>                           
                        ) : (
                            this.loadSpinner('Loading...',isLoading)
                        )}
                        {isLoading?
                                (<div></div>):
                                (
                                <>
                                    {userClickAction?(
                                        <div className="centeredContainer">
                                            <Spinner size={SpinnerSize.large} />
                                        </div>
                                    ):
                                    (
                                        <div className={"ActivityCards"} style={{height: this.state.gridHeight}}>
                                            {filteredData.length>0 ? (
                                                    <ActivityTiles key={tilesListKey}
                                                        LocationsData = {locationdata}
                                                        activityTilesArr={filteredData} 
                                                        maxTilesPerRow={1}
                                                        heading={activityHeader}
                                                    />
                                                ) : 
                                                (<MessageBar>Please click on the shift icon to get the details of the activities.</MessageBar>)
                                            }
                                        </div>
                                    )}
                                </>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
