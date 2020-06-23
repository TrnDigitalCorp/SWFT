import * as React from 'react';
import PropTypes from 'prop-types';
import {TextField, ITextFieldStyles,ITextFieldStyleProps} from 'office-ui-fabric-react/lib/TextField';
import {Label} from 'office-ui-fabric-react/lib/Label';
import {Toggle,IToggleStyles,IToggleStyleProps} from 'office-ui-fabric-react/lib/Toggle';
import BookedForEmail from '../Common/BookedForEmail';
import { INamePersonVisitorProps, INamePersonVisitorState } from './interfaces/INamePersonVisitor';
import { IUserPersonaField, IActivity, IActivityErrors } from './interfaces/IActivityForm';

const txtFieldClass:Partial<ITextFieldStyleProps> & Partial<ITextFieldStyles> = {
    wrapper: {
        width: '100%',
        display: 'block',
        selectors:{
            'disabled':{
                color:'black'
            }
        }
    },
    root: {
        width: '100%',
    },
    subComponentStyles:{
        label:{
            color:'black!important'
        }
    }
};
const toggleFieldClass: Partial<IToggleStyles> = {
    container: {
        marginTop: '4px',
    }
};
export default class NamePersonVisitor extends React.Component<INamePersonVisitorProps,INamePersonVisitorState> {
    constructor(props:INamePersonVisitorProps) {
        super(props);
        this.state = {
            activityName:'',
            showVisitorField:false,
            errorMsgs:{},
            visitorEmail:'',
            selectedFor:[]
        };
    }
    componentDidMount() {
        const {activityName,showVisitorField,errorMsgs,visitorEmail,selectedFor} = this.props;
        this.setState({
            activityName,
            showVisitorField,
            visitorEmail,
            errorMsgs,
            selectedFor
        });
    }
    componentDidUpdate(prevProps:INamePersonVisitorProps, prevState:INamePersonVisitorState) {
        const {errorMsgs} = this.props;  
        if(errorMsgs.activityName !== prevProps.errorMsgs.activityName){
            this.setState({
                errorMsgs
            });
        }
        if(errorMsgs.visitorEmail !== prevProps.errorMsgs.visitorEmail){
            this.setState({
                errorMsgs
            });
        }
        if(errorMsgs.bookedForEmail !== prevProps.errorMsgs.bookedForEmail){
            this.setState({
                errorMsgs
            });
        }
        if(errorMsgs.bookedForEmail !== prevProps.errorMsgs.bookedForEmail){
            this.setState({
                errorMsgs
            });
        }
    }
  
    handleToggleChange= (ev:any) =>{
        let val:string = ev.target.value;
        let eventObj:any = {
            target:{
                value:val,
                name:'showVisitorField'
            }
        }
        const {showVisitorField}:any = this.state;
        eventObj.target.value = !showVisitorField;
        this.setState({
            visitorEmail:'',
            showVisitorField:!showVisitorField
        });
        this.props.handleOnChange(eventObj);
    }
    handleOnChange = (ev:any) => {
        let val:string = ev.target.value,
        fieldName:string = ev.target.name;
        let eventObj:any = {
            target:{
                value:val,
                name:fieldName
            }
        }
        switch (fieldName) {
            case "activityName":
                this.setState({
                    activityName:val
                });
                break;
            case "visitorEmail":
                this.setState({
                    visitorEmail:val
                });                
                break;       
            default:
                break;
        };
        this.props.handleOnChange(eventObj);
    }
    updateBookedForEmail = (items:IUserPersonaField[], property:string) => {
        let eventObj = {
            target:{
                value:items,
                name:property,
                selectedFor:items
            }
        }
        this.setState({
            selectedFor: items 
        });
        this.props.handleOnChange(eventObj);
    }
    renderErrorMsgForField(msg:string,key:any){
        return(
             <div role="alert" key={key}>
                <p className="ms-TextField-errorMessage alertMsg">
                    <span data-automation-id="error-message">{msg}</span>
                </p>
            </div>
        );
    }
    render() {
        const {activityName,showVisitorField,errorMsgs,visitorEmail,selectedFor} = this.state;
        const {viewForm} = this.props;
        return (
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm5">
                    <TextField
                        label="Activity Name"
                        required
                        disabled={viewForm}
                        name="activityName"
                        placeholder="Activity Name"
                        value={activityName}
                        errorMessage={errorMsgs.activityName}
                        onChange={this.handleOnChange}
                        styles={txtFieldClass}
                    />  
                </div>
                <div className="ms-Grid-col ms-sm7">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm2">
                            <Toggle
                                disabled={viewForm}
                                label="Visitor?"
                                onText="Yes"
                                offText="No"
                                checked={showVisitorField}
                                styles={toggleFieldClass}
                                onChange={this.handleToggleChange}
                            />
                        </div>
                        <div className="ms-Grid-col ms-sm10">
                            {showVisitorField ? (
                                <>
                                    <TextField
                                        disabled={viewForm}
                                        label="Visitor Email"
                                        required
                                        name="visitorEmail"
                                        placeholder="Visitor Email"
                                        value={visitorEmail}
                                        errorMessage={errorMsgs.visitorEmail}
                                        onChange={this.handleOnChange}
                                        styles={txtFieldClass}
                                    />
                                </>
                            ) : (
                                <>
                                    <Label className={'requiredLabel'}>
                                        Person Name
                                    </Label>
                                    <div style={{backgroundColor: "#fff"}}>
                                        <BookedForEmail
                                            viewForm={viewForm}
                                            required={true}
                                            description={'Toggle Vistor field to if personis a visitor'}
                                            placeholderTxt={'Person Name'}
                                            property={'bookedForEmail'}
                                            updatePeoplePickerChange={this.updateBookedForEmail}
                                            people={selectedFor}
                                        />
                                    </div>
                                    {errorMsgs.bookedForEmail?this.renderErrorMsgForField(errorMsgs.bookedForEmail,'bookedForEmailError'):''}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}