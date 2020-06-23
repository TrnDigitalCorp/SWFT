import * as React from 'react';
import * as _ from 'lodash';
import {formatActivityDate} from './ActivityService';
import {
    MessageBar,
    MessageBarType,
} from 'office-ui-fabric-react/lib/MessageBar';
import FLatDatePickr from '../utils/FLatDatePickr';
import SwitchSelector from './SwitchSelector';
import { IDateAndShiftsProps, IDateAndShiftsState } from './interfaces/IDateAndShifts';
import { IActivityShift } from './interfaces/IActivityForm';
import AppConfig from '../../Constans';

const moment =  require('moment');


export default class DateAndShifts extends React.Component<IDateAndShiftsProps,IDateAndShiftsState> {
    constructor(props:IDateAndShiftsProps) {
        super(props);
        this.state = {
            shiftTimmings: [],
            selectedShiftIds: [],
            activityDate: new Date(formatActivityDate()),
            errorMsgs:{},
            Offset:0,
            ExpDate:null
        };
    }
    componentDidMount() {
        const {shiftTimmings, errorMsgs,activityDate,selectedShiftIds,ExpDate} = this.props;
        let expDate = moment(ExpDate);
        let actDate = moment(activityDate);
        let offset = actDate.diff(expDate,'days');
        this.setState({
            shiftTimmings,
            activityDate,
            selectedShiftIds,
            errorMsgs,
            ExpDate,
            Offset:offset
        });
    }
    componentDidUpdate(prevProps:IDateAndShiftsProps, prevState:IDateAndShiftsState) {
        const {shiftTimmings, errorMsgs,activityDate,ExpDate,selectedShiftIds} = this.props;
        if (prevProps.shiftTimmings.length != shiftTimmings.length) {
            this.setState({
                shiftTimmings
            });
        }
        if (prevProps.activityDate != activityDate) {
            this.setState({
                activityDate
            });
        }
        if (prevProps.selectedShiftIds.length != selectedShiftIds.length) {
            this.setState({
                selectedShiftIds
            });
        }
        if(errorMsgs.activityDate!==prevProps.errorMsgs.activityDate || errorMsgs.selectedShiftIds!==prevProps.errorMsgs.selectedShiftIds ){
            this.setState({
                errorMsgs
            });
        }
        if(ExpDate && prevProps.ExpDate){
            let prevExpDate = moment(prevProps.ExpDate);
            let expDate = moment(ExpDate);
            let dateDiff = expDate.diff(prevExpDate,'days',true);
            if(dateDiff !== 0){
                let offset  = this.getOffsetValue(activityDate,ExpDate);
                this.setState({
                    Offset:offset,
                    ExpDate
                });
            }
        }
        if(ExpDate && prevProps.ExpDate){
            let prevActDate = moment(prevProps.activityDate);
            let actDate = moment(activityDate);
            let dateDiff = actDate.diff(prevActDate,'days',true);
            if(dateDiff !== 0){
                let offset  = this.getOffsetValue(activityDate,ExpDate);
                this.setState({
                    Offset:offset,
                    ExpDate
                });
            }
        }
    }  
    getOffsetValue =(date1:any,date2:any) :number => {
        let expDate = moment(date1);
        let actDate = moment(date2);
        return  Math.ceil(expDate.diff(actDate,'days',true));
    }  
    handleDateSelectChange = (date:any) => {
        const {activityDate,ExpDate}:any = this.state;
        if (
            date &&
            formatActivityDate(date) != formatActivityDate(activityDate)
        ) {
            let offset  = this.getOffsetValue(date,ExpDate);
            this.setState({
                activityDate: date,
                Offset:offset
            });
        }
        this.props.handleFormFieldChange(date, 'activityDate');
    }
    handleShiftSelection = (updatedShiftArr:IActivityShift[]) => {
        var selectedShiftIds:any[] = _.map(
            _.filter(updatedShiftArr, {isSelected: true}),
            'Id',
        );
        this.setState({
            shiftTimmings: updatedShiftArr,
            selectedShiftIds,
        });
        this.props.handleFormFieldChange(selectedShiftIds,'selectedShiftIds');
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
        const {shiftTimmings, errorMsgs,activityDate,Offset} = this.state;
        const {viewForm, ExpId} = this.props;
        return (
            <div className="ms-Grid-row" style={{display: 'flex', alignItems: 'flex-end'}}>
                <div className="ms-Grid-col ms-sm3">
                    <FLatDatePickr
                        required={true}
                        viewForm={viewForm}
                        labelHead="Activity Date"
                        updateFunc={this.handleDateSelectChange}
                        dateInput={activityDate}
                    />
                    {errorMsgs.activityDate?this.renderErrorMsgForField(errorMsgs.activityDate,'activityDateError'):''}
                </div>
                {ExpId && (
                    <div className="ms-Grid-col ms-sm1" style={{marginBottom:'5px'}}>
                        {(Offset && Offset<0)?"Error: NA":"T + "+ Offset}
                    </div>)}
                <div className={ExpId?"ms-Grid-col ms-sm8":"ms-Grid-col ms-sm9"}>
                    {shiftTimmings.length>0?(
                        <SwitchSelector
                            viewForm={viewForm}
                            labelHead="Activity Shift"
                            required={true}
                            arrayInput={shiftTimmings}
                            handleChangeFunction={this.handleShiftSelection}
                        />
                    ):(
                        <MessageBar messageBarType={MessageBarType.error} className={"errorMsgInfo"}>
                            {AppConfig.ActivityForm.NoShiftsErrorMsg}
                        </MessageBar>
                    )}
                    {errorMsgs.selectedShiftIds?this.renderErrorMsgForField(errorMsgs.selectedShiftIds,'selectedShiftIdsError'):''}
                </div>
            </div>
        );
    }
}