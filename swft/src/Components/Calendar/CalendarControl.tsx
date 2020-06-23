import * as React from 'react';
import {Icon} from 'office-ui-fabric-react';
import FLatDatePickr from  '../utils/FLatDatePickr'
import {Link} from 'office-ui-fabric-react/lib/Link';
import {today, formatCalDate} from './CalendarService';
import { ICalendarControlProps, ICalendarControlState } from './intefaces/ICalendarControl';

export default class CalendarControl extends React.Component<ICalendarControlProps,ICalendarControlState> {
    constructor(props:ICalendarControlProps) {
        super(props);
        this.state = {
            calDate: today,
            lastDisabled: false,
            nextDisabled: false,
            offset: 1,
        };
    }
    componentDidMount() {
        const {calDate} :any = this.props;
        this.setState({
            calDate: calDate,
        });
    }
    getUpdatedDatevalue = (isNext:boolean, offset:number, dateValue:any) => {
        var calDateObj = new Date(dateValue);
        if (isNext) {
            calDateObj.setDate(calDateObj.getDate() + 7);
        } else {
            calDateObj.setDate(calDateObj.getDate() - 7);
        }
        // if (calDateObj < today) {
        //     calDateObj = today;
        // }
        return calDateObj;
    };
    getLastFlag = (offsetvalue:number, newCalDate:any) => {
        var checkFlag = false;
        if (newCalDate <= today) {
            return true;
        }
        return checkFlag;
    };
    handleOffsetAddition = (ev:any) => {
        ev.preventDefault();
        ev.stopPropagation();
        let operation = ev.currentTarget.id;
        const {offset, calDate} = this.state;
        var opFlag = true;
        if (operation === 'next') {
            opFlag = true;
            let offsetvalue = offset + 1;
            var newCalDate = this.getUpdatedDatevalue(
                true,
                offsetvalue,
                calDate,
            );
            let checkLastFlag = false;//this.getLastFlag(offsetvalue, newCalDate);
            this.setState({
                offset: offsetvalue,
                lastDisabled: checkLastFlag,
                nextDisabled: false,
                calDate: newCalDate, //< today ? today : newCalDate,
            });
        } else {
            opFlag = false;
            let offsetvalue = offset - 1;
            var newCalDate = this.getUpdatedDatevalue(
                false,
                offsetvalue,
                calDate,
            );
            let checkLastFlag = false//this.getLastFlag(offsetvalue, newCalDate);
            this.setState({
                offset: offsetvalue,
                lastDisabled: checkLastFlag,
                nextDisabled: false,
                calDate: newCalDate, //< today ? today : newCalDate,
            });
        }
        this.props.handleChange(newCalDate, opFlag);
    };

    handleDateSelect = (updatedDate:any) => {
        const {calDate}:any = this.state;
        if (updatedDate &&
            formatCalDate(updatedDate) != formatCalDate(calDate)) 
        {
            let checkLastFlag = false; //this.getLastFlag(1, updatedDate);
            this.setState({
                calDate: updatedDate,
                lastDisabled: checkLastFlag,
                nextDisabled: false,
                offset: 1,
            });
            this.props.handleChange(updatedDate,false);
        }
    };

    render() {
        const {calDate, nextDisabled, lastDisabled} = this.state;
        return (
            /* <div className="ms-Grid-row CalendarControls"> */
            <div style={{overflow: "auto", width:"100%", padding:"30px 0 10px 0"}}>
                <div className={"CalControl"} style={{width:"52%", float:"left"}}>
                    <div style={{fontSize: "12pt", fontWeight: "bold", float: "left", width:"20%", textAlign:"left"}}>
                        Calendar
                    </div>
                    <div className={"CalMainControl"} style={{float: "right",width: "50%"}}>                    
                        <div className="dateControls" style={{width: "50%", float:"left"}}>                    
                            <FLatDatePickr
                                showNonFormLabel={false}
                                labelHead="Start Date"
                                isPast= {true}
                                updateFunc={this.handleDateSelect}
                                dateInput={calDate}                                
                            />
                        </div>
                        <div className="navControl" style={{width:"43%", float:"right"}}>
                            <Link
                                title="Get Last 7 Days Activities"
                                onClick={this.handleOffsetAddition}
                                id={'last'}
                                disabled={lastDisabled}                                
                            >
                                Last 7 Days
                            </Link>
                            <span style={{padding:"0 5px 0 5px"}}>|</span>
                            <Link
                                title="Get Last 7 Days Activities"
                                onClick={this.handleOffsetAddition}
                                id={'next'}
                                disabled={nextDisabled}
                            >
                                {' '}
                                Next 7 Days
                            </Link>
                        </div>
                    </div>                    
                </div>
                <div className="CalendarLedger" style={{width:"47%", float:"right", padding:"0px 0 10px 0"}}>
                    <div className="ledgerIconDiv">
                        <Icon
                            iconName="SquareShapeSolid"
                            className="calendar_icon calendar_icon_white"
                        />
                        <label className="ms-Label"> No Bookings</label>
                    </div>
                    <div className="ledgerIconDiv">
                        <Icon
                            iconName="SquareShapeSolid"
                            className="calendar_icon calendar_icon_green"
                        />
                        <label className="ms-Label"> Partially Booked</label>
                    </div>
                    <div className="ledgerIconDiv">
                        <Icon
                            iconName="SquareShapeSolid"
                            className="calendar_icon calendar_icon_grey"
                        />
                        <label className="ms-Label"> Fully Booked</label>
                    </div>
                    <div className="ledgerIconDiv">
                        <Icon
                            iconName="SquareShapeSolid"
                            className="calendar_icon calendar_icon_red"
                        />
                        <label className="ms-Label"> Overbooked</label>
                    </div>
                    <div className="ledgerIconDiv">
                        <Icon
                            iconName="Contact"
                            style={{fontWeight: "bold"}}
                            //className="calendar_icon calendar_icon_yellow"
                        />
                        <label className="ms-Label"> My Activities</label>
                    </div>
                </div>
            </div>
        );
    }
}