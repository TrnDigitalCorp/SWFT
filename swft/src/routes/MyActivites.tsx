import * as React from 'react';
import { ActivityGrid } from '../Components/ActivityGrid/ActivityGrid';
import { RouteComponentProps } from 'react-router-dom';

export interface IMyActivitesProps {
    handleRedirection:(selectedKey:any)=>void;
}

export class MyActivites extends React.Component<RouteComponentProps & IMyActivitesProps, {}> {
  constructor(props: any) {
    super(props);
    this.state = {
    }
    this.props.handleRedirection('5');
  }

  public render() {
    return (
      <ActivityGrid/>
    );
  }
}
