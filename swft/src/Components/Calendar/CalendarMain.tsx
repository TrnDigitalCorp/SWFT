import * as React from 'react';
import PropTypes from 'prop-types';
import Calendar from './LabCalendar';
import PageTiles from '../Common/PageTiles';
import './Calendar.css';
import { RouteComponentProps } from 'react-router-dom';
// import {CalendarLinks} from './CalendarService.js';
interface ICalendarMainProps{
    handleRedirection:(selectedKey:any)=>void;
}
export default class CalendarMain extends React.Component<RouteComponentProps & ICalendarMainProps,{}> {
    constructor(props:any) {
        super(props);        
        this.props.handleRedirection('4');
    }
    componentDidMount() {}
    render() {
        return (
            <div className="ms-Grid CalendarMain" dir="ltr">               
                <Calendar />                    
                <div className={'ms-Grid-row ActivityCard'}></div>
            </div>
        );
    }
}