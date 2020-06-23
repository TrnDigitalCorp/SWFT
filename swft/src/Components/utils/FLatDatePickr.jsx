import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import './FlatDatePickr.css';
import {IconButton} from 'office-ui-fabric-react';
import {Label} from 'office-ui-fabric-react/lib/Label';
const uuidv4 = require('uuid/v4');

class FLatDatePickr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            viewForm:false,
            isPast:false,
            key:uuidv4()
        };
    }

    componentDidMount() {
        const {dateInput,viewForm,isPast} = this.props;
        if (dateInput) {
            this.setState({
                date: dateInput,
                viewForm:viewForm,
                isPast:isPast
            });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const {dateInput,viewForm,isPast} = this.props;
        if (prevProps.dateInput !== dateInput) {
            this.setState({
                date: dateInput,
                viewForm
            });
        }
        if (prevProps.viewForm !== viewForm) {
            this.setState({
                date: dateInput,
                viewForm,
                key:uuidv4()
            });
        }
        if (prevProps.isPast !== isPast) {
            this.setState({
                date: dateInput,
                viewForm,
                isPast,
                key:uuidv4()
            });
        }
    }

    handleDateSelect = dateTime => {
        console.log(dateTime);
        if (dateTime.length) {
            this.setState({
                date: dateTime,
            });
            this.props.updateFunc(dateTime[0]);
        } else {
            var today = new Date();
            this.setState({
                date: today,
            });
            this.props.updateFunc(today);
        }
    };
    render() {
        const {date, viewForm,isPast} = this.state;
        const {labelHead, showNonFormLabel, required} = this.props;
        const btnIcon = {iconName: 'Clear'};  
        var dateOptions = {
            wrap: true,
            enableTime: false,
            minDate: 'today',
            dateFormat: 'm/d/Y'
        };     
        var dateOptionwithoutMindate = {
            wrap: true,
            enableTime: false,
            dateFormat: 'm/d/Y'
        };  
        var currOptions = (isPast || viewForm)?dateOptionwithoutMindate:dateOptions;
        return (
            <div className={'flatPickerDiv'}>
                {!showNonFormLabel && labelHead && (
                    <Label className={required && 'requiredLabel'}>
                        {labelHead}
                    </Label>
                )}
                {showNonFormLabel && labelHead && (
                    <label className={required && 'requiredLabel'}>
                        {labelHead}
                    </label>
                )}
                <Flatpickr
                    key={uuidv4()}
                    value={date}
                    options={currOptions}
                    className={viewForm?'flatPickerClass viewFormDisabled':'flatPickerClass'}
                    onClose={this.handleDateSelect}
                >
                    <input
                        disabled={viewForm}
                        type="text"
                        data-input
                        placeholder="Select Date.."
                        title={labelHead}
                    />
                    {viewForm?'':(
                        <IconButton
                            iconProps={btnIcon}
                            data-clear
                            disabled={viewForm}
                            title="Clear"
                            ariaLabel="clear"
                            onClick={this.handleDateSelect}
                        />
                    )}
                </Flatpickr>
            </div>
        );
    }
}

FLatDatePickr.propTypes = {
    labelHead: PropTypes.string.isRequired,
    updateFunc: PropTypes.func.isRequired,
    dateInput: PropTypes.any,
    required: PropTypes.bool,
    isPast:PropTypes.bool,
    viewForm:PropTypes.bool,
    showNonFormLabel: PropTypes.bool,
};

export default FLatDatePickr;
