import * as React from 'react';
import CreateActivityForm from '../Components/Activity/CreateActivityForm';
import queryString from 'query-string';
import { RouteComponentProps } from 'react-router-dom';
import AppConfig from '../Constans';
import EditActivityForm from '../Components/Activity/EditActivityForm';

interface IPlanActivityState{
    isViewForm:boolean;
    isNewForm:boolean;
    itemId:string;
}
interface IPlanActivityProps{
    handleRedirection:(selectedKey:any)=>void;
}
export class PlanActivity extends React.Component<RouteComponentProps & IPlanActivityProps,IPlanActivityState> {
    constructor(props:RouteComponentProps & IPlanActivityProps) {
        super(props);
        this.state ={
            isViewForm:false,
            isNewForm:true,
            itemId:'0'
        };
        this.props.handleRedirection('2');
    }    
    componentDidMount() {
        var qString:string = this.props.location?this.props.location.search:'';
        const values = queryString.parse(qString);
        if(values){
            var keyIdValue:string = '0';   
            var keyViewFlagValue:boolean = false;   
            for (const key in values) {
                if(key.toUpperCase() === AppConfig.ActivityForm.IdParam.toUpperCase()){
                    keyIdValue = values[key] as string;
                }  
                if(key.toUpperCase() === AppConfig.ActivityForm.ViewParam.toUpperCase()){
                    var keyVal = values[key]as string;
                    keyViewFlagValue = parseInt(keyVal)==1?true:false;
                }  
            }
            if(keyIdValue!=='0'){
                this.setState({
                    isNewForm:false,
                    isViewForm:keyViewFlagValue,
                    itemId:keyIdValue
                });  
            }                    
        }

    }
    render() {
        const {isNewForm,itemId,isViewForm} = this.state;
        return (
            <div style={{width:"90%", margin: "0.5em auto"}}>                
               {isNewForm?<CreateActivityForm  />:
               <><EditActivityForm Id={parseInt(itemId)} viewForm={isViewForm}/></>}
            </div>
        );
    }
}
