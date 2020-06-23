import * as React from 'react';
import {chunk} from 'lodash';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import { IActivityTilesProps, IActivityTilesState } from './intefaces/IActivityTiles';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import AppConfig from '../../Constans';
import { IActivityComplete, ICalLocation } from './intefaces/ICalendar';
import _ from 'lodash';
const uuidv4 = require('uuid/v4');

export default class ActivityTiles extends React.Component<IActivityTilesProps,IActivityTilesState> {
    constructor(props:IActivityTilesProps) {
        super(props);

        this.state = {
            activityTilesArr: [],
        };
    }
    componentDidMount() {
        const {activityTilesArr} = this.props;
        this.setState({
            activityTilesArr,
        });
    }
    componentDidUpdate(prevProps:IActivityTilesProps,prevState:IActivityTilesState) {
        const {activityTilesArr} = this.props;
        if (activityTilesArr.length !== this.props.activityTilesArr.length) {
            this.setState({
                activityTilesArr: this.props.activityTilesArr,
            });
        }
    }
    CreateChunkAndFill = (maxTilesPerRow:number, pageLinksArr:IActivityComplete[]) => {
        var splitArray:any = chunk(pageLinksArr, maxTilesPerRow);
        for (var i = 0; i < splitArray.length; i++) {
            if (splitArray[i].length < maxTilesPerRow) {
                var b = maxTilesPerRow - splitArray[i].length;
                for (var j = 0; j < b; j++) {
                    splitArray[i].push({});
                }
            }
        }
        return splitArray;
    }
    getLocationSpecificArr = (equipmentNames:string,locationId:number):string[] => {
        var equipArr:string[]  = equipmentNames?.split(",");
        const {LocationsData} = this.props;
        if(equipArr.length>0){
            var filteredLocation:ICalLocation[] = _.filter(LocationsData,{LocationId:locationId});
            if(filteredLocation && filteredLocation.length>0){
                let currLocation:ICalLocation = filteredLocation[0];
                let locSpecificEquips:string[] = equipArr.filter((equip) =>{
                        if(currLocation.EquipmentArr.indexOf(equip) !== -1){
                            return true;
                        }
                        else{
                            return false;
                        }
                    });
                return locSpecificEquips;
            }
        }
        return equipArr;
    }
    render() {
        const {maxTilesPerRow,heading} = this.props;
        const {activityTilesArr} = this.state;
        var splitArray = this.CreateChunkAndFill(
            maxTilesPerRow,
            activityTilesArr,
        ); 

        var ofcLocId = AppConfig.ActivityForm.officeSpaceUsageLocation;  
        return (
            <>
                <div style={{padding: "5px 5px 10px 5px", fontWeight: "bold", fontSize: "1em"}}>
                    {
                        heading.split("|").map((elem,headkey)=>{return <div key={headkey}>{elem}</div>})
                    }
                </div>
                {splitArray.map((activityTiles:IActivityComplete[], key:any) => {
                    return (
                        <div key={uuidv4()} style={{backgroundColor: "transparent", margin: "0 auto ", width:"95%",fontSize:"14px"}}>
                            {activityTiles.map((item:IActivityComplete, key1:any) => {
                                const equipArr:string[] = item.EquipmentName?this.getLocationSpecificArr(item.EquipmentName,item.LocationId):[];
                                const contactUserNameEmail = item.IsEmployee?item.BookedForEmail:item.BookedByEmail;
                                return item.ActivityId ? (        
                                    <div key={uuidv4()}>                            
                                        <div  
                                            style={{
                                                boxShadow: Depths.depth16,
                                                borderRadius: "10px", 
                                                //backgroundColor: "#4f4e4d", 
                                                minHeight: "100px",
                                                color: "#fff"                                                                                                                                  
                                            }}>
                                            <div title={item.ActivityName} data-title={item.ActivityName} className={'activityContaitner'} 
                                            style={{padding: "0px"}}>
                                                <div className={"activityHeadingSection"} 
                                                style={{backgroundColor: "#4f4e4d", borderRadius:"10px 10px 0px 0px", padding:"5px 5px 5px 10px", minHeight: "20px"}}>
                                                    <div style={{width: "80%", float:"left"}}>
                                                        {item.ActivityName.length > 20 ? item.ActivityName.substring(0, 30)+"..." : item.ActivityName}                                                        
                                                    </div>
                                                    <div style={{width: "20%", float:"right", textAlign: "right"}}>
                                                        <span>
                                                        {
                                                            item.ExperimentId ? <FontIcon iconName="TestPlan" title="Part of an experiment" style={{color: "#fff", fontSize:"1.25em", verticalAlign:"bottom"}}/> : ""    
                                                        }
                                                        </span>                                                       
                                                    </div>
                                                </div>                                            
                                                <div title={item.BookedForName} style={{color:"#4f4e4d", paddingLeft:"10px",wordBreak:"break-all" }}>
                                                    <span style={{fontWeight: "bold"}}>Booked For:</span>
                                                    <div style={{fontSize: "1em"}}>
                                                        {item.IsEmployee?
                                                        <span style={{wordBreak:"break-word"}}>
                                                            {item.BookedForName}
                                                            <a href={"msteams:/l/chat/0/0?users="+contactUserNameEmail}  style={{paddingLeft:"10px"}}>
                                                                    <FontIcon iconName="TeamsLogo16" title={"Chat"} 
                                                                    style={{color: "#5A5B96", fontSize:"1em", verticalAlign:"bottom"}}/>      
                                                            </a>
                                                        </span>
                                                        :(
                                                        <div style={{display:'flex',flexDirection: 'column'}}>
                                                            <span>{item.BookedForEmail}</span><span>{'(Host: '+ item.BookedByName+')'}
                                                                <a href={"msteams:/l/chat/0/0?users="+contactUserNameEmail}  style={{paddingLeft:"10px"}}>
                                                                    <FontIcon iconName="TeamsLogo16" title={"Chat"} 
                                                                    style={{color: "#5A5B96", fontSize:"1em", verticalAlign:"bottom"}}/>      
                                                                </a>
                                                            </span>
                                                        </div>)} 
                                                    </div>  
                                                </div>
                                                {
                                                    item.ExperimentName ? <div style={{color:"#4f4e4d", padding:"5px 10px 5px 10px", overflow: "auto"}}>
                                                    <span style={{fontWeight: "bold"}}>Experiment Name:</span>                                                 
                                                    <div style={{fontSize: "1em"}}> { item.ExperimentName } </div>
                                                </div> : "" 
                                                }
                                                {item.LocationId === ofcLocId ?"":(
                                                <div title={"Equipments"} 
                                                    style={{color:"#4f4e4d", padding:"5px 10px 5px 10px", overflow: "auto"}}>
                                                    <span style={{fontWeight: "bold"}}>Equipment Reserved:</span>                                                 
                                                    <div style={{fontSize: "1em"}}> { equipArr.length>0 ? equipArr.join(", ") : "None" } </div>
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{height:"10px"}}></div>
                                    </div>
                                ) : <div key={key1}></div>;
                            })}
                        </div>
                    );
                })}
            </>
        );
    }
}
