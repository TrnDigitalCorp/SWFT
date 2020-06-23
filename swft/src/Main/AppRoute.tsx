import * as React from 'react';
import {Router, Route, Switch, RouteComponentProps} from 'react-router-dom';
import * as _ from 'lodash';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import {Home} from '../routes';
import { PathNames } from './PathNames';
import { IAccountInfo } from './IMainApp';
import AppConfig from '../Constans';
import { MainHeader } from './Headers';
import PageNotFound from '../routes/PageNotFound';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const PlanActivity = React.lazy(() => import('../routes')
    .then(({ PlanActivity }) => {return ({ default: PlanActivity });}));
const CalendarMain = React.lazy(() => import('../Components/Calendar/CalendarMain'));
const MyActivites = React.lazy(() => import('../routes')
    .then(({ MyActivites }) => {return ({ default: MyActivites });}));
const PlanOfficeSpace = React.lazy(() => import('../routes')
    .then(({ PlanOfficeSpace }) => {return ({ default: PlanOfficeSpace });}));
const PlanExperiment = React.lazy(() => import('../routes')
    .then(({ PlanExperiment }) => {return ({ default: PlanExperiment });}));

interface IAppRouteState{
    selectedKey: string;
}
interface IAppRouteProps{
    selectedKey: string;
    accountInfo:IAccountInfo;
}
export default class AppRoute extends React.Component<RouteComponentProps & IAppRouteProps,IAppRouteState>{
    constructor(props:RouteComponentProps &IAppRouteProps) {
        super(props);
        this.state={
            selectedKey: '0'
        };
    }
    componentDidMount(){
        var pathName = window.location.pathname;
        let selectedKey:string = this.getSelectedKeyFromConfig(pathName);
        this.setState({
            selectedKey
        });
    }
    getSelectedKeyFromConfig = (pathName:string):string =>{
        let selectedKey:string = '0';
        let filteredPathNames:any= _.filter(PathNames, {PathName:pathName});
        if(filteredPathNames.length>0){
            selectedKey = filteredPathNames[0].PathKey;
        }
        return selectedKey;
    }
    componentDidUpdate(prevProps:IAppRouteProps, prevState:IAppRouteState) {
        const {selectedKey} = this.props;
        if(prevProps.selectedKey!== selectedKey){
            this.setState({
                selectedKey
            });
        }
    }    
    handleClick = (selectedKey:any)=>{
        this.setState({
            selectedKey
        });
    }
    render(){    
        const {selectedKey}:any = this.state;
        const {accountInfo}:any = this.props;
        return(
            <Router history={history}>
                <MainHeader
                        {...this.props}
                        iconName={AppConfig.Icons.appIconName}
                        appImageURL={AppConfig.Images.AppHeaderImage}
                        appLogoText={AppConfig.Headings.AppLogoText}
                        userDetail={accountInfo.account}
                        selectedKey={selectedKey}
                        handleRedirection={this.handleClick}
                    />
                <React.Suspense
                    fallback={
                        <div className="centeredContainer">
                            <Spinner size={SpinnerSize.large} />
                        </div>
                    }>
                    <Switch>
                        <Route exact path="/"  render={(props) =>  {return (<Home handleRedirection={this.handleClick}/>)}} />
                        <Route path="/Home" render={(props) =>  {return (<Home handleRedirection={this.handleClick}/>)}}  />
                        <Route path="/PlanActivity" render={(props) =>  {return (<PlanActivity {...props} handleRedirection={this.handleClick}/>)}}  />
                        <Route path="/PlanExperiment" render={(props) =>  {return (<PlanExperiment {...props} handleRedirection={this.handleClick}/>)}}  />
                        <Route path="/PlanOfficeSpace" render={(props) =>  {return (<PlanOfficeSpace {...props} handleRedirection={this.handleClick}/>)}}  />
                        <Route path="/Calendar" render={(props) =>  {return (<CalendarMain {...props} handleRedirection={this.handleClick}/>)}} />
                        <Route path="/MyActivities" render={(props) =>  {return (<MyActivites {...props} handleRedirection={this.handleClick}/>)}} />
                        <Route component={PageNotFound} />
                    </Switch>
                </React.Suspense>
            </Router>
        ); 
    }    
};


