import *as React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'office-ui-fabric-react';
import { ICalendarCoinProps, ICalendarCoinState } from './intefaces/ICalendarCoin';
import { IShiftData, ICalendarData } from './intefaces/ICalendar';

export default class CalendarCoin extends React.Component<ICalendarCoinProps,ICalendarCoinState> {
    constructor(props:ICalendarCoinProps) {
        super(props);
        this.state = {
            shiftData: [],            
            locationCapacity:0,
            locationId:0,
            date:''
        };
    }    
    componentDidMount() {
        const {shiftData, date, locationCapacity,locationId} = this.props;
        this.setState({
            locationId,
            locationCapacity,
            shiftData,
            date
        });
    }
    componentDidUpdate(prevProps: ICalendarCoinProps, prevState:ICalendarCoinState) {
        const {shiftData, locationId, date, locationCapacity} = this.state;
        if (prevProps.shiftData.length !== shiftData.length){
            this.setState({
                shiftData: this.props.shiftData,
                locationId:this.props.locationId,
                locationCapacity:this.props.locationCapacity,
                date:this.props.date,
            });
        }
        if (prevProps.locationId !== locationId){
            this.setState({
                shiftData: this.props.shiftData,
                locationId:this.props.locationId,
                locationCapacity:this.props.locationCapacity,
                date:this.props.date
            });
        }
        if (prevProps.locationCapacity !== locationCapacity){
            this.setState({
                shiftData: this.props.shiftData,
                locationId:this.props.locationId,
                locationCapacity:this.props.locationCapacity,
                date:this.props.date
            });
        }
        if (prevProps.date !== date){
            this.setState({
                shiftData: this.props.shiftData,
                locationId:this.props.locationId,
                locationCapacity:this.props.locationCapacity,
                date:this.props.date
            });
        }
    }
    renderCoin = (shiftObj:IShiftData, shiftColor:string,isStar:boolean,location:ICalendarData) => {
        const {locationId,date}= this.state;
        switch (shiftColor) {
            case 'White':
                return (
                    <Icon
                        iconName={!isStar?"SquareShapeSolid":"Contact"}
                        className={!isStar? "calendar_icon calendar_icon_white":"calendar_icon_white starIconClass"}
                        onClick={(ev) =>this.props.handleIconClick(ev,date,location,shiftObj)}
                    />
                );
            case 'Green':
                return (
                    <Icon
                        iconName={!isStar?"SquareShapeSolid":"Contact"}                        
                        className={!isStar? "calendar_icon calendar_icon_green":"calendar_icon_green starIconClass"}
                        onClick={(ev) =>this.props.handleIconClick(ev,date,location,shiftObj)}
                    />
                );
            case 'Grey':
                return (
                    <Icon
                        iconName={!isStar?"SquareShapeSolid":"Contact"}
                        className={!isStar? "calendar_icon calendar_icon_grey":"calendar_icon_grey starIconClass"}
                        onClick={(ev) =>this.props.handleIconClick(ev,date,location,shiftObj)}
                    />
                );
            case 'Red':
                return (
                    <Icon
                        iconName={!isStar?"SquareShapeSolid":"Contact"}
                        className={!isStar? "calendar_icon calendar_icon_red":"calendar_icon_red starIconClass"}
                        onClick={(ev) =>this.props.handleIconClick(ev,date,location,shiftObj)}
                    />
                );
            default:
                break;
        }
    }
    render() {
        const {shiftData, locationCapacity} = this.state;
        const {location} = this.props;
        return (
        <div className={'ms-Grid-row CalendarCoinClass'}>
            {shiftData.length>0
                ? shiftData.map((shiftObj, key) => {
                    return (
                        <div key={key + 'coin'}
                            className={'ms-Grid-col ms-sm3 calendatCoinDiv'}
                            title={shiftObj.ActivityNumber +'/' +locationCapacity}>
                            {this.renderCoin(shiftObj,shiftObj.ShiftColor,shiftObj.isStar,location)}
                        </div>
                    );
                })
            : ''}
        </div>
        );
    }
}