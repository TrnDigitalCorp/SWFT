import * as React from 'react';
import CreateActivityForm from '../Components/Activity/CreateActivityForm';
import queryString from 'query-string';
import { RouteComponentProps } from 'react-router-dom';
import { UserInfoContext } from '../Main';
import AppConfig from '../Constans';
import EditActivityForm from '../Components/Activity/EditActivityForm';

interface IPlanOfficeSpaceState{
    isViewForm:boolean;
    isNewForm:boolean;
    itemId:string;    
}
interface IPlanOfficeSpaceProps{
    handleRedirection:(selectedKey:any)=>void;
}
export class PlanOfficeSpace extends React.Component<RouteComponentProps & IPlanOfficeSpaceProps,IPlanOfficeSpaceState> {
    constructor(props:RouteComponentProps & IPlanOfficeSpaceProps) {
        super(props);
        this.state ={
            isViewForm:false,
            isNewForm:true,
            itemId:'0'
        };
        this.props.handleRedirection('3');        
    }    
    componentDidMount() {
        const values = queryString.parse(this.props.location.search);
        if(values){
            var keyValue:string = '0';
            var keyViewFlagValue:boolean = false;   
            for (const key in values) {
                if(key.toUpperCase() === AppConfig.ActivityForm.IdParam.toUpperCase()){
                    keyValue = values[key] as string;
                }  
                if(key.toUpperCase() === AppConfig.ActivityForm.ViewParam.toUpperCase()){
                    var keyVal = values[key]as string;
                    keyViewFlagValue = parseInt(keyVal)==1?true:false;
                }  
            }
            if(keyValue!=='0'){
                this.setState({
                    isNewForm:false,
                    isViewForm:keyViewFlagValue,
                    itemId:keyValue
                });  
            }                    
        }

    }
    render() {
        const {isNewForm,isViewForm,itemId} = this.state;
        return (
            <div style={{width:"90%", margin: "0.5em auto"}}>                
               {isNewForm?<CreateActivityForm office={true}/>:
               <><EditActivityForm Id={parseInt(itemId)} office={true} viewForm={isViewForm}/></>}
            </div>
        );
    }
}
