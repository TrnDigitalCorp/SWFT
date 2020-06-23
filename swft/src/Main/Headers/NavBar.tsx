import * as React from 'react';
import {
    Pivot,
    PivotItem,
    PivotLinkFormat,
    IPivotStyles
} from 'office-ui-fabric-react/lib/Pivot';
import './NavBar.css';
import {Redirect, RouteComponentProps} from 'react-router-dom';
import { INavBarState, INavBarProps } from './INavBar';

const pivotStyle:Partial<IPivotStyles> = {
    root: {textAlign: 'center'},
};

export default class NavBar extends React.Component<RouteComponentProps & INavBarProps,INavBarState> {
    constructor(props:RouteComponentProps &INavBarProps) {
        super(props);
        this.state = {
            selectedKey: '0',
            isNavigate:false
        };
    }
    componentDidMount() {
        const {selectedKey}: any = this.props;
        this.setState({
            selectedKey
        });
    }
    componentDidUpdate(prevProps:INavBarProps, prevState:INavBarState) {
        const {selectedKey}: any = this.props;
        if(this.state.selectedKey !==selectedKey){
            this.setState({
                selectedKey,
                isNavigate:false
            });
        }
    }
    handlePivotClick = (item:PivotItem|undefined):void=>{
        this.setState({
            selectedKey: item?.props.itemKey,
            isNavigate:true
        });
        this.props.handleRedirection(item?.props.itemKey);
    }
    render() {
        const {selectedKey,isNavigate} = this.state;
        return (
            <div className="NavbarMain">
                <Pivot
                    aria-label="Main Naigation"
                    linkFormat={PivotLinkFormat.links}
                    styles={pivotStyle}
                    selectedKey={selectedKey||'0'}
                    onLinkClick={this.handlePivotClick}>
                    <PivotItem
                        headerText="Home"
                        headerButtonProps={{
                            'data-order': 1,
                            'data-title': 'Home',
                        }}
                        itemKey="0"
                    >
                         {isNavigate?<Redirect to={'/Home'} />:''}
                    </PivotItem>
                    <PivotItem headerText="Plan Experiment" itemKey="1">
                        {isNavigate?<Redirect to={'/PlanExperiment'} />:''}
                    </PivotItem>
                    <PivotItem headerText="Plan Lab Activity" itemKey="2">
                        {isNavigate?<Redirect to={'/PlanActivity'} />:'' }
                    </PivotItem>
                    <PivotItem headerText="Plan Office Usage" itemKey="3">
                        {isNavigate?<Redirect to={'/PlanOfficeSpace'} />:'' }
                    </PivotItem>
                    <PivotItem headerText="Calendar" itemKey="4">
                        {isNavigate?<Redirect to={'/Calendar'} />:'' }
                    </PivotItem>
                    <PivotItem headerText="My Activities" itemKey="5">
                        {isNavigate?<Redirect to={'/MyActivities'} />:'' }
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}

 
