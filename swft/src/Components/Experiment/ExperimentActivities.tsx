import React, { ChangeEvent } from 'react';
import { IExperimentActivitiesProps } from "./IExperimentActivitiesProps";
import { IExperimentActivitiesState } from "./IExperimentActivitiesState";
import * as axios from 'axios';
import {DetailsList, ConstrainMode, CheckboxVisibility, IColumn, IGroup, IDetailsRowStyles, DetailsRow,
     Selection, SelectionMode, IDetailsGroupRenderProps,IGroupDividerProps, IDetailsListProps} 
from 'office-ui-fabric-react/lib/DetailsList';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { FontIcon, ImageIcon } from 'office-ui-fabric-react/lib/Icon';
import _ from 'lodash';
import moment from 'moment';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { UserInfoContext } from '../../Main';

const iconClass = mergeStyles({
  fontSize: 30,
  height: 50,
  width: 50,
  margin: '0 25px',
});


export class ExperimentActivities extends React.Component<IExperimentActivitiesProps,IExperimentActivitiesState>  {
    private _selection: Selection;
    constructor(props: IExperimentActivitiesProps){
        super(props);       

        this._selection = new Selection({
            onSelectionChanged: () => this._onItemSelectionChange()
        });          

        ExperimentActivities.contextType = UserInfoContext;
        this.state={};
    }
    render = () =>{
        return <div></div>;
    }
    _onItemSelectionChange = () => {
        let selIndices = this._selection.getSelectedIndices();        
    }
}
