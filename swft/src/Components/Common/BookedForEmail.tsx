import * as React from 'react';
import PeoplePicker from '../utils/CustomPeoplePicker';
import {
    convertWrapperToUserObj,
    convertUserObjToWrapper,
} from '../utils/People/FormatPeoplePicker';
import { IBookedForEmailProps, IBookedForEmailState } from './IBookedForEmail';
import { IUserPersonaField } from '../Activity/interfaces/IActivityForm';
const uuidv4 = require('uuid/v4');

export default class BookedForEmail extends React.Component<IBookedForEmailProps,IBookedForEmailState> {
    constructor(props:IBookedForEmailProps) {
        super(props);
        this.state = {
            selectedPeople: [],
            pickrKey: uuidv4(),
        };
    }
    componentDidMount() {
        const {people} = this.props;
        let selectedPeople = [];
        selectedPeople = convertUserObjToWrapper(people);
        this.setState({
            selectedPeople: selectedPeople,
            pickrKey: uuidv4(),
        });
    }
    componentDidUpdate(prevProps:IBookedForEmailProps, preState:IBookedForEmailState) {
        const {people} = this.props;
        let selectedPeople = [];
        selectedPeople = convertUserObjToWrapper(people);
        if (prevProps.people.length !== people.length) {
            this.setState({
                selectedPeople: selectedPeople,
                pickrKey: uuidv4(),
            });
        }
    }

    updateSelection = (items:IUserPersonaField []) => {
        this.setState({
            selectedPeople: items,
        });
        this.handleAddClick(items);
    };
    handleAddClick = (items:IUserPersonaField[]) => {
        let selectedUsers = [];
        selectedUsers = convertWrapperToUserObj(items);
        this.props.updatePeoplePickerChange(selectedUsers, this.props.property);
    };
    render() {
        const {selectedPeople, pickrKey} = this.state;
        const {viewForm,description} = this.props;
        return (
            <div style={viewForm?{border: '1px solid'}:{}}>
                <PeoplePicker
                    disabled={viewForm}
                    required={true}
                    description= {description}
                    placeholderTxt={this.props.placeholderTxt}
                    key={pickrKey}
                    updateSelection={this.updateSelection}
                    selectedPeople={selectedPeople}
                />
            </div>
        );
    }
}