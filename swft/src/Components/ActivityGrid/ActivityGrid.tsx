import React, { ChangeEvent } from 'react';
import { IActivityGridProps } from "./IActivityGridProps";
import { IActivityGridState } from "./IActivityGridState";
import * as axios from 'axios';
import ActivityGridService from "../../services/activity-grid-service";
import {DetailsList, ConstrainMode, CheckboxVisibility, IDetailsListStyles, IGroup, IDetailsRowStyles, DetailsRow,
     Selection, SelectionMode, IDetailsGroupRenderProps,IGroupDividerProps, IDetailsListProps} 
from 'office-ui-fabric-react/lib/DetailsList';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { FontIcon, ImageIcon } from 'office-ui-fabric-react/lib/Icon';
import { Redirect, Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { IActivityGridModel } from "../../Models/IActivityGridModel";
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { UserInfoContext } from '../../Main';
import AppConfig from '../../Constans';
import ExperimentGrid from './ExperimentGrid';
import { groupAndSortGridItems, IGroupData } from './GroupGridItems';

const iconClass = mergeStyles({
  fontSize: 30,
  height: 50,
  width: 50,
  margin: '0 25px',
});
const detailsListStyles:Partial<IDetailsListStyles> = {
    headerWrapper:{
        selectors: {
            '& .ms-DetailsHeader-cell:hover': {
                backgroundColor: 'white!important',
            },
        }
    },
}

export class ActivityGrid extends React.Component<IActivityGridProps,IActivityGridState>  {
    private _selection: Selection;
    constructor(props: IActivityGridProps){
        super(props);       

        this._selection = new Selection({
            onSelectionChanged: () => this._onItemSelectionChange()
        });          

        ActivityGrid.contextType = UserInfoContext;

        this.state={
            activities: [],
            groups: [],
            isLoading: true,
            gridLabel: "My Activites",
            showAllActivities: false,
            showAllActivitiesLoading: false,
            selectedActivityIndex: -1,
            redirectURI: "",
            hideEditActBtn: true,
            hideEditExpBtn: true,
            errorMessage: ""
        };
    }
    public render(): React.ReactElement {      
        return (
            <div style={{width:"100%", textAlign:"center",overflow:"auto"}}>                          
                <div style={{width:"90%",display:"none"}}>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </div>                
                <div style={{width:"90%",overflow:"auto",margin:"0 auto",paddingBottom:"10px",paddingTop:"30px"}}>
                     <div style={{float:"left",width:"20%"}}>
                        <div style={{fontSize: "12pt", fontWeight: "bold", textAlign:"left"}}>
                            {this.state.gridLabel}
                        </div>
                    </div>
                    <div style={{float:"right",width:"80%"}}>   
                        <div style={{float:"right", paddingTop:"5px", paddingLeft:"5px"}}>
                            <Checkbox label="Show all activities" onChange={this._onShowAllActivitiesChange} style={{float:"right"}}/>
                        </div>
                        <div style={{float:"right", paddingTop:"5px"}}>
                            {this.state.showAllActivitiesLoading && <Spinner size={SpinnerSize.small}></Spinner>}
                        </div>
                    </div>
                </div>
                {
                    this.state.activities.length > 0 ? 
                        <div style={{width:"90%",margin:"0 auto"}}>
                            <DetailsList 
                                compact={true}
                                items={ this.state.activities}
                                columns= { this._getColumns() }
                                groups={ this.state.groups }
                                groupProps={{
                                    onRenderHeader: this._onRenderGroupHeader
                                }}
                                onRenderRow={this._onRenderRow}
                                constrainMode={ ConstrainMode.horizontalConstrained }
                                checkboxVisibility={CheckboxVisibility.always}
                                onShouldVirtualize={ () => false }
                                selection={this._selection} 
                                selectionMode={SelectionMode.none}  
                                selectionPreservedOnEmptyClick={false}
                                styles={detailsListStyles}                                
                            ></DetailsList>
                        </div>:
                        <span></span>
                }
                <div style={{}}>
                    {this.state.isLoading && <Spinner size={SpinnerSize.large} labelPosition={"top"} label="Loading activities..."></Spinner>}
                </div>
                {
                    this.state.errorMessage !== "" ? <div style={{color: "red"}}>{this.state.errorMessage}</div> : ""
                }
                { this.state.redirectURI != "" ? <Redirect to={this.state.redirectURI} /> : "" } 
                <ExperimentGrid/>  
            </div>
        );
    }   
    private getEditExpLink(GroupData:IGroupData):JSX.Element{
        if(GroupData && Object.keys(GroupData).length>0){
            if (GroupData.isEditable) {
                return (
                    <Link style={{fontSize:"12pt",paddingLeft:"20px"}} to={"/PlanExperiment?id=" + GroupData.ExpId} >
                        <FontIcon iconName="Edit" title="Edit Experiment" style={{color: "#fff"}}/>      
                    </Link> 
                );
            }
            else {
                return (
                    <Link style={{fontSize:"12pt",paddingLeft:"20px"}} to={"/PlanExperiment?id=" + GroupData.ExpId+"&view=1"} >
                        <FontIcon iconName="LockSolid" title="View-Only Experiment" style={{color: "#fff"}}/>      
                    </Link>
                );
            }
        }
        else{
            return <></>;
        }
    }
    private _onRenderGroupHeader: IDetailsGroupRenderProps['onRenderHeader'] = props => {
        // console.log(props);
        if (props) {
          return (            
            <div 
            onClick={this._onToggleCollapse(props)}
            style={{fontSize:"12pt", textAlign:"left", padding:"10px",backgroundColor:"#4f4e4d",color:"#fff", cursor:"pointer"}}>
                <FontIcon 
                    iconName={props.group!.isCollapsed ? "ChevronRightMed" : "ChevronDownMed"} 
                    title={props.group!.isCollapsed ? "Expand" : "Collapse"} 
                    style={{color: "#fff", paddingRight:"10px"}}/>      
                {`${props.group!.name}`} 
                {this.getEditExpLink(props.group?.data)}
            </div>
          );
        }
        return null;
    }
    private _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
        const customStyles: Partial<IDetailsRowStyles> = {};
        if (props) {
          if (props.itemIndex % 2 === 0) {
            // Every other row renders with a different background color
            customStyles.root = { backgroundColor: "#ebe9e8" };
          }
    
          return <DetailsRow {...props} styles={customStyles} />;
        }
        return null;
      };
    _onToggleCollapse = (props: IGroupDividerProps) => {
        return () => {
          props!.onToggleCollapse!(props!.group!);
        };
    }
    _onItemSelectionChange = () => {
        let selIndices = this._selection.getSelectedIndices();        
        if(selIndices.length > 0){
            this.setState({
                selectedActivityIndex: this._selection.getSelectedIndices()[0],
                hideEditActBtn: selIndices.length==1 ? true : false
            });
        }
        else{
            this.setState({
                selectedActivityIndex: -1,
                hideEditActBtn: true,
                hideEditExpBtn: true                
            });
        }
    }
    _onAddActClick = () => {
        this.setState({
            redirectURI: "/PlanActivity"
        });
    }
    _onEditActClick = () => {
        let selIndex = this.state.selectedActivityIndex;                          
        this.setState({
            redirectURI: "/PlanActivity/" + selIndex.toString()
        });
    }
    _onAddExpClick = () => {
        this.setState({
            redirectURI: "/PlanExperiment"
        });
    }
    _onEditExpClick = () => {
    }
    _onActBtnClick = () => {
        let selIndex = this.state.selectedActivityIndex;                  
        this.setState({
            redirectURI: selIndex >= 0 ? "/PlanActivity/" + selIndex.toString() : "/PlanActivity"
        });
    }
    _onExpBtnClick = () => {  
        let selIndex = this.state.selectedActivityIndex;                  
        this.setState({
            redirectURI: selIndex >= 0 ? "/PlanExperiment/" + selIndex.toString() : "/PlanExperiment"
        });
    }   
    _onShowAllActivitiesChange=(ev: any)=>{
        if(ev.target.checked){
            this.setState({
                gridLabel: "All Activities",
                showAllActivities: true,
                showAllActivitiesLoading: true
            }, ()=>{
                this._getDataFromDB();
            });
        }
        else{
            this.setState({
                gridLabel: "My Activities",
                showAllActivities: false,
                showAllActivitiesLoading: true
            }, ()=>{
                this._getDataFromDB();
            });
        }
    }    
    componentDidMount(){
        this._getDataFromDB();
    }
    
    _getDataFromDB = () => {        
        let userEmail = this.state.showAllActivities ? null : this.context.userName;
        ActivityGridService.getActivitiesForUser(userEmail, 1, null)
        .then((result)=>{
            let items: IActivityGridModel[] = result.data as IActivityGridModel[];
            let groupedItems = this._groupActivitiesById(items);
            let currUserObj = this.context;
            let gridObj= groupAndSortGridItems(groupedItems,"ExperimentId","Experiment: ","ActivityDate","ExperimentStartDate",currUserObj);
            let newGridLabel = gridObj.ItemsArr ? this.state.gridLabel + " ("+ gridObj.ItemsArr.length.toString() +")": "";    
            console.log("gridObj",gridObj);
            this.setState({
                activities: gridObj.ItemsArr,
                groups: gridObj.GroupArr,
                isLoading: false,
                showAllActivitiesLoading: false,
                gridLabel: newGridLabel,
                errorMessage: ""
            });            
        })
        .catch(error => {
            this.setState({
                activities: [],
                isLoading: false,
                showAllActivitiesLoading: false,
                errorMessage: "Error Occured!\n"+error                
            });
        });
    }
    _checkIfGroupedItemExists = (proPValueStr:string,itemToAdd:string) :boolean =>{
        let isPresent = false;
        let valueArr =  proPValueStr.split(",");
        if(valueArr && valueArr.length>0){
            if(valueArr.indexOf(itemToAdd)!==-1){
                isPresent = true;
            }
        }
        return isPresent
    }
    _groupActivitiesById = (rawArray: IActivityGridModel[]) => {            
        let groupedArr: IActivityGridModel[]=[];
        rawArray.forEach((item, index)=>{
            let groupedItem = groupedArr.filter(i => {return i.ActivityId==item.ActivityId});
            if(groupedItem.length<1){
                groupedArr.push(item);
            }
            else{
                if (groupedItem[0].ShiftName != item.ShiftName && item.ShiftName!=null){
                    if(!this._checkIfGroupedItemExists(groupedItem[0].ShiftName,item.ShiftName)){
                        groupedItem[0].ShiftName = groupedItem[0].ShiftName+","+ item.ShiftName;
                    }
                }
                if (groupedItem[0].LocationName != item.LocationName && item.LocationName!=null){
                    if(!this._checkIfGroupedItemExists(groupedItem[0].LocationName,item.LocationName)){
                        groupedItem[0].LocationName = groupedItem[0].LocationName+","+ item.LocationName;
                    }
                }
                if (groupedItem[0].EquipmentName != item.EquipmentName && item.EquipmentName!=null){
                    if(!this._checkIfGroupedItemExists(groupedItem[0].EquipmentName,item.EquipmentName)){
                        groupedItem[0].EquipmentName = groupedItem[0].EquipmentName+"," + item.EquipmentName;
                    }
                }
            }
        });
        console.log(groupedArr);
        return groupedArr;        
    }
    _getGroups = (items: IActivityGridModel[]) => {        
        let groups: IGroup[]=[];        
        if(items.length > 0){
            items.forEach((item, index)=>{ 
                let _key = item.ExperimentId ? item.ExperimentId.toString() : "noex";
                let _name = item.ExperimentName ? ("Experiment: " + item.ExperimentName) : "Stand-alone Activities";
                let group = groups.filter(g => {return g.key==_key});            
                if(group.length > 0){            
                    group[0].count++;        
                }
                else{         
                    //check if it's experiment owner
                    let showEdit = item.Owner ? item.Owner.toUpperCase()===this.context.userName.toUpperCase() : false;
                    //check if it's administrator
                    showEdit = showEdit || this.context.isAdmin;       
                    //check if the group is for standalone activities
                    showEdit = showEdit && _key!=="noex";
                    groups.push({
                        key: _key,
                        name: _name,
                        startIndex: index,
                        count: 1,
                        data: showEdit
                    });                 
                }
            });
        }
        return groups;
    }
    _getEditLink = (item: IActivityGridModel): string=>{ 
        let editLink = "/PlanActivity?id=";
        if(item.LocationName){
            let locArr = item.LocationName?.split(",");
            if(locArr.indexOf(AppConfig.ActivityForm.officeSpaceUsageLocationName)!==-1){
                editLink = "/PlanOfficeSpace?id=";
            }
        }
        return editLink;       
    }
    checkIsPastRecord = (item:IActivityGridModel):boolean =>{
        let flag:boolean = true;
        let currActivityDate = moment(item.ActivityDate);
        let currDate = moment(new Date());
        let diffDates = currDate.diff(currActivityDate,'days');
        if(diffDates>0){
            flag = false;
        }
        return flag;
    }
    _getColumns = () => {        
        return [
            /* {
                key: "ActivityId",
                name: "Id",
                fieldName: "ActivityId",
                minWidth: 50,
                maxWidth: 50,
            },
            {
                key: "ExperimentId",
                name: "Ex Id",
                fieldName: "ExperimentId",
                minWidth: 50,
                maxWidth: 50,
            },*/
            {
                key: "Edit",
                name: "Edit",
                fieldName: "ActivityId",
                minWidth: 50,
                maxWidth: 50,
                onRender: (item: IActivityGridModel) => {
                    let linkURL = this._getEditLink(item);
                return <div>
                            {this.checkIsPastRecord(item) && (
                            item.BookedByEmail.toUpperCase()===this.context.userName.toUpperCase() 
                            || item.BookedForEmail.toUpperCase()===this.context.userName.toUpperCase() 
                            || item.Owner?.toUpperCase()===this.context.userName.toUpperCase() 
                            || this.context.isAdmin)?(
                                <Link to={linkURL + item.ActivityId.toString()}>
                                    <FontIcon iconName="EditSolid12" title="Edit Activity" style={{color: "#4f4e4d"}}/>  
                                </Link>): 
                                (<Link to={linkURL + item.ActivityId.toString()+"&view=1"}>
                                    <FontIcon iconName="LockSolid" title="View-Only Activity" style={{color: "#4f4e4d"}}/>  
                                </Link>)}
                        </div>
                }
            }, 
            {
                key: "ActivityName",
                name: "Activity",
                fieldName: "ActivityName",
                minWidth: 350,
                maxWidth: 400,
            },
            {
                key: "ActivityDate",
                name: "Date",
                fieldName: "ActivityDate",
                minWidth: 60,
                maxWidth: 70,
                onRender: (item: IActivityGridModel) => {
                    return <span>{moment.utc(item.ActivityDate).format("MM/DD/YYYY")}</span>;
                }
            },
            {
                key: "ShiftName",
                name: "Shift(s)",
                fieldName: "ShiftName",
                minWidth: 150,
                maxWidth: 170,
                onRender: (item: IActivityGridModel) => {
                    if(!item.ShiftName){
                        return <span></span>;
                    }
                    else{
                        let uniqShiftArr = item.ShiftName.split(',');
                        return (<div>
                            { uniqShiftArr.map((shift,key)=>{return <div key={key}>{shift}</div>})}
                            </div>
                        );
                    }
                }
            },
            {
                key: "LocationName",
                name: "Location(s)",
                fieldName: "LocationName",
                minWidth: 100,
                maxWidth: 120,
                onRender: (item: IActivityGridModel) => {
                    if(!item.LocationName){
                        return <span></span>;
                    }
                    else{
                        let uniqLocArr = item.LocationName.split(',');
                        return (<div>
                            { uniqLocArr.map((loc,key)=>{return <div key={key}>{loc}</div>})}
                            </div>
                        );
                    }
                }
            },
            {
                key: "EquipmentName",
                name: "Equipment(s)",
                fieldName: "EquipmentName",
                minWidth: 150,
                maxWidth: 170,
                onRender: (item: IActivityGridModel) => {
                    if(!item.EquipmentName){
                        return <span></span>;
                    }
                    else{
                        let uniqEquipArr = item.EquipmentName.split(',');
                        return (<div>
                            { uniqEquipArr.map((eq,key)=>{return <div key={key}>{eq}</div>})}
                            </div>
                        );
                    }
                }
                
            },
            {
                key: "BookedForEmail",
                name: "Person",
                fieldName: "BookedForEmail",
                minWidth: 100,
                maxWidth: 120,
            }
        ];
    }
}    