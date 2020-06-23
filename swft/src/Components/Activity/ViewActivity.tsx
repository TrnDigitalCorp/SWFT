import * as React from 'react';
import FormWrapper from '../FormWrapper';

export interface IViewActivityProps {
  office?:boolean;
}

export interface IViewActivityState {
}

export default class ViewActivity extends React.Component<IViewActivityProps, IViewActivityState> {
  constructor(props: IViewActivityProps) {
    super(props);
    this.state = {

    }
  }

  render() {
    const {office} =this.props;
    const formHeading = office? 'Office Space Usage' : 'Activity';
    return (
      <FormWrapper FormHeading={"Add an "+ formHeading}>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            
          </div>
        </div>
        </FormWrapper>
    );
  }
}
