import * as React from 'react';
import {
    MessageBar,
    MessageBarType,
} from 'office-ui-fabric-react/lib/MessageBar';
import {Redirect} from 'react-router-dom';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {PrimaryButton, DefaultButton} from 'office-ui-fabric-react/lib/Button';
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
    getActivityByID,
    deleteActivityRecordByID,
    updateActivity,
    cloneActivity,
    formatNonTimeDate,
} from './ActivityService';
import LocationShiftAvailability from './LocationShiftAvailability';
import DateAndShifts from './DateAndShifts';
import NamePersonVisitor from './NamePersonVisitor';
import LocationsAndEquipments from './LocationsAndEquipments';
import { IActivityFormState, IActivityShift, IActivityEquipment, IActivity, IUserPersonaField, IEditActivityFormState, IEditActivityFormProps } from './interfaces/IActivityForm';
import { BlockingSpinner } from '../Common/dialogs/BlockingSpinner';
import { UserInfoContext } from '../../Main';
import { IShiftData } from '../Calendar/intefaces/ICalendar';
import ButtonWithDialog from '../Common/dialogs/ButtonWithDialog';
import { today } from '../Calendar/CalendarService';
import ActionScreen from '../Common/ActionScreen';
import { ILocationShiftAvailability } from './interfaces/ILocationShiftAvailability';
const moment = require('moment');
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
    activityNotes:''
};
let InitialActivity = {
    ExperimentId:null,
    DayOffset:0,
    activityDate: new Date(formatActivityDate()),
    selectedShiftIds: [],
    activityName: '',
    activityDescription: '',
    bookedForEmail: [] as IUserPersonaField[],
    bookedByEmail: {} as IUserPersonaField,
    visitorEmail: '',
    selectedLocations: [],
    selectedEquipments: [],
    showVisitorField: false
};
export default class EditActivityForm extends React.Component<IEditActivityFormProps, IEditActivityFormState> {
    
    constructor(props: IEditActivityFormProps) {
        super(props);
        EditActivityForm.contextType = UserInfoContext;
        this.state = {
            editActivity: {
                ExperimentId:null,
                DayOffset:0,
                activityDate: new Date(formatActivityDate()),
                selectedShiftIds: [],
                activityName: '',
                activityDescription: '',
                bookedForEmail: [] as IUserPersonaField[],
                bookedByEmail: {} as IUserPersonaField,
                visitorEmail: '',
                selectedLocations: [],
                selectedEquipments: [],
                showVisitorField: false,
            },
            InitialShifts:[] as IActivityShift[], 
            LocationEquipmentData: [] as IActivityEquipment[],
            errorMsgs: {
                activityDate: '',
                selectedShiftIds: '',
                activityName: '',
                activityDescription: '',
                bookedForEmail: '',
                visitorEmail: '',
                selectedLocations: '',
                activityNotes:''
            },
            editActivityId:0,
            canEdit: true,
            ShiftTimmings: [],
            activityNotes:'',
            hideDeleteDialog:true,
            hideUpdateDialog:true,
            hideCancelDialog:true,
            hideCloneDialog:true,
            Locations: [],
            selectedFor:[],
            Equipments: [],
            locationEquipKey:uuidv4(),
            isLoaded: false,
            showErrorMsg: false,
            SaveFlag: false,
            isUpdated: false,
            isRedirect: false,
            isCreated: false,
            isDeleted: false,
            errorMsg: '',
            formFieldKey:uuidv4(),
            isClone:false,
            actionType:"Update",
            LSAFullyBooked:false,
            LsaArr:[] as ILocationShiftAvailability[]

        };
        this.handleCancelAction = this.handleCancelAction.bind(this);
    }  
    initialEditActivity: IActivity = {} as IActivity;
    componentDidMount() {
        const promises = [];
        promises.push(getShiftData());
        promises.push(getLocationEquipments());
        promises.push(getActivityByID(this.props.Id));
        Promise.all(promises)
            .then(responses => {
                if (responses.length > 0) {
                    let shifts:IActivityShift[] = responses[0] ? responses[0] : [];
                    let locEquiptData:IActivityEquipment[] = responses[1]? responses[1]
                        : [];
                    let currActivityData:any = responses[2]? responses[2]
                        : [];
                    this.arrangeFormFields(shifts, locEquiptData,currActivityData);
                } else {
                        this.setState({
                            editActivityId:this.props.Id,
                            isLoaded:true,
                            showErrorMsg: true,
                            errorMsg: AppConfig.ActivityForm.ErrorDataFetchMessage
                        });
                }
            })
            .catch(error => {
                this.setState({
                    editActivityId:this.props.Id,
                    isLoaded:true,
                    showErrorMsg: true,
                    errorMsg: AppConfig.ActivityForm.ErrorDataFetchMessage
                });
                console.log(error);
            });
    }
    componentDidUpdate(prevProps:IEditActivityFormProps, prevState:IEditActivityFormState) {
        const {Id,ExpData} = this.props;
        const {editActivity} = this.state;
        if(prevProps.Id!==Id){
            getActivityByID(this.props.Id).then((response)=>{
                if (response > 0) {
                    let currActivityData:any = response? response: [];
                    const {LocationEquipmentData,InitialShifts} = this.state;
                    this.arrangeFormFields(InitialShifts, LocationEquipmentData, currActivityData);
                } else {
                        this.setState({
                            editActivityId:this.props.Id,
                            isLoaded:true,
                            showErrorMsg: true,
                            errorMsg: AppConfig.ActivityForm.ErrorDataFetchMessage
                        });
                }
            });
        }
        if(ExpData && prevProps.ExpData){
            if(ExpData.ExpOwnerEmail !== prevProps.ExpData.ExpOwnerEmail && !ExpData.ExperimentNotSaved){
                editActivity.ExperimentOwner = ExpData.ExpOwnerEmail;
                this.setState({
                    editActivity
                });
            }
            let prevExpDate = moment(editActivity.ExperimentStartDate);
            let expDate = moment(ExpData.ExpStartDate);
            let dateDiff = expDate.diff(prevExpDate,'days',true);
            if(dateDiff !== 0 && !ExpData.ExperimentNotSaved){
                editActivity.ExperimentOwner = ExpData.ExpOwnerEmail;
                editActivity.ExperimentStartDate = ExpData.ExpStartDate;
                // editActivity.activityDate = ExpData.ExpStartDate;
                this.setState({
                    editActivity,
                    formFieldKey:uuidv4()
                });
            }
            if(ExpData.ExperimentNotSaved !== prevProps.ExpData.ExperimentNotSaved){
                this.setState({
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
    getShiftsSelection(shiftArr: IActivityShift[], selectedShiftIds: number[]) {
        for (let shiftIndex = 0; shiftIndex < shiftArr.length; shiftIndex++) {
            const shiftRecord = shiftArr[shiftIndex];
            if(selectedShiftIds.indexOf(shiftRecord.Id)!== -1){
                shiftRecord.isSelected = true;
            }else{
                shiftRecord.isSelected = false;
            }            
        }
        return shiftArr;
    } 
    checkIfUSerAdmiOrEditor = (editActivity: IActivity):boolean=> {
        var isAdmin:boolean = false;
        console.log(this.context);
           try {
            if(this.context.isAdmin){
                isAdmin = true;
            }
            else{              
                    //individual Activity
                if(editActivity.bookedByEmail.Email.toUpperCase() === this.context.userName.toUpperCase()){
                    isAdmin = true;
                }
                if(!editActivity.showVisitorField && 
                    editActivity.bookedForEmail[0].Email.toUpperCase() === this.context.userName.toUpperCase()){
                    isAdmin = true;
                }
                if(editActivity.ExperimentId){
                    //check for experiment owner
                    if(editActivity.ExperimentOwner?.toUpperCase() === this.context.userName.toUpperCase()){
                        isAdmin = true;
                    }
                }
            }
           } catch (error) {
               console.log("checkIfUSerAdmiOrEditor", error);
           }
            console.log("Can Edit", isAdmin);
        return isAdmin;
    } 
    checkIfRecordIsEditable = (editActivity: IActivity):boolean=> {
        var isEditable:boolean = true;
        var currActivityDate = moment(editActivity.activityDate);
        var currDate = moment(today);
        var diffDates = currDate.diff(currActivityDate,'days');
        var officeLocId = AppConfig.ActivityForm.officeSpaceUsageLocation;
        try {
            if(editActivity.ActivityStatus === AppConfig.ActivityForm.InactiveStatusId){
                isEditable = false;
            }
            if(editActivity.activityDate && diffDates>0){
                isEditable = false;
            }
            if(this.props.office){
                if(editActivity.selectedEquipments.length>0){
                    isEditable = false;
                }
                if(editActivity.selectedLocations.length>1){
                    isEditable = false;
                }
                if(editActivity.selectedLocations[0] !== officeLocId ){
                    isEditable = false;
                }
            }
            else{
                if(editActivity.selectedLocations.indexOf(officeLocId) !== -1){
                    isEditable = false;
                }                           
            }
            if(editActivity.ExperimentId){
                if(editActivity.ExperimentStatusId === AppConfig.ActivityForm.InactiveStatusId){
                    isEditable = false;
                }
            }
        } catch (error) {
            console.log("checkIfRecordIsEditable", error);            
        }
            console.log("isEditable", isEditable);
        return isEditable;
    } 
    getActivityDetailData(currActivityData: any): IActivity {
        var editActivity:IActivity = {...InitialActivity};
        try {
            var activityDetails = currActivityData.ActivytData[0];
            editActivity.Id = activityDetails.ActivityId;
            var actDate = formatNonTimeDate(activityDetails.ActivityDate);
            editActivity.activityDate = actDate?new Date(actDate):null;
            editActivity.activityName = activityDetails.ActivityName;
            editActivity.activityDescription = activityDetails.ActivityDescription;
            editActivity.showVisitorField = !activityDetails.IsEmployee;
            if(activityDetails.IsEmployee){
                let obj:IUserPersonaField = {} as IUserPersonaField;
                obj.DisplayName = activityDetails.BookedForName;
                obj.Email = activityDetails.BookedForEmail;
                editActivity.bookedForEmail = [];
                editActivity.bookedForEmail.push(obj);
            }else{
                editActivity.showVisitorField = true;
                editActivity.visitorEmail = activityDetails.BookedForEmail
            }
            let obj:IUserPersonaField = {} as IUserPersonaField;
                obj.DisplayName = activityDetails.BookedByName;
                obj.Email = activityDetails.BookedByEmail;
                editActivity.bookedByEmail = obj;
            
            editActivity.DayOffset = activityDetails.DayOffset;
            
            editActivity.selectedShiftIds = currActivityData.ActivityShift;
            editActivity.selectedLocations = currActivityData.ActivityLocation;
            editActivity.selectedEquipments = currActivityData.ActivityEquipment;
            //experiment Data
            editActivity.ExperimentId = activityDetails.ExperimentId;
            editActivity.ExperimentOwner = activityDetails.ExperimentOwner;
            editActivity.ExperimentStatusId = activityDetails.ExperimentStatusId;
            var expDate = formatNonTimeDate(activityDetails.ExperimentStartDate);
            editActivity.ExperimentStartDate = expDate?new Date(expDate):null;
            editActivity.ActivityStatus = activityDetails.ActivityStatus;            
        } 
        catch (error) {
            console.log(error);
        }
        return editActivity;
    }
    arrangeFormFields = (shifts:IActivityShift[], locationEquipmentData:IActivityEquipment[],currActivityData:any) => {
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
                    tbdShift.isSelected = true;
                    shifts = _.reject(shifts, {
                        DisplayName: AppConfig.ActivityForm.TBDRejectDispName,
                    });
                    shiftArr.push(tbdShift);
                    for (let sndex = 0; sndex < shifts.length; sndex++) {
                        const shiftElm = shifts[sndex];
                        shiftElm.isSelected = false;
                        shiftArr.push(shiftElm);
                    }
                    selectedShiftIds = [AppConfig.ActivityForm.TBDRejectShiftId];
                }
            }
        let uniqLocationsArr = getUniqueLocationObjs(locationEquipmentData,this.props.office);
        let editActivity:IActivity = this.getActivityDetailData(currActivityData);
        this.initialEditActivity = JSON.parse(JSON.stringify(editActivity));
        let activityShifts = this.getShiftsSelection(shiftArr,editActivity.selectedShiftIds);
        let canEdit:boolean = false;
        let canUserEdit:boolean= this.checkIfUSerAdmiOrEditor(editActivity);
        if(canUserEdit){
            var isEditable:boolean = this.checkIfRecordIsEditable(editActivity);
            canEdit = isEditable;
        }
        else{
            canEdit = canUserEdit;
        }
        let selectedFor =  editActivity.showVisitorField?[]:editActivity.bookedForEmail;
        const {viewForm,ExpData} = this.props;
        if(ExpData){
            editActivity.ExperimentId = ExpData.ExpId;
            editActivity.ExperimentOwner = ExpData.ExpOwnerEmail;
            let expDate = formatNonTimeDate(ExpData.ExpStartDate);
            editActivity.ExperimentStartDate = expDate?new Date(expDate):null;
        }
        this.setState({
            editActivityId:this.props.Id,
            InitialShifts:shifts, 
            LocationEquipmentData: locationEquipmentData,
            ShiftTimmings: activityShifts,
            editActivity: editActivity,
            Locations: uniqLocationsArr,
            Equipments: locationEquipmentData,
            canEdit,
            viewForm: viewForm || !canEdit,
            selectedFor,
            isLoaded: true,
            locationEquipKey: uuidv4(),
        });
        if(ExpData){
            if(this.props.handleActivityActions){
                this.props.handleActivityActions("Form Loaded", "LoadForm");
            }
        }
    }
    handleFormFieldChange = (updateProp:any, field:string) => {
        let editActivity:any= this.state.editActivity;
        let LsaArr:any= this.state.LsaArr;
        editActivity[field] = updateProp;
         //'
         var rasieAlert = this.alertLSAFullyBooked(LsaArr);
        if(rasieAlert && field ==='selectedShiftIds'){
            this.setState({
                editActivity,
                showErrorMsg: true,
                errorMsg: AppConfig.ActivityForm.FullyBookedAlertMsg
            });
        } else{
            this.setState({
                editActivity,
                showErrorMsg: false,
                errorMsg: ''
            });  
        }
    }
    handleEquipmentSelection = (updateProp:any, field:string) => {
        let editActivity:any= this.state.editActivity;
        editActivity[field] = updateProp;
        this.setState({
            editActivity,
        });
    }
    handleLocationSelection = (locationValues:any, equipValues:string) => {
        const {editActivity,LsaArr}:any= this.state;
        editActivity['selectedLocations'] = locationValues;
        editActivity['selectedEquipments'] = equipValues;
        this.setState({
            editActivity,
        });
        var rasieAlert = this.alertLSAFullyBooked(LsaArr);
        if(rasieAlert){
            this.setState({
                editActivity,
                showErrorMsg: true,
                errorMsg: AppConfig.ActivityForm.FullyBookedAlertMsg
            });
        } else{
            this.setState({
                editActivity,
                showErrorMsg: false,
                errorMsg: ''
            });  
        }
    }
    handleOnChange = (eventObj:any) => {
        const {editActivity} :any = this.state,
            val = eventObj.target.value;
        if (typeof val === 'string'){
            if(val.trim() === '') {
                editActivity[eventObj.target.name] = '';
            } else {
                editActivity[eventObj.target.name] = val;
            }
        } 
        if(eventObj.target.name === 'visitorEmail'){
            editActivity[eventObj.target.name] = val;
            editActivity.bookedForEmail = [];
            this.setState({
                editActivity, 
            });
        }
        else if(eventObj.target.name === "bookedForEmail"){
            editActivity[eventObj.target.name] = val;
            this.setState({
                selectedFor:eventObj.target.selectedFor,
                editActivity, 
            });
        }
        else if(eventObj.target.name === "showVisitorField"){
            editActivity[eventObj.target.name] = val;
            editActivity.bookedForEmail = [];
            editActivity.visitorEmail = '';
            this.setState({
                editActivity, 
            });
        }
        else{
            this.setState({
                editActivity: editActivity,
            });
        }
    }
    renderErrorMsg(msg:string,key:any){
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
            // if (AppConfig.ActivityForm.showTBD && shiftRec.Id === AppConfig.ActivityForm.TBDRejectShiftId) {
            //     shiftRec.isSelected = true;
            // }else{
                shiftRec.isSelected = false;
            // }
            shiftArr.push(shiftRec);
        }
        return shiftArr;
    }
    validateFields = (editActivity:IActivity) => {
        let fieldsArr = ['activityName','visitorEmail'],
            fieldValueArr:any = editActivity,
            flag = true,
            errorArr = ['Activity Name is required field.','Visitor Email is required field.'];
        const {ExpData} =  this.props;
        try {
            for (let i = 0; i < fieldsArr.length; i++) {
                let eachField = fieldsArr[i];
                if(eachField === 'visitorEmail'){
                    if(editActivity.showVisitorField){
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
            if (isNaN(new Date(editActivity.activityDate).getTime())) {
                this.addValidationError('Activity Date is required field.', 'activityDate', flag);
                flag = false;
            }
            else{
                var currDate = moment(today),
                currActivityDate = moment(editActivity.activityDate);
                var diffDates = currDate.diff(currActivityDate,'days');
                if( diffDates>0){
                    this.addValidationError('Activity Date should be selected from future dates.', 'activityDate', flag);
                    flag = false;
                }
            }
            if(ExpData){
                var currActivityDate = moment(editActivity.activityDate),
                currDate = moment(),
                expDate = moment(ExpData.ExpStartDate);
                var diffExpDates = expDate.diff(currActivityDate,'days');
                if(diffExpDates>0){
                    let errMsg:string ="Select Activity Date from future dates and should not be before experiment date.";
                    if(!flag){
                        errMsg = 'Activity Date should be selected from future dates.';
                    }
                    this.addValidationError(errMsg, 'activityDate', flag);
                    flag = false;
                }
            }
            else{
                if(editActivity.ExperimentId && editActivity.ExperimentStartDate){
                    var expDate = moment(editActivity.ExperimentStartDate);
                    var diffExpDates = expDate.diff(currActivityDate,'days');
                    if(diffExpDates>0){
                        let errMsg:string ="Select Activity Date from future dates and should not be before experiment date.";
                        if(!flag){
                            errMsg = 'Activity Date should be selected from future dates.';
                        }
                        this.addValidationError(errMsg, 'activityDate', flag);
                        flag = false;
                    }
                }
            }
            if (editActivity.selectedShiftIds.length<1) {
                this.addValidationError('Activity Shift is required field.', 'selectedShiftIds', flag);
                flag = false;
            }
            if (!editActivity.showVisitorField && editActivity.bookedForEmail.length<1) {
                this.addValidationError('Person Name is required field.', 'bookedForEmail', flag);
                flag = false;
            }
            if (editActivity.selectedLocations.length<1) {
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
    updateExperimentForm = (property:any,action:"LoadForm"|"CreatedActivity"|"ClonedActivity"|"UpdatedActivity"|"CloseForm"|"DeleteActivity"|"ViewToEdit") =>{
        if(this.props.ExpData){
            if(this.props.handleActivityActions){
                this.props.handleActivityActions(property, action);
            }
        }
    }
    handleCloneClick = (ev:any) => {
        ev.preventDefault();
        const {hideCloneDialog} = this.state;
        this.setState({
            hideCloneDialog:!hideCloneDialog
        });      
    }
    handleAddClick = (ev:any) => {
        ev.preventDefault();
        const {editActivity} = this.state;
        var flag = true//this.validateFields(editActivity);
        if (flag) {
            this.setState({
                showErrorMsg: false,
                errorMsg: '',
                errorMsgs: InitialErrorMsg,
            });
            this.callForCreate(editActivity,AppConfig.ActivityForm.OfcAndIndiActivityType);
        } else {
            this.setState({
                showErrorMsg: true,
                errorMsg: AppConfig.ActivityForm.ErrorValidationMessage,
            });
        }
    }
    callForCreate = (editActivity:IActivity,activityType:string) =>{
        this.setState({SaveFlag:true,isClone:true,hideCloneDialog:true});
        let expId = editActivity.ExperimentId?editActivity.ExperimentId:null;
        let jsonObj:any = {ActivityId:editActivity.Id};      
        cloneActivity(jsonObj).then(response => {
        let newId:any  = response?.id;
        this.setState({SaveFlag:false,isCreated:true,viewForm:false,editActivityId:newId,actionType:"Clone"});
        }).catch(error => {
            this.setState({
                SaveFlag:false,
                actionType:"Failed",
                showErrorMsg: true,
                errorMsg:AppConfig.ActivityForm.CloneErrorMessage +error
            });
            console.log(error);
        });

    }
    callForUpdate = (editActivity:any,activityType:string,activityNotes:string) =>{
        this.setState({SaveFlag:true});
        const {editActivityId} = this.state;
        editActivity.Id= editActivityId;
        if(this.props.office){
            editActivity.selectedEquipments = [];
            editActivity.selectedLocations = [AppConfig.ActivityForm.officeSpaceUsageLocation];
        }
        let notesWithUserProfile = activityNotes +" - Modified by " + this.context.userName; 
        updateActivity(editActivity,activityType,notesWithUserProfile)
        .then(response => {
            if(this.props.ExpData){
                this.updateExperimentForm(editActivity,"UpdatedActivity");
            }
            this.setState({SaveFlag:false, hideUpdateDialog:true,isUpdated:true,actionType:"Update"});
        }).catch(error => {
            this.setState({
                SaveFlag:false,
                hideUpdateDialog:true,
                actionType:"Failed",
                isUpdated:false,
                showErrorMsg: true,
                errorMsg:AppConfig.ActivityForm.UpdateErrorMessage + error
            });
            console.log(error);
        });

    }
    alertLSAFullyBooked = (LsaArr:ILocationShiftAvailability[]):boolean =>{
        const {editActivity} = this.state;
        var fullCapLSA:ILocationShiftAvailability[] =  _.filter(LsaArr,{OnAlert:true}), raiseAlert:boolean = false;
        if(fullCapLSA.length>0){
            let filterSelection = _.filter(fullCapLSA,(lsa)=>{
                let shiftSelected = false;
                let locSelected = false;
                if(editActivity.selectedShiftIds.indexOf(lsa.ShiftId) !==-1){
                    shiftSelected = true;
                }
                if(editActivity.selectedLocations.indexOf(lsa.LocationId) !==-1){
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
        const {editActivity,hideUpdateDialog,errorMsgs,LsaArr} = this.state;
        var flag = this.validateFields(editActivity);
        if (flag) {
            var alertFlag = this.alertLSAFullyBooked(LsaArr);
            errorMsgs.activityNotes = ''
            this.setState({
                hideUpdateDialog:!hideUpdateDialog,
                activityNotes:'',
                LSAFullyBooked:alertFlag,
                showErrorMsg: false,
                errorMsg: '',
                errorMsgs: InitialErrorMsg,
            });            
        } else {
            this.setState({
                showErrorMsg: true,
                errorMsg: AppConfig.ActivityForm.ErrorValidationMessage,
            });
        }
    }   
    handleUpdateAction = () =>{
        const {activityNotes,editActivity,isClone,errorMsgs} = this.state;
        this.setState({
            hideUpdateDialog:false
        });
        // if(activityNotes.length<1){
        //     errorMsgs.activityNotes = 'Please enter detailed notes before you delete.';
        //     this.setState({
        //         hideUpdateDialog:false,
        //         errorMsgs:errorMsgs
        //     });
        // }
        // else{
            errorMsgs.activityNotes = '';
            this.setState({
                SaveFlag:true,
                errorMsgs
            });
            this.callForUpdate(editActivity,AppConfig.ActivityForm.OfcAndIndiActivityType,activityNotes);
        // }
    } 
    handleNotesChange = (event:any)=>{
        var val = event.target.value;
        var notes:string ='';
        if(val.trim() === '') {
            notes= '';
        } else {
            notes = val;
        }
        this.setState({
            activityNotes:notes
        });
    }
    handleDelete = () =>{
        const {hideDeleteDialog,errorMsgs} = this.state;
        errorMsgs.activityNotes = ''
        this.setState({
            hideDeleteDialog:!hideDeleteDialog,
            errorMsgs:errorMsgs,
            activityNotes:''
        });
      
    }
    handleDeleteAction= () =>{
        const {errorMsgs} = this.state;
        errorMsgs.activityNotes = '';
        this.setState({
            hideDeleteDialog:false,
            SaveFlag:true,
            errorMsgs
        });
        let notesWithUserProfile = "Deleted by " + this.context.userName; 
        deleteActivityRecordByID(this.state.editActivityId,notesWithUserProfile)
        .then(response => {
            if(this.props.ExpData){
                this.updateExperimentForm("Close","DeleteActivity");
            }
            this.setState({SaveFlag:false, hideDeleteDialog:true,isDeleted:true,actionType:"Delete"});
        }).catch(error => {
            this.setState({
                SaveFlag:false,  
                isDeleted:false,
                actionType:"Failed",
                hideDeleteDialog:true,
                showErrorMsg: true,
                errorMsg:AppConfig.ActivityForm.DeleteErrorMessage + error
            });
            console.log(error);
        });
    }
    handleCancelClick = () =>{
        const {hideCancelDialog} = this.state;
        this.setState({
            hideCancelDialog:!hideCancelDialog
        });
    }
    handleCancelAction = (event:any) => {
        event.preventDefault();
        const {ExpData} = this.props;
        if(ExpData){
            this.updateExperimentForm("Close","CloseForm");
        }else{
            this.setState({
                isRedirect:true
            });
        }
    }   
    handleEditClick = () =>{
        this.setState({
            viewForm:false
        });
        if(this.props.ExpData){
            this.updateExperimentForm('Changed view to update',"ViewToEdit");
        }
    }   
    handleActionAndRediret(): JSX.Element {
        const {
            isCreated,
            isUpdated,
            isDeleted,
            editActivityId,
            actionType,
            canEdit,
            isClone,
            viewForm            
        } = this.state;
        const {office,NotPopActions} = this.props;
        const subText = office? 'Office Usage' : 'Lab Activity';
        const redirectURI = office? '/PlanOfficeSpace?id='+editActivityId : '/PlanActivity?id='+editActivityId;
        return(
            <div>
                {isUpdated && !NotPopActions?(
                        <ActionScreen 
                            subText= {subText+' updated. Redirecting to Home page...'}
                            dialogTitle= {'Updated Successfully'}
                            actionBtnTxt= {'go Home'}
                            showModal= {isUpdated}
                            isBlocking={true}
                            actionType ={actionType}
                            shouldDefaultRedirect= {true}
                            defaulltRedirectURI= {'/Home'}
                            timmer={AppConfig.ActivityForm.FormRedirectionTimmer}
                        />
                ):''}
                {isDeleted && !NotPopActions?(
                        <ActionScreen 
                            subText= {subText+' Deleted. Redirecting to Home page...'}
                            dialogTitle= {'Deleted Successfully'}
                            actionBtnTxt= {'go Home'}
                            showModal= {isDeleted}
                            isBlocking={true}
                            actionType ={actionType}
                            shouldDefaultRedirect= {true}
                            defaulltRedirectURI= {'/Home'}
                            timmer={AppConfig.ActivityForm.FormRedirectionTimmer}
                        />
                ):''}
                {isCreated && !NotPopActions?(
                    <ActionScreen 
                        subText= {subText+' Cloned. Redirecting to newly created '+subText+'...'}
                        dialogTitle= {'Created Successfully'}
                        isBlocking={true}
                        actionBtnTxt= {'go Home'}
                        showModal= {isCreated}
                        actionType ={actionType}
                        shouldDefaultRedirect= {true}
                        defaulltRedirectURI= {redirectURI}
                        timmer={AppConfig.ActivityForm.FormRedirectionTimmer}
                    />
                ):''}
                {!canEdit && !NotPopActions && !viewForm &&!isClone?(
                    <ActionScreen 
                        subText= {'Do not have permission to edit the '+ subText}
                        dialogTitle= {'Access Denied'}
                        isBlocking={false}
                        actionBtnTxt= {'go Home'}
                        showModal= {true}
                        isActionBtnVisible={true}
                        shouldDefaultRedirect={false}
                        leftBtnText= {'Go Home'}
                        leftBtnURI= {'/Home'}
                        rightBtnText= {'My Activities'}
                        rightBtnURI= {'/MyActivities'}
                        actionType ={"Denied"}
                    />
                ):''}
            </div>
        );       
    }    
    render() {
        const {
            isLoaded,
            ShiftTimmings,
            editActivity,
            errorMsgs,
            Equipments,
            Locations,
            selectedFor,
            locationEquipKey,
            showErrorMsg,
            errorMsg,
            formFieldKey,           
            SaveFlag,
            activityNotes,
            hideDeleteDialog,
            hideUpdateDialog,
            canEdit,
            isClone,
            hideCancelDialog,
            hideCloneDialog,
            isRedirect,
            viewForm,
            LSAFullyBooked            
        } = this.state;
        const {office,ExpData,NotPopActions} =this.props;
        const formHeading1 = viewForm? 'View ':'Edit ';
        const formHeading2 = office? 'Office Usage' : 'Lab Activity';
        const dialogMsg = AppConfig.ActivityForm.FullyBookedDialogMsg;
        var updateTxt ='Are you sure you want to update the '+formHeading2+'? Please add notes for the update.';
        var lsaFullyBooked = dialogMsg;
        updateTxt = LSAFullyBooked?lsaFullyBooked+updateTxt:updateTxt;

        return (
            <div className="formMain">
                {isLoaded ? (
                <>                   
                    <FormWrapper FormHeading={formHeading1+formHeading2}>
                        <div className="ms-Grid" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm9">
                                    <div>
                                    <DateAndShifts key={formFieldKey.toString()}
                                        activityDate={editActivity.activityDate}
                                        selectedShiftIds={
                                            editActivity.selectedShiftIds
                                        }
                                        viewForm={viewForm}
                                        shiftTimmings={ShiftTimmings}
                                        ExpId={editActivity.ExperimentId}
                                        ExpDate={editActivity.ExperimentStartDate}
                                        errorMsgs={errorMsgs}
                                        handleFormFieldChange={
                                            this.handleFormFieldChange
                                        }
                                    />    
                                    </div>
                                    <NamePersonVisitor key={formFieldKey.toString()}
                                        viewForm={viewForm}
                                        errorMsgs ={errorMsgs}
                                        activityName={editActivity.activityName}
                                        selectedFor={selectedFor}
                                        showVisitorField ={editActivity.showVisitorField}
                                        visitorEmail={editActivity.visitorEmail}
                                        handleOnChange={this.handleOnChange}
                                    />                               
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-sm5">
                                            <TextField
                                                multiline
                                                disabled={viewForm}
                                                label="Activity Description"
                                                name="activityDescription"
                                                placeholder="Activity Description"
                                                value={
                                                    editActivity.activityDescription
                                                }
                                                errorMessage={
                                                    errorMsgs.activityDescription
                                                }
                                                onChange={this.handleOnChange}
                                                styles={descFieldClass}
                                            />
                                        </div>
                                        <div className="ms-Grid-col ms-sm7">
                                               {office?(''):(
                                                   <LocationsAndEquipments key={locationEquipKey}
                                                    viewForm={viewForm}
                                                    locationEquipKey={locationEquipKey}
                                                    Equipments={Equipments}
                                                    Locations={Locations}
                                                    errorMsgs={errorMsgs}
                                                    selectedLocations={editActivity.selectedLocations}
                                                    selectedEquipments={editActivity.selectedEquipments}
                                                    handleLocationSelectionChange={this.handleLocationSelection}
                                                    handleEquipmentSelectionChange={this.handleEquipmentSelection}
                                                />)}
                                        </div>
                                    </div>
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-sm8"></div>
                                    </div>
                                </div>
                                <div className="ms-Grid-col ms-sm3">
                                    <div className="ms-Grid-row shiftLocation">
                                        <LocationShiftAvailability
                                                sendLsaArr={this.updateStateLSA}
                                                office={office}
                                                Shifts={ShiftTimmings}
                                                Locations={Locations}
                                                activityDate={formatActivityDate(
                                                    editActivity.activityDate,
                                                )}  
                                        />
                                    </div>
                                </div>
                            </div>
                            {showErrorMsg?this.renderErrorMsg(errorMsg,'errorMsg'):''}
                            {!canEdit?this.renderErrorMsg('Access Denied: This record cannot be modified.','canEdit'):''}
                            <div className={ExpData?.ExperimentNotSaved?"displayNone":"row formHeadflex"} key="divButtons">
                                {viewForm && (
                                    <div className={'button-right'}>
                                        <div className={'leftBtns'}>
                                            {canEdit && (<PrimaryButton
                                                key="Edit"
                                                text="Edit"
                                                data-action={'Edit'}
                                                onClick={this.handleEditClick}
                                            /> )}                                        
                                            {   !NotPopActions &&(  
                                                <ButtonWithDialog key={'Clone12'}
                                                    CustClassName ={"BlockingDialog"}
                                                    iconString={'Clone'}
                                                    hideDialog={hideCloneDialog}
                                                    buttonTxt={'Clone'}
                                                    onBtnClick={this.handleCloneClick}
                                                    buttonType={'Primary'}
                                                    dialogTitle={'Clone?'}
                                                    subText={"This will create a copy of this "+formHeading2+" and display it so you can update the date and other details. Do you want to proceed?"}
                                                    isBlocking={false}
                                                    handleAction={this.handleAddClick}
                                                    actionBtnTxt={'Yes'}
                                                    dismisBtnTxt={'No'}>                                            
                                                </ButtonWithDialog>
                                        )}  
                                            <DefaultButton
                                                key="Close"
                                                onClick={this.handleCancelAction}
                                                text="Close"
                                            />
                                        </div>
                                    </div>
                                )}                               
                                <div className={viewForm || isClone?"displayNone":"button-right"}>
                                    <div className={'leftBtns'}>
                                        <ButtonWithDialog key={'update'}
                                            CustClassName ={"BlockingDialog"}
                                            hideDialog={hideUpdateDialog}
                                            buttonTxt={'Update'}
                                            onBtnClick={this.handleFormSaveClick}
                                            buttonType={'Primary'}
                                            dialogTitle={'Update?'}
                                            subText={updateTxt}
                                            isBlocking={true}
                                            handleAction={this.handleUpdateAction}
                                            actionBtnTxt={'Update'}
                                            dismisBtnTxt={'Cancel'}
                                            disabled={viewForm}>
                                            <div>
                                                <TextField
                                                    multiline
                                                    label="Notes (Optional)"
                                                    name="activityNotes"
                                                    placeholder="Change Reason"
                                                    value={activityNotes}
                                                    errorMessage={errorMsgs.activityNotes}
                                                    onChange={this.handleNotesChange}
                                                />
                                            </div>                                               
                                        </ButtonWithDialog>
                                        {!NotPopActions && (<ButtonWithDialog key={'CloneUpdate'}
                                                    CustClassName ={"BlockingDialog"}
                                                    iconString={'Clone'}
                                                    hideDialog={hideCloneDialog}
                                                    buttonTxt={'Clone'}
                                                    onBtnClick={this.handleCloneClick}
                                                    buttonType={'Primary'}
                                                    dialogTitle={'Clone?'}
                                                    subText={"This will create a copy of this "+formHeading2+" and display it so you can update the date and other details. Do you want to proceed?"}
                                                    isBlocking={false}
                                                    handleAction={this.handleAddClick}
                                                    actionBtnTxt={'Yes'}
                                                    dismisBtnTxt={'No'}>                                            
                                                </ButtonWithDialog>)}
                                        <ButtonWithDialog key={'Cancel12'}
                                                CustClassName ={"BlockingDialog"}
                                                iconString={'Cancel'}
                                                hideDialog={hideCancelDialog}
                                                buttonTxt={'Cancel'}
                                                onBtnClick={this.handleCancelClick}
                                                buttonType={'Default'}
                                                dialogTitle={'Cancel?'}
                                                subText={'Changes made to '+formHeading2+' will not be saved.'}
                                                isBlocking={false}
                                                handleAction={this.handleCancelAction}
                                                actionBtnTxt={'Yes'}
                                                dismisBtnTxt={'No'}>                                            
                                        </ButtonWithDialog>
                                    </div>
                                    <div>
                                        <ButtonWithDialog key={'Delete'}
                                                CustClassName ={"BlockingDialog"}
                                                iconString={'Delete'}
                                                hideDialog={hideDeleteDialog}
                                                buttonTxt={'Delete'}
                                                onBtnClick={this.handleDelete}
                                                buttonType={'Primary'}
                                                dialogTitle={'Delete?'}
                                                subText={'Are you sure you want to delete the activity?'}
                                                isBlocking={false}
                                                handleAction={this.handleDeleteAction}
                                                actionBtnTxt={'Delete'}
                                                disabled={viewForm}
                                                dismisBtnTxt={'Cancel'}
                                            >                                             
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
                {SaveFlag && hideDeleteDialog?(
                    this.loadSpinner(!isClone?'Updating '+formHeading2+'...':'Cloning '+formHeading2+'...',SaveFlag)
                ):''}
                {SaveFlag && !hideDeleteDialog?(
                    this.loadSpinner('Deleting '+formHeading2+'...',SaveFlag)
                ):''}
                {isRedirect?( <Redirect to={'/Home'} /> ):''}

                {this.handleActionAndRediret()}
            </div>
        );
    } 
}