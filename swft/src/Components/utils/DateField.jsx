import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import { DatePicker } from 'office-ui-fabric-react';
import {convrtUtcToTz} from '../Common/utils/FormatInputDate';
import Flatpickr from './FLatDatePickr';
import * as _ from 'lodash';
import AppConfig from '../../Constans';
import CacheManager from '../../services/CachecManager';

class DateField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ScheduledDate: '',
            flatPickrString: '',
        };
    }
    componentDidMount() {
        let {ScheduledDate} = this.props;
        let appConfigTimeZone = AppConfig.UserTimeZone;
        this.setState({
            ScheduledDate: ScheduledDate,
            flatPickrString: this.getFlatPickrDate(
                ScheduledDate,
                appConfigTimeZone,
            ),
        });
    }
    handleDateSelect = date => {
        if (date) {
            this.setState({
                ScheduledDate: date,
                flatPickrString: date,
            });
            this.props.handleDateSelect(date);
        } else {
            this.setState({
                ScheduledDate: null,
                flatPickrString: null,
            });
            this.props.handleDateSelect(null);
        }
    };
    getFlatPickrDate = (date, tz) => {
        let flatpkrDate = '';
        flatpkrDate = convrtUtcToTz(date, tz);
        return flatpkrDate;
    };
    render() {
        return (
            <>
                <div className="form-field" key="divCommSDate">
                    <div className="form-input">
                        <div className={'dateTime'}>
                            <Flatpickr
                                labelHead={this.props.fieldLabel}
                                updateFunc={this.handleDateSelect}
                                dateInput={this.state.flatPickrString}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

DateField.propTypes = {
    handleDateSelect: PropTypes.func.isRequired,
    fieldLabel: PropTypes.string.isRequired,
    ScheduledDate: PropTypes.any,
};

export default DateField;
