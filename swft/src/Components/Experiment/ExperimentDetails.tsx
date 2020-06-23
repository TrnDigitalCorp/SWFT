import * as React from 'react';
import {TextField, ITextFieldStyles} from 'office-ui-fabric-react/lib/TextField';
import {PrimaryButton, DefaultButton} from 'office-ui-fabric-react/lib/Button';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import FormWrapper from '../FormWrapper';
import FLatDatePickr from '../utils/FLatDatePickr';
import { RouteComponentProps } from 'react-router-dom';
export interface IExperimentDetailsProps {

}

export interface IExperimentDetailsState {

}

const txtFieldClass:Partial<ITextFieldStyles> = {
  wrapper: {
      width: '100%',
      display: 'block',
  },
  root: {
      width: '100%',
  },
};
const dropdownControlledExampleOptions = [
  { key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
  { key: 'apple', text: 'Apple' },
  { key: 'banana', text: 'Banana' },
  { key: 'orange', text: 'Orange', disabled: true },
  { key: 'grape', text: 'Grape' },
  { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
  { key: 'broccoli', text: 'Broccoli' },
  { key: 'carrot', text: 'Carrot' },
  { key: 'lettuce', text: 'Lettuce' },
];
export default class ExperimentDetails extends React.Component<RouteComponentProps & IExperimentDetailsProps, IExperimentDetailsState> {
  constructor(props:RouteComponentProps & IExperimentDetailsProps) {
    super(props);
    this.state = {

    }
  }
  handleFormSaveClick =() =>{
    this.props.history.goBack();
  }
  public render() {
    return (
      <div>
        <FormWrapper FormHeading={"Experiment Details"}>
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm12">
                    <TextField
                        label="Experiment Name"
                        required
                        name="experimentName"
                        placeholder="Experiment Name"
                        // value={activityName}
                        // errorMessage={errorMsgs.activityName}
                        // onChange={this.handleOnChange}
                        styles={txtFieldClass}
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm4">
                    <Dropdown
                      placeholder="Select a Project/Study"
                      label="Select a Project or Study"
                      options={dropdownControlledExampleOptions}
                      // styles={dropdownStyles}
                    />
                  </div>
                  <div className="ms-Grid-col ms-sm8">
                  <TextField                      
                      label="Experiment Description"
                      name="experimentDescription"
                      placeholder="Experiment Description"
                      // value={
                      //     newActivity.activityDescription
                      // }
                      // errorMessage={
                      //     errorMsgs.activityDescription
                      // }
                      // onChange={this.handleOnChange}
                      // styles={descFieldClass}
                  />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm4">
                    <FLatDatePickr
                      required={true}
                      labelHead="Select a start Date"
                      // updateFunc={this.handleDateSelectChange}
                      dateInput={new Date()}
                    />
                    {/* {errorMsgs.activityDate?this.renderErrorMsgForField(errorMsgs.activityDate,'activityDateError'):''} */}
                  </div>
                  <div className="ms-Grid-col ms-sm8">
                    <PrimaryButton
                          key="Save1"
                          text="Save"
                          data-action={'Save'}
                          onClick={this.handleFormSaveClick}
                      />
                  </div>
                </div>
            </div>
            </FormWrapper>
      </div>
    );
  }
}
