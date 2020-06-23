import * as React from 'react';
import {
    MessageBar,
    MessageBarType,
} from 'office-ui-fabric-react/lib/MessageBar';
import {Redirect} from 'react-router-dom';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {PrimaryButton} from 'office-ui-fabric-react/lib/Button';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import * as _ from 'lodash';
import AppConfig from '../../Constans';
import FormWrapper from '../FormWrapper';
import '../Forms.css';
import './ActivityForm.css';
import {
    getUniqueLocationObjs,
    getShiftData,
    getLocationEquipments,
    formatActivityDate,
    validateEmail,
    createActivity,
} from './ActivityService';
import LocationShiftAvailability from './LocationShiftAvailability';
import DateAndShifts from './DateAndShifts';
import NamePersonVisitor from './NamePersonVisitor';
import LocationsAndEquipments from './LocationsAndEquipments';
import { IActivityFormState, IActivityShift, IActivityEquipment, IActivity, IUserPersonaField, IActivityFormProps } from './interfaces/IActivityForm';
import { BlockingSpinner } from '../Common/dialogs/BlockingSpinner';
import { UserInfoContext } from '../../Main';
import ActionScreen from '../Common/ActionScreen';
import ButtonWithDialog from '../Common/dialogs/ButtonWithDialog';
import { ILocationShiftAvailability } from './interfaces/ILocationShiftAvailability';
import { today } from '../Calendar/CalendarService';

const moment =  require('moment');
const uuidv4 = require('uuid/v4');


const descFieldClass = {
    wrappetr: {
        width: '100%',
        display: 'block',
    },
    root: {
        width: '100%',
    },
    field: {
        height: 200,
    },
};
let InitialErrorMsg = {
    activityDate: '',
    selectedShiftIds: '',
    activityName: '',
    activityDescription: '',
    bookedForEmail: '',
    visitorEmail: '',
    selectedLocations: '',
};
export default class ActivityForm extends React.Component<IActivityFormProps,IActivityFormState> {
    constructor(props:any) {
        super(props);
        ActivityForm.contextType = UserInfoContext;
        this.state = {
            newActivity: {
                activityDate: new Date(formatActivityDate()),
                ExperimentId:null,
                DayOffset:0,
                selectedShiftIds: [],
                activityName: '',
                activityDescription: '',
                bookedForEmail: [],
                bookedByEmail: {} as IUserPersonaField,
                visitorEmail: '',
                selectedLocations: [],
                selectedEquipments: [],
                showVisitorField: false,
            },
            errorMsgs: {
                activityDate: '',
                selectedShiftIds: '',
                activityName: '',
                activityDescription: '',
                bookedForEmail: '',
                visitorEmail: '',
                selectedLocations: '',
            },
            ShiftTimmings: [],
            Locations: [],
            selectedFor:[],
            Equipments: [],
            locationEquipKey:uuidv4(),
            isLoaded: false,
            showErrorMsg: false,
            SaveFlag: false,
            isCreated: false,
            hideCancelDialog: true,
            isRedirect: false,
            LSAFullyBooked: false,
            errorMsg: '',
            actionType:"Create",
            formFieldKey:uuidv4(),
            LsaArr:[] as ILocationShiftAvailability[]
        };
    }
    componentDidMount() {
        const promises = [];
        promises.push(getShiftData());
        promises.push(getLocationEquipments());
        Promise.all(promises)
            .then(responses => {
                // console.log(responses);
                if (responses.length > 0) {
                    let shifts = responses[0] ? responses[0] : [];
                    let locationEquipmentData = responses[1]
                        ? responses[1]
                        : [];
                    this.arrangeFormFields(shifts, locationEquipmentData);
                } else {
                    this.setState({
                        isLoaded:true,
                        showErrorMsg: true,
                        errorMsg: AppConfig.ActivityForm.ErrorDataFetchMessage
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isLoaded:true,
                    showErrorMsg: true,
                    errorMsg: AppConfig.ActivityForm.ErrorDataFetchMessage
                });
                console.log(error);
            });
    }
    componentDidUpdate(prevProps:IActivityFormProps, prevState:IActivityFormState) {
        const {ExpData} = this.props;
        const {newActivity} = this.state;
        if(ExpData && prevProps.ExpData){
            if(ExpData.ExpOwnerEmail !== prevProps.ExpData.ExpOwnerEmail){
                newActivity.ExperimentId = ExpData.ExpId;
                newActivity.ExperimentOwner = ExpData.ExpOwnerEmail;
                newActivity.ExperimentStartDate = ExpData.ExpStartDate;
                newActivity.activityDate = this.checkExpDateIsPast(ExpData.ExpStartDate);
                this.setState({
                    newActivity
                });
            }
            let prevExpDate = moment(prevProps.ExpData.ExpStartDate);
            let expDate = moment(ExpData.ExpStartDate);
            let dateDiff = expDate.diff(prevExpDate,'days');
            if(dateDiff !== 0){
                newActivity.ExperimentId = ExpData.ExpId;
                newActivity.ExperimentOwner = ExpData.ExpOwnerEmail;
                newActivity.ExperimentStartDate = ExpData.ExpStartDate;
                newActivity.activityDate = this.checkExpDateIsPast(ExpData.ExpStartDate);
                this.setState({
                    newActivity,
                    formFieldKey:uuidv4()
                });
            }
            if(ExpData.ExperimentNotSaved !== prevProps.ExpData.ExperimentNotSaved){
                newActivity.ExperimentId = ExpData.ExpId;
                newActivity.ExperimentOwner = ExpData.ExpOwnerEmail;
                newActivity.ExperimentStartDate = ExpData.ExpStartDate;
                newActivity.activityDate = this.checkExpDateIsPast(ExpData.ExpStartDate);
                this.setState({
                    newActivity,
                    formFieldKey:uuidv4()
                });
            }
        }
    }
    updateStateLSA = (lsaArr:any) => {
        var raiseError = this.alertLSAFullyBooked(lsaArr);
        this.setState({
            LsaArr:lsaArr,
            showErrorMsg:raiseError,
            errorMsg: AppConfig.ActivityForm.FullyBookedAlertMsg
        });
    }  
    checkExpDateIsPast = (expDate:any) =>{
        var currExpDate = moment(expDate);
        var currDate = moment(today);
        var diffDates = currDate.diff(currExpDate,'days');
        if(expDate && diffDates>0){
            return new Date(formatActivityDate());
        }
        else{
            return expDate;
        }
    }  
    arrangeFormFields = (shifts:IActivityShift[], locationEquipmentData:IActivityEquipment[]) => {
        let currentUserName:string = this.context.name;
        let currentUserEmail:string = this.context.userName;
        var shiftArr:IActivityShift[] = [],
            selectedShiftIds:number[] = [];
        if (!AppConfig.ActivityForm.showTBD) {
            shifts = _.reject(shifts, {
                DisplayName: AppConfig.ActivityForm.TBDRejectDispName,
            });
            shifts.map(element => {
                return (element.isSelected = false);
            });
            shiftArr = shifts;
        } else {
            // remove if tbd is created at index 1
            let tbdShiftArr = _.filter(shifts, {
                DisplayName: AppConfig.ActivityForm.TBDRejectDispName,
            });
            if (tbdShiftArr && tbdShiftArr.length > 0) {
                let tbdShift = tbdShiftArr[0];
                tbdShift.isSelected = false;
                shifts = _.reject(shifts, {
                    DisplayName: AppConfig.ActivityForm.TBDRejectDispName,
                });
                shiftArr.push(tbdShift);
                for (let sndex = 0; sndex < shifts.length; sndex++) {
                    const shiftElm = shifts[sndex];
                    shiftElm.isSelected = false;
                    shiftArr.push(shiftElm);
                }
                // selectedShiftIds = [AppConfig.ActivityForm.TBDRejectShiftId];
            }
        }
      
        let uniqLocationsArr = getUniqueLocationObjs(locationEquipmentData, this.props.office);
        const {newActivity} = this.state;
        const {ExpData} = this.props;
        newActivity.selectedShiftIds = selectedShiftIds;
        newActivity.bookedByEmail.DisplayName = currentUserName;
        newActivity.bookedByEmail.Email= currentUserEmail;
        var obj:IUserPersonaField = {} as IUserPersonaField;
        newActivity.bookedForEmail.push(obj);
        newActivity.bookedForEmail[0].DisplayName = currentUserName;
        newActivity.bookedForEmail[0].UserLogin = currentUserEmail;
        newActivity.bookedForEmail[0].Email = currentUserEmail;
      if(ExpData){
        newActivity.ExperimentId = ExpData.ExpId;
        newActivity.ExperimentOwner = ExpData.ExpOwnerEmail;
        newActivity.activityDate = this.checkExpDateIsPast(ExpData.ExpStartDate);
        newActivity.ExperimentStartDate = ExpData.ExpStartDate;
      }
        this.setState({
            ShiftTimmings: shiftArr,
            newActivity: newActivity,
            Locations: uniqLocationsArr,
            Equipments: locationEquipmentData,
            isLoaded: true,
            selectedFor:[...this.state.selectedFor, newActivity.bookedForEmail[0]],
            locationEquipKey: uuidv4(),
        });
        if(ExpData){
            if(this.props.handleActivityActions){
                this.props.handleActivityActions("Form Loaded", "LoadForm");
            }
        }
    }
    handleFormFieldChange = (updateProp:any, field:string) => {
        const {newActivity,LsaArr} :any = this.state;
        newActivity[field] = updateProp;
        var rasieAlert = this.alertLSAFullyBooked(LsaArr);
        if(rasieAlert && field ==='selectedShiftIds' ){
            this.setState({
                newActivity,
                showErrorMsg: true,
                errorMsg: AppConfig.ActivityForm.FullyBookedAlertMsg
            });
        } 
        else{
            this.setState({
                newActivity,
                showErrorMsg: false,
                errorMsg: ''
            });  
        }
    }
    handleEquipmentSelection = (updateProp:any, field:string) => {
        let newActivity:any= this.state.newActivity;
        newActivity[field] = updateProp;
        this.setState({
            newActivity,
        });
    }
    handleLocationSelection = (locationValues:any, equipValues:string) => {
        const {newActivity,LsaArr} :any = this.state;
        newActivity['selectedLocations'] = locationValues;
        newActivity['selectedEquipments'] = equipValues;
        var rasieAlert = this.alertLSAFullyBooked(LsaArr);
        if(rasieAlert){
            this.setState({
                newActivity,
                showErrorMsg: true,
                errorMsg: AppConfig.ActivityForm.FullyBookedAlertMsg
            });
        } else{
            this.setState({
                newActivity,
                showErrorMsg: false,
                errorMsg: ''
            });  
        }
    }
    handleOnChange = (eventObj:any) => {
        const {newActivity} :any = this.state,
            val = eventObj.target.value;
        if (typeof val === 'string'){
            if(val.trim() === '') {
                newActivity[eventObj.target.name] = '';
            } else {
                newActivity[eventObj.target.name] = val;
            }
        } 
        if(eventObj.target.name === 'visitorEmail'){
            newActivity[eventObj.target.name] = val;
            // newActivity.bookedForEmail = [];
            this.setState({
                newActivity, 
            });
        }
        else if(eventObj.target.name === "bookedForEmail"){
            newActivity[eventObj.target.name] = val;
            this.setState({
                selectedFor:eventObj.target.selectedFor,
                newActivity, 
            });
        }
        else if(eventObj.target.name === "showVisitorField"){
            newActivity[eventObj.target.name] = val;
            // newActivity.bookedForEmail = [];
            newActivity.visitorEmail = '';
            this.setState({
                newActivity, 
            });
        }
        else{
            this.setState({
                newActivity: newActivity,
            });
        }
    }
    validateFields = (newActivity:IActivity) => {
        let fieldsArr = ['activityName','visitorEmail'],
            fieldValueArr:any = newActivity,
            flag = true,
            errorArr = ['Activity Name is required field.','Visitor Email is required field.'];
        const {ExpData} =  this.props;
            if(this.props.office){
                newActivity.selectedEquipments = [];
                newActivity.selectedLocations = [AppConfig.ActivityForm.officeSpaceUsageLocation];
            }
        try {
            for (let i = 0; i < fieldsArr.length; i++) {
                let eachField = fieldsArr[i];
                if(eachField === 'visitorEmail'){
                    if(newActivity.showVisitorField){
                        const emailId = fieldValueArr[eachField]; 
                        if(emailId === ''){
                            this.addValidationError(errorArr[i], fieldsArr[i], flag);
                            flag = false;
                        }
                        else{
                            let checkFlag = validateEmail(emailId);
                            if (!checkFlag) {
                                let errMsg ='Visitor Email field should contain valid email.';
                                this.addValidationError(errMsg, fieldsArr[i], flag);
                                flag = false;
                            }
                        }
                    }
                }
                else {
                    if(fieldValueArr[eachField] === '') {
                        this.addValidationError(errorArr[i], fieldsArr[i], flag);
                        flag = false;
                    }
                }
            }
            if (isNaN(newActivity.activityDate.getTime())) {
                this.addValidationError('Activity Date is required field.', 'activityDate', flag);
                flag = false;
            }
            else{
                if(ExpData){
                    var currActivityDate = moment(newActivity.activityDate),
                    currDate = moment(),
                    expDate = moment(ExpData.ExpStartDate);
                    let diffDates = currDate.diff(currActivityDate,'days');
                    if( diffDates>0){
                        this.addValidationError('Activity Date should be selected from future dates.', 'activityDate', flag);
                        flag = false;
                    }
                    var diffExpDates = expDate.diff(currActivityDate,'days');
                    if(diffExpDates>0){
                        let errMsg:string ="Select Activity Date from future dates and should not be before experiment date.";
                        if(flag){
                            errMsg = 'Activity Date should be selected from future dates.';
                        }
                        this.addValidationError(errMsg, 'activityDate', flag);
                        flag = false;
                    }
                }
            }
            if (newActivity.selectedShiftIds.length<1) {
                this.addValidationError('Activity Shift is required field.', 'selectedShiftIds', flag);
                flag = false;
            }
            if (!newActivity.showVisitorField && newActivity.bookedForEmail.length<1) {
                this.addValidationError('Person Name is required field.', 'bookedForEmail', flag);
                flag = false;
            }
            if (newActivity.selectedLocations.length<1) {
                this.addValidationError('Location is required field.', 'selectedLocations', flag);
                flag = false;
            }
        } catch (error) {
            console.log(error);
            flag = false;
        }
        return flag;
    }
    addValidationError = (message:string, id:string, flushErrors:boolean) => {
        this.setState((previousState:any) => {
            let errorMessageArr:any = {};
            if (!flushErrors) {
                errorMessageArr = {...previousState.errorMsgs};
            }
            errorMessageArr[id] = message;
            return {
                errorMsgs: errorMessageArr,
            };
        });
    }
    alertLSAFullyBooked = (LsaArr:ILocationShiftAvailability[]):boolean =>{
        const {newActivity} = this.state;
        var fullCapLSA:ILocationShiftAvailability[] =  _.filter(LsaArr,{OnAlert:true}), raiseAlert:boolean = false;
        if(fullCapLSA.length>0){
            let filterSelection = _.filter(fullCapLSA,(lsa)=>{
                let shiftSelected = false;
                let locSelected = false;
                if(newActivity.selectedShiftIds.indexOf(lsa.ShiftId) !==-1){
                    shiftSelected = true;
                }
                if(newActivity.selectedLocations.indexOf(lsa.LocationId) !==-1){
                    locSelected = true;
                }                
                return shiftSelected && locSelected;
            });
            if(filterSelection.length>0){
                raiseAlert = true;
            }
        }
        return raiseAlert;
    }
    handleFormSaveClick = (ev:any) => {
        ev.preventDefault();
        const {newActivity,LSAFullyBooked,LsaArr} = this.state;
        if(LSAFullyBooked){
            this.setState({
                LSAFullyBooked:false
            });
        }else{
            var flag = this.validateFields(newActivity);
            if (flag) {
                this.setState({
                    showErrorMsg: false,
                    errorMsg: '',
                    errorMsgs: InitialErrorMsg,
                });
                var alertFlag = this.alertLSAFullyBooked(LsaArr);
                if(alertFlag){
                    this.setState({
                        LSAFullyBooked:true
                    });
                }
                else{
                    this.callForCreate(newActivity,AppConfig.ActivityForm.OfcAndIndiActivityType);
                }
            } else {
                this.setState({
                    showErrorMsg: true,
                    errorMsg: AppConfig.ActivityForm.ErrorValidationMessage,
                });
            }
        }
    }
    handleFormSaveClickAction = () =>{
        const {newActivity} = this.state;
        this.callForCreate(newActivity,AppConfig.ActivityForm.OfcAndIndiActivityType);
    }
    callForCreate = (newActivity:IActivity,activityType:string) =>{
        this.setState({SaveFlag:true, LSAFullyBooked:false});       
        createActivity(newActivity,activityType).then(response => {
            this.setState({SaveFlag:false,isCreated:true,actionType:"Create"});
            if(this.props.ExpData){
                if(this.props.handleActivityActions){
                    this.props.handleActivityActions(newActivity, "CreatedActivity");
                }
            }
        }).catch(error => {
            this.setState({
                SaveFlag:false,
                showErrorMsg: true,
                actionType:"Failed",
                errorMsg:AppConfig.ActivityForm.CreationErrorMessage +error
            });
            console.log(error);
        });

    }
    renderErrorMsg(msg:string){
        return(
            <MessageBar messageBarType={MessageBarType.error} className={"errorMsgInfo"}>
                {msg}
            </MessageBar>
        );
    }
    loadSpinner = (labelTxt:string,isLoading:boolean) => {
        return (
            <div className="centeredContainer">
                <BlockingSpinner label={labelTxt} hideDialog={!isLoading}/>
            </div>
        );
    }
    clearShiftSelection =(): IActivityShift[]=>{
        var shiftArr:IActivityShift[] = [] as IActivityShift[];
        const {ShiftTimmings} = this.state;
        for (let shiftIndex = 0; shiftIndex < ShiftTimmings.length; shiftIndex++) {
            const shiftRec = ShiftTimmings[shiftIndex];
            shiftRec.isSelected = false;
            shiftArr.push(shiftRec);
        }
        return shiftArr;
    }
    handleCancelClick = () =>{
        const {hideCancelDialog} = this.state;
        this.setState({
            hideCancelDialog:!hideCancelDialog
        });
    }
    handleCancelAction = () =>{
        this.setState({
            isRedirect:true
        });
    }    
    render() {
        const {
            isLoaded,
            ShiftTimmings,
            newActivity,
            errorMsgs,
            Equipments,
            Locations,
            selectedFor,
            locationEquipKey,
            showErrorMsg,
            errorMsg,
            formFieldKey,
            isCreated,
            actionType,
            SaveFlag,
            hideCancelDialog,
            isRedirect,
            LSAFullyBooked
        } = this.state;
    const {office,NotPopActions,ExpData} =this.props;
    const formHeading = office? 'Office Usage' : 'Lab Activity';
    const dialogMsg = AppConfig.ActivityForm.FullyBookedDialogMsg;
        return (
            <div className="formMain">
                {isLoaded ? (
                <>                   
                    <FormWrapper FormHeading={"Add "+ formHeading}>
                        <div className="ms-Grid" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm8">
                                    <div>
                                    <DateAndShifts key={formFieldKey.toString()}
                                        activityDate={newActivity.activityDate}
                                        selectedShiftIds={
                                            newActivity.selectedShiftIds
                                        }
                                        shiftTimmings={ShiftTimmings}
                                        errorMsgs={errorMsgs}
                                        ExpId={newActivity.ExperimentId}
                                        ExpDate={newActivity.ExperimentStartDate}
                                        handleFormFieldChange={
                                            this.handleFormFieldChange
                                        }
                                    />    
                                    </div>
                                    <NamePersonVisitor key={formFieldKey.toString()}
                                        errorMsgs ={errorMsgs}
                                        activityName={newActivity.activityName}
                                        selectedFor={selectedFor}                                        
                                        showVisitorField ={newActivity.showVisitorField}
                                        visitorEmail={newActivity.visitorEmail}
                                        handleOnChange={this.handleOnChange}
                                    />                               
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-sm5">
                                            <TextField
                                                multiline
                                                label="Activity Description"
                                                name="activityDescription"
                                                placeholder="Activity Description"
                                                value={
                                                    newActivity.activityDescription
                                                }
                                                errorMessage={
                                                    errorMsgs.activityDescription
                                                }
                                                onChange={this.handleOnChange}
                                                styles={descFieldClass}
                                            />
                                        </div>
                                        <div className="ms-Grid-col ms-sm7">
                                        {office?(''):
                                        ( <LocationsAndEquipments key={locationEquipKey}
                                                locationEquipKey={locationEquipKey}
                                                Equipments={Equipments}
                                                Locations={Locations}
                                                errorMsgs={errorMsgs}
                                                selectedLocations={newActivity.selectedLocations}
                                                selectedEquipments={newActivity.selectedEquipments}
                                                handleLocationSelectionChange={this.handleLocationSelection}
                                                handleEquipmentSelectionChange={this.handleEquipmentSelection}
                                            />
                                        )}
                                        </div>
                                    </div>
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-sm8"></div>
                                    </div>
                                </div>
                                <div className="ms-Grid-col ms-sm4">
                                    <div className="ms-Grid-row shiftLocation">
                                        <LocationShiftAvailability
                                            sendLsaArr ={this.updateStateLSA}
                                            Shifts={ShiftTimmings}
                                            office={office}
                                            Locations={Locations}
                                            activityDate={formatActivityDate(
                                                newActivity.activityDate,
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            {showErrorMsg?this.renderErrorMsg(errorMsg):''}
                            <div className={ExpData?.ExperimentNotSaved?"displayNone":"row formHeadflex"} key="divButtons">
                                <div className="button-right" >
                                    <div className="leftBtns" >
                                        <ButtonWithDialog key={'Save'} 
                                                CustClassName ={"BlockingDialog"}
                                                iconString={'Cancel'}
                                                hideDialog={!LSAFullyBooked}
                                                buttonTxt={'Add'}
                                                onBtnClick={this.handleFormSaveClick}
                                                buttonType={"Primary"}
                                                dialogTitle={'Location Fully Booked'}
                                                subText={dialogMsg+' Create '+formHeading+'?'}
                                                isBlocking={false}
                                                handleAction={this.handleFormSaveClickAction}
                                                actionBtnTxt={'Yes'}
                                                dismisBtnTxt={'No'}>                                            
                                        </ButtonWithDialog>
                                       <ButtonWithDialog key={'Cancel'}
                                                CustClassName ={"BlockingDialog"}
                                                iconString={'Cancel'}
                                                hideDialog={hideCancelDialog}
                                                buttonTxt={'Cancel'}
                                                onBtnClick={this.handleCancelClick}
                                                buttonType={'Default'}
                                                dialogTitle={'Cancel?'}
                                                subText={'Changes made to '+formHeading+' will not be saved.'}
                                                isBlocking={false}
                                                handleAction={this.handleCancelAction}
                                                actionBtnTxt={'Yes'}
                                                dismisBtnTxt={'No'}>                                            
                                        </ButtonWithDialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormWrapper>
                </>
                ) : (
                    <div className="centeredContainer">
                        <Spinner size={SpinnerSize.large} />
                    </div>
                )}
                {SaveFlag?(
                    this.loadSpinner('Creating '+formHeading +'...',SaveFlag)
                ):''}
                {isRedirect?( <Redirect to={'/Home'} /> ):''}
                {isCreated && !NotPopActions?(
                        <ActionScreen
                            subText= {formHeading+' Created. Redirecting to Home page...'}
                            dialogTitle= {'Created Successfully'}
                            actionBtnTxt= {'go Home'}
                            showModal= {isCreated}
                            isBlocking={true}
                            actionType ={actionType}
                            shouldDefaultRedirect= {true}
                            defaulltRedirectURI= {'/Home'}
                            timmer={AppConfig.ActivityForm.FormRedirectionTimmer}
                        />
                ):''}
            </div>
        );
    }
}
