import * as React from 'react';
import * as _ from 'lodash';
import '../CSS/MainApp.css';
import {AppFooter} from './Headers';
import { IMainAppProps, IMainApprState, ISystemAdmin } from './IMainApp';
import  AppRoute  from '../Main/AppRoute';
import CacheManager from '../services/CachecManager';
import {getAuthenticatedClient} from '../services/graph-service';
import SystemAdminService from '../services/systemadmin-service';
import { RouteComponentProps } from 'react-router-dom';

export const UserInfoContext = React.createContext({name:'',userName:'',isAdmin:false});
export class MainApp extends React.Component<RouteComponentProps & IMainAppProps,IMainApprState>  {
    constructor(props:RouteComponentProps & IMainAppProps) {
        super(props);
        this.state = {
            selectedKey:'0',
            systemAdmins:[],
            isLoaded: false,
        };
    }    
    getAccessToken = async () => {
        await getAuthenticatedClient();
    }
    componentDidMount() {
        const {accountInfo} = this.props; 
        CacheManager.createCacheItem('accountInfo',
        JSON.stringify(accountInfo),1);       
        this.getAccessToken();
        this.getSytstemAdminData().then((systemAdmins:ISystemAdmin[]) => {
            // console.log(systemAdmins);
            if (systemAdmins.length > 0) {
                let isUserArr:any = _.filter(systemAdmins,(sysAdmin) =>{
                    return sysAdmin.SystemAdminEmailId.toUpperCase() === accountInfo.account.userName.toUpperCase()
                });
               let isUserAdmin:boolean = false;
               isUserAdmin = isUserArr?.length>0?true:false;
               accountInfo.account.isAdmin = isUserAdmin;
                this.setState({
                    isLoaded:true,
                    systemAdmins:systemAdmins
                });
            } 
            else {
                console.log("No System admins");
            }           
        })
        .catch(error => {
            this.setState({
                isLoaded:true,                
            });
            console.log("System Admins not found",error);
        });
      
    } 
    getSytstemAdminData = () :Promise<ISystemAdmin[]>=> {
        return new Promise((resolve, reject) => {
            SystemAdminService.getSystemAdmin()
                .then(systemAdmins => resolve(systemAdmins))
                .catch(error => {
                    reject(error);
                });
        });
    }   
    render() {
        const {accountInfo} = this.props;
        const {selectedKey} = this.state;
        return (
            <div className="App">
                <div className="HeaderSection">
                </div>
                <div className="AppBody">
                    <UserInfoContext.Provider value={accountInfo.account}>
                        <AppRoute  {...this.props} selectedKey={selectedKey}  accountInfo={accountInfo}/>
                    </UserInfoContext.Provider>
                </div>
                <AppFooter />
            </div>
        );
    }
}

