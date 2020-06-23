import * as React from 'react';
import { UserInfoContext } from '../../Main';
import ActivityGridService from '../../services/activity-grid-service';
import {
    MessageBar,
    MessageBarType,
} from 'office-ui-fabric-react/lib/MessageBar';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import {DetailsList, ConstrainMode, CheckboxVisibility, IDetailsRowStyles, DetailsRow,
    SelectionMode, IDetailsListProps,IDetailsListStyles} 
from 'office-ui-fabric-react/lib/DetailsList';
import { FontIcon} from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const moment = require('moment');

const detailsListStyles:Partial<IDetailsListStyles> = {
    headerWrapper:{
        selectors: {
            '& .ms-DetailsHeader-cell:hover': {
                backgroundColor: 'white!important',
            },
        }
    },
}

export interface IExperimentGrid {
    ExperimentId: number;
    ExperimentName: string;
    ExperimentOwner: string;
    ExperimentDescription: string;
    ExperimentStartDate:any;
}

export interface IExperimentGridState {
    ExperimentsWithoutActivites:IExperimentGrid[];
    isLoading:boolean;
    gridLabel:string;
    errorMessage:string;
    showErrorMessage:boolean;
}

export default class ExperimentGrid extends React.Component<{}, IExperimentGridState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            ExperimentsWithoutActivites:[] as IExperimentGrid[],
            isLoading:false,
            errorMessage:'',
            gridLabel:"My Experiments (with no activities)",
            showErrorMessage:false
        }
        ExperimentGrid.contextType = UserInfoContext;
    }
    componentDidMount(){
        this.setState({isLoading:true});
        this._getDataFromDB();
    }
    _getDataFromDB = () => {        
        let userEmail = this.context.userName;
        ActivityGridService.GetExpWithoutActivitiesGridForUser(userEmail, 1, null)
        .then((result)=>{
            let items: IExperimentGrid[] = result.data as IExperimentGrid[];
            let e = _.orderBy(items, 'ExperimentStartDate');
            console.log(e);
            this.setState({
                ExperimentsWithoutActivites: e,
                isLoading: false,
                errorMessage: ""
            });            
        })
        .catch(error => {
            this.setState({
                isLoading: false,
                errorMessage:"Error Occured!\n"+error ,
                showErrorMessage:true    
            });
        });
    }
    renderErrorMsg(msg:string){
        return(
            <MessageBar messageBarType={MessageBarType.error} className={"errorMsgInfo"}>
                {msg}
            </MessageBar>
        );
    }
  public render() {
      const {gridLabel,isLoading,errorMessage,showErrorMessage,ExperimentsWithoutActivites } = this.state;
    return (
      <div className="ExperimentGrid">
            <div style={{width:"90%",overflow:"auto",margin:"0 auto",paddingBottom:"10px",paddingTop:"30px"}}>
                <div style={{float:"left",width:"50%"}}>
                    <div style={{fontSize: "12pt", fontWeight: "bold", textAlign:"left"}}>
                        {gridLabel}
                    </div>
                </div>
            </div>
        {showErrorMessage && this.renderErrorMsg(errorMessage)}
        {isLoading?<Spinner size={SpinnerSize.large} labelPosition={"top"} label="Loading Experiments (with no activities)..."/>:
        (
            <div>
                   {
                    ExperimentsWithoutActivites.length > 0 ? 
                        <div style={{width:"90%",margin:"0 auto"}}>
                            <DetailsList 
                                compact={true}
                                items={ExperimentsWithoutActivites}
                                columns= { this._getColumns() }
                                onRenderRow={this._onRenderRow}
                                constrainMode={ ConstrainMode.horizontalConstrained }
                                checkboxVisibility={CheckboxVisibility.always}
                                onShouldVirtualize={ () => false }
                                selectionMode={SelectionMode.none}  
                                selectionPreservedOnEmptyClick={false} 
                                styles ={detailsListStyles}                               
                            ></DetailsList>
                        </div>:
                        <span></span>
                }
            </div>
        )}
      </div>
    );
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
    }
    checkIsPastRecord = (item:IExperimentGrid):boolean =>{
        let flag:boolean = true;
        let currActivityDate = moment(item.ExperimentStartDate);
        let currDate = moment(new Date());
        let diffDates = currDate.diff(currActivityDate,'days');
        if(diffDates>0){
            flag = false;
        }
        return flag;
    }
    _getColumns = () => {        
        return [
            {
                key: "Edit",
                name: "Edit",
                fieldName: "ActivityId",
                minWidth: 50,
                maxWidth: 50,
                onRender: (item: IExperimentGrid) => {
                const linkURL = "/PlanExperiment?id=";
                return <div>
                            {this.checkIsPastRecord(item) && ( 
                            item.ExperimentOwner?.toUpperCase()===this.context.userName.toUpperCase() 
                            || this.context.isAdmin)?(
                                <Link to={linkURL + item.ExperimentId.toString()}>
                                    <FontIcon iconName="EditSolid12" title="Edit Activity" style={{color: "#4f4e4d"}}/>  
                                </Link>): 
                                (<Link to={linkURL + item.ExperimentId.toString()+"&view=1"}>
                                    <FontIcon iconName="LockSolid" title="View-Only Activity" style={{color: "#4f4e4d"}}/>  
                                </Link>)}
                        </div>
                }
            }, 
            {
                key: "ExperimentName",
                name: "Experiment Name",
                fieldName: "ExperimentName",
                minWidth: 350,
                maxWidth: 400,
            },
            {
                key: "ExperimentStartDate",
                name: "Start Date",
                fieldName: "ExperimentStartDate",
                minWidth: 60,
                maxWidth: 70,
                onRender: (item: IExperimentGrid) => {
                    return <span>{moment.utc(item.ExperimentStartDate).format("MM/DD/YYYY")}</span>;
                }
            },
            {
                key: "ExperimentOwnerName",
                name: "Experiment Owner",
                fieldName: "ExperimentOwnerName",
                minWidth: 120,
                maxWidth: 140,
            },
            {
                key: "ExperimentDescription",
                name: "Description",
                fieldName: "ExperimentDescription",
                minWidth: 100,
                maxWidth: 120,
            }
        ];
    }
}