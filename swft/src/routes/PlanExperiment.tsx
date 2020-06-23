import * as React from 'react';
import queryString from 'query-string';
import { RouteComponentProps } from 'react-router-dom';
import AppConfig from '../Constans';
import Experiment from "../Components/Experiment/Experiment";
const uuidv4 = require('uuid/v4');

interface IPlanExperimentState{
    isViewForm:boolean;
    isNewForm:boolean;
    itemId:string;
    formKey:any;  
    ParentId:string;
}
interface IPlanExperimentProps{
    handleRedirection:(selectedKey:any)=>void;
}
export class PlanExperiment extends React.Component<RouteComponentProps &IPlanExperimentProps,IPlanExperimentState> {
    constructor(props:RouteComponentProps &IPlanExperimentProps) {
        super(props);
        this.state ={
            isViewForm :false,
            isNewForm:true,
            itemId: "0",
            ParentId: "0",
            formKey:uuidv4()
        };
        this.props.handleRedirection('1');       
    }
    render() {
        const {ParentId,isNewForm,itemId,formKey} = this.state;
        var formMode = isNewForm?"add":"edit";
        return (
            <div>                     
              <Experiment FormMode = {formMode}  ParentId={+ParentId} ExpId = {+itemId} key={formKey}/>
            </div>
        );
    } 
    componentDidUpdate(prevProps:any, prevState:IPlanExperimentState) {
        const values = queryString.parse(this.props.location.search);        
        if(values){
            let _idValue: string = "";
            let _pidValue: string = "";

            for (const key in values) {
                if(key.toUpperCase() === AppConfig.PlanExperiment.IdParam.toUpperCase()){
                    _idValue = values[key] as string;                                        
                }  
                if(key.toUpperCase() === AppConfig.PlanExperiment.ParentIdParam.toUpperCase()){
                    _pidValue = values[key] as string;                                        
                }  
            }       
            if(_idValue !== "" && prevState.itemId !==_idValue){
                this.setState({
                    isNewForm: false,
                    itemId: _idValue,
                    ParentId:_pidValue 
                });
            }          
        }
    }
       
    componentDidMount() {
        const values = queryString.parse(this.props.location.search);        
        if(values){
            let _idValue: string = "";

            for (const key in values) {
                if(key.toUpperCase() === AppConfig.PlanExperiment.IdParam.toUpperCase()){
                    _idValue = values[key] as string;                                        
                }  
            }       
            if(_idValue !== ""){
                this.setState({
                    isNewForm: false,
                    itemId: _idValue,
                    formKey:uuidv4()    
                });
            }          
        }
    }
}
