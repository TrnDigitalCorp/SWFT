import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PeoplePicker from '../PeoplePicker';
import {DefaultButton} from 'office-ui-fabric-react';
import './PeoplePickerWithButton.css';
import {
    convertWrapperToUserObj,
    convertUserObjToWrapper,
} from './FormatPeoplePicker';
const uuidv4 = require('uuid/v4');

class PeoplePickerWithButton extends Component {
    constructor(props) {
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
    componentDidUpdate(prevProps, prevState) {
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

    updateSelection = items => {
        this.setState({
            selectedPeople: items,
        });
    };
    handleAddClick = () => {
        const {selectedPeople} = this.state;
        let selectedUsers = [];
        selectedUsers = convertWrapperToUserObj(selectedPeople);
        this.props.updateFilteredOwners(selectedUsers, 'People');
    };
    render() {
        const {selectedPeople, pickrKey} = this.state;
        return (
            <div className={'flexEnd peopleSelection'}>
                <PeoplePicker
                    key={pickrKey}
                    updateSelection={this.updateSelection}
                    selectedPeople={selectedPeople}
                />
                {showButton && (
                    <div>
                        <DefaultButton
                            text={'Add'}
                            onClick={this.handleAddClick}
                        />
                    </div>
                )}
            </div>
        );
    }
}

PeoplePickerWithButton.propTypes = {
    updateFilteredOwners: PropTypes.func,
    showButton: PropTypes.bool,
    people: PropTypes.array,
};
export default PeoplePickerWithButton;
