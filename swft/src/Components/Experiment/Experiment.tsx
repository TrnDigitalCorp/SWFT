import * as React from 'react';
import { UserInfoContext } from '../../Main';
import { IExperiment, IExperimentProps, IExperimentState, IProject, IExperimentErrMsgs, IValidationObj } from './IExperiment';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DetailsList, IColumn,Selection, IDetailsListStyles,SelectionMode, ConstrainMode, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner, SpinnerType, SpinnerLabelPosition } from 'office-ui-fabric-react/lib/Spinner';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import FLatDatePickr from '../utils/FLatDatePickr';
import moment from 'moment';
import ExperimentOwnerPicker from '../Common/BookedForEmail';
import { IUserPersonaField, IActivity } from '../Activity/interfaces/IActivityForm';
import * as Utils from "../utils/Utils";
import CreateActivityForm from "../Activity/CreateActivityForm";
import './Experiment.css';
import ExperimentService from "../../services/experiment-service";
import { Redirect } from 'react-router-dom';
import { IActivityGridModel } from "../../Models/IActivityGridModel";
import { validateExpFields } from './ExperimentService';
import ButtonWithDialog from '../Common/dialogs/ButtonWithDialog';
import AppConfig from '../../Constans';
import { BlockingSpinner } from '../Common/dialogs/BlockingSpinner';
import * as _ from 'lodash';
import EditActivityForm from '../Activity/EditActivityForm';
const uuidv4 = require('uuid/v4');
enum MessageText{
  "AddExperiment"="You will be able to add activities after you save the experiment.",
  "NoActivities"="Click on Add Activity button to add the first activity to this experiment.",
  "NoEditPastExp"= "The system doesn't allow updates to Experiment Details which have start dates in the past!",
  "NoAdminExpOwner"="Permission Denied: Only a system administrator or the experiment owner can edit an experiment.",
  "UnsavedChangesLost"= "Your unsaved changes in the experiment details section will be lost. Do you still want to close?",
  "ExptDetailsSaved"= "Experiment details saved successfully.",
  "DeleteActToolTip"="Enabled if none of the selected activities occur in the past.",
  "DeleteExptConfirm"="Are you sure you want to delete this experiment and all associated activities?",
  "DeleteActConfirm"="Are you sure you want to delete the selected activity/activities?",
  "DeleteNotesError"="Please mention the reason for deleting this experiment.",
  "DeletedExperiment"="Deleted experiments can't be edited.",
  "NoExperimentWithId"="Couldn't find an experiment with this id",
  "LoadingActivitForm"="Loading Activity Form...",
  "CloneActivitForm"="Cloning Activity...",
  "CreatedActivity"="Please fill all the required fields before saving the experiment.",
  "ReloadActivity"="Reloading Activities..",
  "DeleteActivity"="Deleting...",
  "UnsavedEditForm"="Unsaved changes in the Edit form will be lost. Do you confirm?",
  "UnsavedAddForm"="Unsaved changes in the Add form will be lost. Do you confirm?",
  "UnsavedAddEditForm" = "Unsaved changes in the Add/Edit form will be lost. Do you confirm?",
  "UnsavedAddEditFormViewClick" = "Unsaved changes in the Add/Edit form will be lost. Do you confirm?",
  "CloneExpConfirmation" = "This will create a copy of this experiment and take you there so you can update the date and other details. Do you want to proceed?",
  "CloneActConfirmation" = "This will create a copy of this activity and display it below so you can update the date and other details. Do you want to proceed?",
  "CloneSuccessMessage" = "Experiment Cloned successfully. You can update the dates and other details of the cloned experiment here.",  
  "CloningExpLoaderTxt" = "Cloning...",  
}
const detailsListStyles:Partial<IDetailsListStyles> = {
  headerWrapper:{
      selectors: {
          '& .ms-DetailsHeader-cell:hover': {
              backgroundColor: 'white!important',
          },
      }
  },
}
const now = moment().format(AppConfig.PlanExperiment.ExpDateFormat);
export default class Experiment extends React.Component<IExperimentProps, IExperimentState> {
  private _selection: Selection;
  constructor(props: IExperimentProps) {
    super(props);
    
    this._selection = new Selection({
      onSelectionChanged: () => this._onItemSelectionChange()
    });  
    
    Experiment.contextType = UserInfoContext;

    this.state = {      
      Experiment : {} as IExperiment,
      ExperimentErrMsgs:{} as IExperimentErrMsgs,
      TopLabel: "Add Experiment",
      Projects: [],
      ExperimentActivities: [],
      ShowAddActivity: "None",
      ShowDialog: "None",
      PlanActivityLabel: "Add An Activity",
      InfoMessage: MessageText.AddExperiment,
      Mode: "add",
      EID: 0,
      AID:0,
      SaveExpProcessing: false,
      RedirectUri: "", 
      PlanexLoading: true,
      HeaderMessage: "",
      HeaderMessageType: MessageBarType.error,
      DisableForm: false,
      DisableAdd: false,
      DisableDelete: false,
      SelectedActivities: [],
      PreviousStartDate: new Date(now),
      ExperimentNotSaved: false,
      HideDeleteDialog: true,
      DeleteNotes: "",
      DeleteErrorMessage: "",
      FormActionLoading:false,
      FormAction:"LoadForm",
      FormActionMsg:'',
      FormId:uuidv4(),
      HideCloneDialog: true,
    }
  }

  public render() {
    const { ShowDialog, HeaderMessage, HeaderMessageType, HideDeleteDialog, DeleteNotes, DeleteErrorMessage,
      Experiment, EID,TopLabel, Projects, ExperimentActivities, ShowAddActivity, InfoMessage, Mode, SaveExpProcessing,
      FormActionLoading, FormActionMsg,ExperimentNotSaved,RedirectUri, PlanexLoading, ExperimentErrMsgs,DisableForm, 
      SelectedActivities,AID, FormId,HideCloneDialog,DisableAdd, DisableDelete} = this.state;
      var expDate = Experiment.StartDate?Experiment.StartDate:null;
    return (
      <div style={{width:"100%", textAlign:"center",overflow:"auto"}}>                          
        { PlanexLoading ? <div style={{paddingTop: "50px"}}><Spinner type={SpinnerType.large} label="Loading..."></Spinner></div> : 
          <div className="ms-Grid">
            <div className="ms-Grid-row" style={{minHeight:"30px"}}></div>
            {
              HeaderMessage ? 
                <div className="ms-Grid-row" style={{
                  width: "90%",
                  overflow: "auto",
                  margin: "0 auto",
                  padding:"0px 0px 10px 0px"}}>
                  <MessageBar key={"HeaderMessageType"}  onDismiss={this.onDismissHeaderMessage} messageBarType={HeaderMessageType} dismissButtonAriaLabel="Close">{HeaderMessage}</MessageBar>
                </div> : ""
            }
            <div className="ms-Grid-row" style={{
              boxShadow: "rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px, rgba(0, 0, 0, 0.11) 0px 0.3px 0.9px 0px", 
              width: "90%",
              overflow: "auto",
              margin: "0 auto",
              padding:"10px 0px 10px 10px"}}>
              <div className="ms-Grid" dir="ltr" style={{padding:"0px", width: "99%", textAlign:"left"}}>
                <div className="ms-Grid-row"style={{width:"100%",overflow:"auto",margin:"0 auto",paddingBottom:"10px"}}>
                  <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4" style={{padding:"0px"}}>
                    <div style={{fontSize: "12pt", fontWeight: "bold", textAlign:"left"}}>
                      {TopLabel}
                    </div>
                  </div>
                  <div className="ms-Grid-col ms-sm8 ms-md8 ms-lg8"  style={{padding:"0px"}}>
                    { Utils.strEqualsCI(Mode, "EDIT") ?
                      <div style={{float:"right", paddingLeft:"15px"}}>
                        {/* <PrimaryButton text="Delete" onClick={this.onDeleteExperiment}></PrimaryButton> */}
                          <ButtonWithDialog key={'Delete'}
                            CustClassName ={"BlockingDialog"}
                            iconString={'Delete'}
                            hideDialog={HideDeleteDialog}
                            buttonTxt={'Delete'}
                            onBtnClick={this.onClickDeleteExp}
                            buttonType={'Primary'}
                            dialogTitle={'Delete'}
                            subText={'Are you sure you want to delete the experiment and associated activities?'}
                            isBlocking={true}
                            handleAction={this.onClickDeleteConfirmation}
                            actionBtnTxt={'Delete'}
                            disabled={DisableForm}
                            dismisBtnTxt={'Cancel'}
                        >
                          <div>
                              <TextField
                                  multiline
                                  label="Notes"
                                  name="deleteNotes"
                                  placeholder="Reason for deleting"
                                  value={DeleteNotes}
                                  errorMessage={DeleteErrorMessage}
                                  onChange={this.onChangeDeleteNotes}
                              />
                          </div>                                               
                    </ButtonWithDialog>
                      </div> : ""
                    }
                    { Utils.strEqualsCI(Mode, "EDIT") ? 
                      <div style={{float:"right", paddingLeft:"15px"}}>
                        <ButtonWithDialog key={'Clone'}
                          CustClassName ={"BlockingDialog"}
                          iconString={'Clone'}
                          hideDialog={HideCloneDialog}
                          buttonTxt={'Clone Experiment'}
                          onBtnClick={this.onClickCloneExperiment}
                          buttonType={'Primary'}
                          dialogTitle={'Clone Experiment?'}
                          subText={"This will create a copy of this experiment with all its activities. Do you want to proceed?"}
                          isBlocking={false}
                          handleAction={this.onClickConfirmCloneExperiment}
                          actionBtnTxt={'OK'}
                          dismisBtnTxt={'Cancel'}>                                            
                        </ButtonWithDialog>
                      </div> : ""
                    }
                    <div style={{float:"right", paddingLeft:"15px"}}>
                      <PrimaryButton text="Close" onClick={this.onCloseExperiment}></PrimaryButton>
                    </div>
                    <div style={{float:"right", paddingLeft:"15px"}}>
                      <PrimaryButton text="Save" disabled={DisableForm} onClick={this.onSaveExperiment}></PrimaryButton>
                    </div>
                    <div style={{float:"right", paddingLeft:"15px"}}>
                      {!SaveExpProcessing || <Spinner type={SpinnerType.large} hidden={false}></Spinner>}
                    </div>
                  </div>
                </div>                 
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm5 ms-md5 ms-lg5">
                      <TextField disabled={DisableForm} required={true} label="Experiment Name" errorMessage={ExperimentErrMsgs.ExperimentName} value={Experiment.Name} onChange={this.onChangeExperimentName}></TextField>
                    </div>
                    <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                      <Dropdown 
                        disabled={DisableForm} 
                        required={true} 
                        errorMessage={ExperimentErrMsgs.ProjectId}
                        label="Project / Study" 
                        selectedKey = {Experiment.ProjectId}                      
                        options={Projects?.map((p, index)=>{return {key: p.Id, text: p.Name}})}
                        onChange={this.onProjectChange}></Dropdown>
                    </div>
                    <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                      <FLatDatePickr viewForm={DisableForm} required={true} showNonFormLabel={false} labelHead="Start Date" dateInput={expDate} updateFunc={this.onSelectExpDate}></FLatDatePickr>
                      {ExperimentErrMsgs.StartDate?this.renderErrorMsgForField(ExperimentErrMsgs.StartDate,'StartDate'):''}
                    </div> 
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                      <Label className={'requiredLabel'}>Experiment Owner</Label>
                      <div style={{backgroundColor: "#fff"}}>
                        <ExperimentOwnerPicker                                              
                          viewForm={DisableForm}
                          required={true}
                          description={'Set an experiment owner'}
                          placeholderTxt={'Start typing the name to search'}
                          property={'ExperimentOwner'}
                          updatePeoplePickerChange={this.onSelectExperimentOwner}
                          people={Experiment.Owner ? Experiment.Owner : []}
                        />
                      </div>
                      {ExperimentErrMsgs.ExperimentOwner?this.renderErrorMsgForField(ExperimentErrMsgs.ExperimentOwner,'ExperimentOwner'):''}
                    </div>
                  </div>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                      <TextField disabled={DisableForm} label="Description" value={Experiment.Description} onChange={this.onChangeExperimentDesc}></TextField>
                    </div>                     
                  </div>              
                </div>           
            </div>
            <div className="ms-Grid-row" style={{minHeight:"20px"}}></div>
            <div className="ms-Grid-row" style={{
              boxShadow: "rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px, rgba(0, 0, 0, 0.11) 0px 0.3px 0.9px 0px", 
              width: "90%",
              overflow: "auto",
              margin: "0 auto",
              padding:"10px 0px 10px 10px"}}>
              <div className="ms-Grid" dir="ltr" style={{padding:"0px", width: "99%", textAlign:"left"}}>
                <div className="ms-Grid-row"style={{width:"100%",overflow:"auto",margin:"0 auto",paddingBottom:"10px"}}>                  
                  <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4" style={{padding:"0px"}}>
                    <div style={{fontSize: "12pt", fontWeight: "bold", textAlign:"left"}}>
                      Activities
                    </div>
                  </div>
                  {
                      Utils.strEqualsCI(Mode, "add") ? "" : 
                      <div className="ms-Grid-col ms-sm8 ms-md8 ms-lg8"  style={{padding:"0px"}}>                      
                        <div style={{float:"right", marginLeft:"15px"}} title={MessageText.DeleteActToolTip}>
                          <PrimaryButton  text="Delete Activity" disabled={ExperimentActivities.length ===0 || (SelectedActivities.length===0) || DisableDelete} onClick={this.onClickDeleteMulActivities}></PrimaryButton>
                        </div>
                        <div style={{float:"right", paddingLeft:"15px"}}>
                          <PrimaryButton text="Clone Activity" disabled={DisableAdd ||ExperimentActivities.length ===0 || (SelectedActivities.length!==1)} onClick={this.onClickCloneActivity}></PrimaryButton>
                        </div>
                        <div style={{float:"right", paddingLeft:"15px"}}>
                          <PrimaryButton text="Edit Activity" disabled={ExperimentActivities.length ===0||(SelectedActivities.length!==1)} onClick={this.onClickEditActivity} ></PrimaryButton>
                        </div>
                        <div style={{float:"right", paddingLeft:"15px"}}>
                          <PrimaryButton text="View Activity" disabled={ExperimentActivities.length ===0||(SelectedActivities.length!==1)} onClick={this.onClickViewActivity}></PrimaryButton>
                        </div>
                        <div style={{float:"right", paddingLeft:"15px"}}>
                          <PrimaryButton text="Add Activity" disabled={DisableAdd || ShowAddActivity==="Add"} onClick={this.onClickAddActivity}></PrimaryButton>
                        </div>
                      </div>
                  }
                  {ShowDialog === "None"?'':this.renderConfirm()}
                </div>
                <div className="ms-Grid-row">
                  { FormActionMsg?this.renderTimmerMessages(FormActionMsg):""}
                  {FormActionLoading?this.loadSpinner(InfoMessage,FormActionLoading):''}
                </div>
                <div className="ms-Grid-row"style={{width:"100%",overflow:"auto",margin:"0 auto",paddingBottom:"10px"}}>                  
                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12" style={{padding:"0px"}}>
                  {
                    ExperimentActivities.length > 0 ? 
                      <DetailsList
                        items= {ExperimentActivities} //{this.sortActivities(ExperimentActivities)}
                        columns={this.getActivityColumns()}
                        constrainMode={ ConstrainMode.horizontalConstrained }
                        checkboxVisibility={CheckboxVisibility.always}
                        onShouldVirtualize={ () => false }
                        selection={this._selection} 
                        selectionMode={SelectionMode.multiple}  
                        selectionPreservedOnEmptyClick={false}
                        styles={detailsListStyles}            
                      ></DetailsList> : <span>{InfoMessage}</span>
                  }
                  </div>
                </div>                
              </div>
            </div>
            <div className="ms-Grid-row" style={{minHeight:"20px"}}></div>
            <div className="ms-Grid-row" style={{
              boxShadow: "rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px, rgba(0, 0, 0, 0.11) 0px 0.3px 0.9px 0px", 
              width: "90%",
              overflow: "auto",
              margin: "0 auto",
              padding:"10px 0px 00px 10px"}}>
              {
                (ShowAddActivity==="Add") ? 
                <div className="ms-Grid" dir="ltr" style={{padding:"0px", width: "99%", textAlign:"left"}}>
                  <div className="ms-Grid-row"style={{width:"100%",overflow:"auto",margin:"0 auto",paddingBottom:"0px"}}>                  
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12" style={{padding:"0px"}}>
                      <CreateActivityForm key={"Create"+FormId} handleActivityActions={this.handleActivityActions} NotPopActions ={true} 
                      ExpData={{ExpId:EID,ExpOwnerEmail:Experiment.Owner[0]?.Email,ExpStartDate:Experiment.StartDate,
                      ExperimentNotSaved:ExperimentNotSaved}}/>
                    </div>
                  </div>                               
                </div> : ""
              }
              {
                (ShowAddActivity==="Edit" ||ShowAddActivity==="View") ? 
                <div className="ms-Grid" dir="ltr" style={{padding:"0px", width: "99%", textAlign:"left"}}>
                  <div className="ms-Grid-row"style={{width:"100%",overflow:"auto",margin:"0 auto",paddingBottom:"0px"}}>                  
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12" style={{padding:"0px"}}>
                      <EditActivityForm key={"Edit"+FormId} Id={AID} viewForm={ShowAddActivity==="View"?true:false} 
                      handleActivityActions={this.handleActivityActions} NotPopActions ={true} 
                      ExpData={{ExpId:EID,ExpOwnerEmail:Experiment.Owner[0]?.Email,ExpStartDate:Experiment.StartDate,ExperimentNotSaved:ExperimentNotSaved}}/>
                    </div>
                  </div>                               
                </div> : ""
              }
            </div>
          </div>
        }
        {RedirectUri ? <Redirect to={RedirectUri}></Redirect> : ""}
      </div>
    );
  }
  sortActivities = (activities:any) :any[] =>{
    var sortedItems:any[] = [];
    sortedItems =  _.orderBy(activities,(a,b) =>{
      return new Date(a.ActivityDate);
    });
    return sortedItems;
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
  loadSpinner = (labelTxt:string,isLoading:boolean) => {
    return (
        <div className="centeredContainer">
            <BlockingSpinner label={labelTxt} hideDialog={!isLoading}/>
        </div>
    );
  }
  handleActivityActions = (property:any,actionType:"LoadForm"|"CreatedActivity"|"DeleteActivity"|"ClonedActivity"|"UpdatedActivity"|"CloseForm"|"ViewToEdit") => {
    switch (actionType) {
      case "LoadForm":      
        this.setState({
          FormActionLoading:false,
          FormAction:"LoadForm",
          InfoMessage: MessageText.NoActivities
        });
        break;
      case "CloseForm":      
        this.setState({
          ShowAddActivity: "None", 
          FormActionLoading:false,
          FormAction:"LoadForm",
          InfoMessage: MessageText.NoActivities
        });
        break;
      case "CreatedActivity":       
        this.reloadActivityGrid();
        this.setState({
          ShowAddActivity: "None", 
          // FormActionLoading:false,
          FormAction:"ShowMessage",
          FormActionMsg:"Created Activity Successfully!"
        });
        setTimeout(() => {
              this.setState({ FormActionMsg: '' })
        }, 2500);
        break;
      case "UpdatedActivity":       
        this.reloadActivityGrid();
        this.setState({
          ShowAddActivity: "None", 
          // FormActionLoading:false,
          FormAction:"ShowMessage",
          FormActionMsg:"Updated Activity Successfully!"
        });
        setTimeout(() => {
              this.setState({ FormActionMsg: '' })
        }, 2500);
        break;
      case "ClonedActivity":       
        this.reloadActivityGrid();
        this.setState({
          ShowAddActivity: "Edit", 
          // FormActionLoading:false,
          AID: parseInt(property), 
          FormAction:"ShowMessage",
          FormActionMsg:"Cloned Activity Successfully. Opened Edit activity form of the cloned activity"
        });
        setTimeout(() => {
              this.setState({ FormActionMsg: '' })
        }, 2500);
        break;
      case "DeleteActivity":       
        this.reloadActivityGrid();
        this.setState({
          ShowAddActivity: "None", 
          // FormActionLoading:false,
          AID: parseInt(property), 
          FormAction:"ShowMessage",
          FormActionMsg:"Deleted Activity Successfully.  "
        });
        setTimeout(() => {
              this.setState({ FormActionMsg: '' })
        }, 2500);
        break;
        case "ViewToEdit":
          this.setState({
            ShowAddActivity: "Edit"
          });
        break;
      default:
        break;
    }
  }
  reloadActivityGrid() {
    const {Experiment} = this.state;
    this.setState({
      FormActionLoading: true,
      InfoMessage: MessageText.ReloadActivity,
    });
    ExperimentService.getActivitiesForExp(Experiment.Id).then(response => {                      
      if (response) { 
        let _activities: IActivityGridModel[] = [];
          _activities = response as IActivityGridModel[];
        this.setState({
          PlanexLoading: false,
          InfoMessage:'',
          FormActionLoading:false,
          ExperimentActivities: this.reduecActivityArray([..._activities])
        });
      }
    });
  }
  renderTimmerMessages(msg:string){
    return(
        <MessageBar messageBarType={MessageBarType.success} className={"formupdateInfo"}>
            {msg}
        </MessageBar>
    );
  }
  deleteMulActivities = () => {
    const {SelectedActivities,Experiment} = this.state;
    if (SelectedActivities.length>0) {
      let notes = "Delete activities from experiment " + Experiment.Id+" by "+this.context.userName;
      let idArray = _.map(SelectedActivities,'ActivityId');
      this.setState({
        InfoMessage: MessageText.DeleteActivity,
        FormActionLoading: true,
        ShowDialog:"None",
        ShowAddActivity:"None"
      });
      ExperimentService.deleteActivities({ActivityIds:idArray,Notes:notes}).then((data) => { 
        this.reloadActivityGrid();
        this.setState({
            ShowAddActivity:"None",
            Mode: "EDIT",
            InfoMessage: '',
            FormActionLoading: false,
          }); 
      });
    }
    else{
      this.setState({
        ShowDialog:"None"
      });
    }
  }
  onClickDeleteMulActivities = () =>{
    const {ShowAddActivity} = this.state;
    let flag:boolean = true;
    if(flag){
      flag = false;
      this.setState({ 
        ShowDialog:"DeletePrompt"
      });
    }
  }
  addActClickState = () =>{
    this.setState({
      ShowAddActivity: "Add",
      FormActionLoading:true,
      FormAction:"LoadForm",
      ShowDialog:"None",
      FormId: uuidv4(),
      InfoMessage: MessageText.LoadingActivitForm,
    });
  }
  onClickAddActivity=(ev: any)=>{
    const {ShowAddActivity} = this.state;
    let flag:boolean = true;
    if(ShowAddActivity ==="Edit"){
      flag = false;
      this.setState({ 
        ShowDialog:"UnsavedEditForm"
      });
    }
    if(flag){
     this.addActClickState();
    }
  }
  viewActClickState = () =>{
    const {SelectedActivities} = this.state;
    let acitvityId =SelectedActivities.length>0?SelectedActivities[0].ActivityId:0;
    this.setState({
      ShowAddActivity: "View",
      FormActionLoading:true,
      AID:acitvityId,
      ShowDialog:"None",
      FormAction:"LoadForm",
      FormId: uuidv4(),
      InfoMessage: MessageText.LoadingActivitForm,
    });
  }
  onClickViewActivity=(ev: any)=>{   
    const {ShowAddActivity} = this.state;
    let flag:boolean = true;
    if(ShowAddActivity ==="Edit" || ShowAddActivity ==="Add"){
      flag = false;
      this.setState({ 
        ShowDialog:"UnsavedAddEditFormViewClick"
      });
    }
    if(flag){
      this.viewActClickState();
    }
  }
  editActClickState = () =>{
    const {SelectedActivities} = this.state;
    let acitvityId =SelectedActivities.length>0?SelectedActivities[0].ActivityId:0;
    this.setState({
      ShowAddActivity: "Edit",
      FormActionLoading:true,
      AID:acitvityId,
      ShowDialog:"None",
      FormAction:"LoadForm",
      FormId: uuidv4(),
      InfoMessage: MessageText.LoadingActivitForm,
    });
  }
  onClickEditActivity=(ev: any)=>{    
    const {ShowAddActivity} = this.state;
    let flag:boolean = true;
    if(ShowAddActivity ==="Add"){
      flag = false;
      this.setState({ 
        ShowDialog:"UnsavedAddForm"
      });
    }
    if(flag){
      this.editActClickState();
    }
  }
  cloneActClickState = () =>{
    const {SelectedActivities,Experiment} = this.state;
    let acitvityId =SelectedActivities.length>0?SelectedActivities[0].ActivityId:0;
    this.setState({
      FormActionLoading:true,
      FormAction:"LoadForm",
      ShowAddActivity: "None",
      ShowDialog:"None",
      InfoMessage: MessageText.CloneActivitForm,
    });
    let jsonObj:any = {ActivityId:acitvityId};
    ExperimentService.CloneActivity(jsonObj).then((data:any) => {
      if(data && data.id){
        this.reloadActivityGrid();
        this.setState({
          ShowAddActivity: "Edit",
          FormActionLoading:true,
          AID:data.id,
          FormAction:"LoadForm",
          FormId: uuidv4(),
          InfoMessage: MessageText.LoadingActivitForm,
        });
      }
    }).catch((error) =>{
        console.log("Clone act error", error);
    });   
  }
  onClickCloneActivity=(ev: any)=>{
    const {ShowAddActivity} = this.state;
    let flag:boolean = true;
    if(ShowAddActivity ==="Add" || ShowAddActivity ==="Edit"){
      flag = false;
      this.setState({ 
        ShowDialog:"UnsavedAddEditForm"
      });
    }
    if(flag){
      flag = false;
      this.setState({ 
        ShowDialog:"CloneActConfirmation"
      });
    }
    if(flag){
        this.cloneActClickState();
    }
  }
  toggleHideDialog = () =>{
    this.setState({
      ShowDialog:"None"
    });
  }
  confirmationAction = () =>{
    const {ShowDialog} = this.state;
    switch (ShowDialog) {
      case "UnsavedEditForm":
        this.addActClickState();
        break;
      case "UnsavedAddForm":
        this.editActClickState();
        break;
      case "UnsavedAddEditFormViewClick":
       this.viewActClickState();
        break;
      case "UnsavedAddEditForm":
        this.setState({
          ShowAddActivity:"None",
          ShowDialog:"CloneActConfirmation"
        });
        break;
      case "CloneActConfirmation":
        this.cloneActClickState();
        break;
      case "CloseExpForm":
          this.setState({RedirectUri: "/Home"});
        break;
      case "DeletePrompt":
          this.deleteMulActivities();
        break;
      default:
        this.toggleHideDialog();
        break;
    }
  }
  renderConfirm =():JSX.Element =>{
    const dialogContentProps = {
      type: DialogType.normal,
      title: 'Missing Subject',
      closeButtonAriaLabel: 'Close',
      subText: 'Do you want to send this message without a subject?',
    };
    const {ShowDialog} = this.state;
    var hideDialog:boolean =true;
    switch (ShowDialog) {
      case "None":
        dialogContentProps.title ='';
        dialogContentProps.subText ='';
        hideDialog = true;
        break;
      case "UnsavedEditForm":
        dialogContentProps.title ='Unsaved Edit Form';
        dialogContentProps.subText = MessageText.UnsavedEditForm;
        hideDialog = false;
        break;
      case "UnsavedAddForm":
        dialogContentProps.title ='Unsaved Add Form';
        dialogContentProps.subText = MessageText.UnsavedAddForm;
        hideDialog = false;
        break;
      case "UnsavedAddEditFormViewClick":
        dialogContentProps.title ='Unsaved Add/Edit Form';
        dialogContentProps.subText = MessageText.UnsavedAddEditFormViewClick;
        hideDialog = false;
        break;
      case "UnsavedAddEditForm":
        dialogContentProps.title ='Unsaved Add/Edit Form';
        dialogContentProps.subText = MessageText.UnsavedAddEditForm;
        hideDialog = false;
        break;
      case "CloneActConfirmation":
          dialogContentProps.title ='Clone?';
          dialogContentProps.subText = MessageText.CloneActConfirmation;
          hideDialog = false;
          break;
      case "CloseExpForm":
          dialogContentProps.title ='Unsaved Form';
          dialogContentProps.subText = MessageText.UnsavedChangesLost;
          hideDialog = false;
          break;
      case "DeletePrompt":
          dialogContentProps.title ='Delete?';
          dialogContentProps.subText = MessageText.DeleteActConfirm;
          hideDialog = false;
          break;
      default:
        break;
    }
    return (
        <>
        <Dialog
          hidden={hideDialog}
          onDismiss={this.toggleHideDialog}
          dialogContentProps={dialogContentProps}
          modalProps={{
              isBlocking: true,
              // styles: {main: {maxWidth: 450}},
          }}
        >
          <DialogFooter>
            <PrimaryButton onClick={this.confirmationAction.bind(this)} text="Yes" />
            <DefaultButton onClick={this.toggleHideDialog.bind(this)} text="No" />
          </DialogFooter>
        </Dialog>
        </>
    );
  }
  componentDidMount(){
    this.loadMasterData().then((res)=>{
      const {FormMode, ExpId} = this.props;    
      switch(FormMode.toUpperCase()){
        case "ADD":
          this.loadAddForm();
          break;
        case "EDIT": 
          this.loadEditForm(ExpId);
          this.setState({
            Mode: "edit",
            EID: ExpId,
            TopLabel: "Edit Experiment"
          });
          break;
      }
    });
  }
  componentDidUpdate(prevProps:IExperimentProps, prevState:IExperimentState) {
    const {Experiment} = this.state;
    if(this.props.ExpId!==prevProps.ExpId && this.props.ParentId!==prevProps.ParentId){     
      this.loadEditForm(this.props.ExpId);
      this.setState({
        Mode: "edit",
        FormActionLoading:true,
        InfoMessage:"Loading...",
        EID: this.props.ExpId,
        TopLabel: "Edit Experiment"
      });
    }
  }
  
  loadMasterData=()=>{
    return new Promise((resolve, reject) => {
      ExperimentService.getProjects().then((res) => {
        let _projects = res.data as IProject[];
        this.setState({
          Projects: _projects
        });
        resolve(true);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });   
    });
  }
  validateForm=()=>{
    const {Mode, Experiment} = this.state;
    if(Utils.strEqualsCI(Mode, "EDIT")){
      //validate if experiment is active
      if(Experiment.StatusId!==1){
        this.setState({
          DisableForm: true,
          DisableAdd: true,
          HeaderMessage: MessageText.DeletedExperiment,
          HeaderMessageType: MessageBarType.error
        });
      }
      else{
        var currActivityDate = moment(Experiment.StartDate);
        var currDate = moment(new Date());
        var diffDates = currDate.diff(currActivityDate,'days');
        //validate start date
        if(diffDates>0){
          this.setState({
            DisableForm: true,
            HeaderMessage: MessageText.NoEditPastExp,
            HeaderMessageType: MessageBarType.error
          });
        }
        //validate permissions
        if(!this.context.isAdmin && !Utils.strEqualsCI(this.context.userName, Experiment.Owner[0].Email)){         
          this.setState({
            DisableForm: true,
            DisableAdd: true,
            HeaderMessage: MessageText.NoAdminExpOwner,
            HeaderMessageType: MessageBarType.error
          });
        }
      }
    }
  }
  setCurrentUserAsOwner = ():IUserPersonaField =>{
    let currUserAsOwner:IUserPersonaField = {} as IUserPersonaField;
    currUserAsOwner.DisplayName = this.context.name;
    currUserAsOwner.Email = this.context.userName;
    return currUserAsOwner;
  }
  loadAddForm=()=>{   
    const {Experiment} = this.state;
    Experiment.Owner = [] as IUserPersonaField[];
    let curUserProfile = this.setCurrentUserAsOwner();
    Experiment.Owner.push(curUserProfile);
    Experiment.StartDate = new Date(now);
      this.setState({
        Mode: "add",
        Experiment,
        PlanexLoading: false
      });  
  }
  loadEditForm=(expId: number)=>{
    const promises=[];
    promises.push(ExperimentService.getExperiment(expId));
    promises.push(ExperimentService.getActivitiesForExp(expId));
    Promise.all(promises)
        .then(responses => {     
          if(responses[0]!=null){
            if (responses && responses.length > 0) {            
              let _experiment = responses[0] as IExperiment;
              let _activities: IActivityGridModel[] = [];
              if(responses.length>1){
                _activities = responses[1] as IActivityGridModel[];                  
              }            
              this.setState({
                PlanexLoading: false,
                FormActionLoading:false,
                InfoMessage:'',
                Experiment: _experiment,
                ExperimentActivities: this.reduecActivityArray([..._activities]),
                PreviousStartDate: _experiment.StartDate
              }, () => {
                this.validateForm();
              });
            }
          }
          else{
            this.setState({
              PlanexLoading: false,
              DisableForm: true,
              HeaderMessage: MessageText.NoExperimentWithId,
              HeaderMessageType: MessageBarType.error
            });
          }
        })
        .catch(error => {
          console.log(error);
      });
  }
  reduecActivityArray=(activities: IActivityGridModel[])=>{
    let groupedArr: IActivityGridModel[]=[];    
    if(activities.length>0){      
      activities.forEach((item, index)=>{          
          let groupedItem = groupedArr.filter(i => {return i.ActivityId==item.ActivityId});
          if(groupedItem.length!==1){
              groupedArr.push(item);
          }
          else{
            groupedItem[0].ShiftName = this.checkAndReduceField(groupedItem[0],"ShiftName",item.ShiftName);
            groupedItem[0].LocationName = this.checkAndReduceField(groupedItem[0],"LocationName",item.LocationName);
            groupedItem[0].EquipmentName = this.checkAndReduceField(groupedItem[0],"EquipmentName",item.EquipmentName);
          }
      });      
    }
    return this.sortActivities(groupedArr);  
  }      
  checkAndReduceField=(item: IActivityGridModel, fieldName: string, fieldValue: string): string=>{    
    switch(fieldName){
      case "ShiftName": {        
        return (item.ShiftName != null && item.ShiftName.split("|").indexOf(fieldValue)<0) ? item.ShiftName + "|" + fieldValue : item.ShiftName;
      }
      case "LocationName": {
        return (item.LocationName != null && item.LocationName.split("|").indexOf(fieldValue)<0) ? item.LocationName + "|" + fieldValue : item.LocationName;
      }
      case "EquipmentName": {
        return (item.EquipmentName != null && item.EquipmentName.split("|").indexOf(fieldValue)<0) ? item.EquipmentName + "|" + fieldValue : item.EquipmentName;
      }
      default:
        return "";
    }
  }
  _onItemSelectionChange = () => {
    const {ExperimentActivities} = this.state;    
    let selIndices = this._selection.getSelectedIndices();        
    let _activities: IActivityGridModel[]=[];
    let _disableDelete = false;
    selIndices.map((item: number)=>{
      _activities.push(ExperimentActivities[item]);
      let _currActivityDate = moment(ExperimentActivities[item].ActivityDate);
      let _currDate = moment(new Date());
      let _diffDates = _currDate.diff(_currActivityDate,'days');
      if(_diffDates > 0){
        _disableDelete=true;
      }
    });
    this.setState({
      SelectedActivities: _activities,
      DisableDelete: _disableDelete
    });
  }
  onChangeExperimentName=(ev: any)=>{
    const _experiment = this.state.Experiment;
    _experiment.Name = ev.target.value;
    this.setState({Experiment: _experiment, ExperimentNotSaved: true});
  }
  onProjectChange=(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number)=>{
    if(option){
      const _experiment = this.state.Experiment;
      _experiment.ProjectId = parseInt(option.key.toString());
      this.setState({Experiment: _experiment, ExperimentNotSaved: true});
    }
  }
  onSelectExpDate = (updatedDate:any) => {    
    if (updatedDate){
      const _experiment = this.state.Experiment;
      const _previousStartDate = _experiment.StartDate;
      _experiment.StartDate = updatedDate as Date;
      this.setState({
        Experiment: _experiment,
        PreviousStartDate: _previousStartDate,
        ExperimentNotSaved: true
      });
    }
  };
  onSelectExperimentOwner = (items:IUserPersonaField[], property:string) => {   
      const _experiment = this.state.Experiment;
      _experiment.Owner = items.length>0?items:[];
      this.setState({Experiment: _experiment, ExperimentNotSaved: true});
  }
  onChangeExperimentDesc=(ev: any)=>{
    const _experiment = this.state.Experiment;
    _experiment.Description = ev.target.value;
    this.setState({Experiment: _experiment, ExperimentNotSaved: true});
  }
  onDeleteExperiment=(ev: any)=>{
    let _promptValue = window.confirm(MessageText.DeleteExptConfirm);  
    if(_promptValue){
      
    }
  }
  onCloseExperiment=(ev: any)=>{
    const {ExperimentNotSaved,ShowAddActivity} = this.state;
    if(ExperimentNotSaved || ShowAddActivity ==="Edit" || ShowAddActivity ==="Add"){ 
      this.setState({ 
        ShowDialog:"CloseExpForm"
      });
    }  
    else{
      this.setState({RedirectUri: "/Home"});
    }  
  }
  onSaveExperiment=(ev: any)=>{
    ev.preventDefault();
    const mode = this.state.Mode;    
    if(Utils.strEqualsCI(mode, "ADD")){
      const {Experiment} = this.state;
      let validatonObj:IValidationObj = validateExpFields(Experiment);
      if (validatonObj.isValid) {
        this.setState({
          SaveExpProcessing: true,

        });
        ExperimentService.addExperiment(Experiment).then((data) => {
          const _experiment = this.state.Experiment;
          _experiment.Id = data.output.ExperimentId;
          _experiment.StatusId = 1;
            this.setState({
              Experiment: _experiment,
              EID: _experiment.Id,
              Mode: "EDIT",
              SaveExpProcessing: false,
              ExperimentErrMsgs: validatonObj.ErrorMsgs,
              InfoMessage: MessageText.NoActivities,
              RedirectUri: "/PlanExperiment?id=" + data.output.ExperimentId,
              TopLabel: "Edit Experiment",
              ExperimentNotSaved: false,
              HeaderMessage: MessageText.ExptDetailsSaved,
              HeaderMessageType: MessageBarType.success,
              // FormId:uuidv4()
            });
        })
      .then(()=>{
        this.validateForm();
        });
      }
      else{
          this.setState({
            ExperimentErrMsgs: validatonObj.ErrorMsgs,
          });
      }
    }
    else if(Utils.strEqualsCI(mode, "EDIT")){
      const {Experiment} = this.state;
      let validatonObj:IValidationObj = validateExpFields(Experiment);
      if (validatonObj.isValid) {
        this.setState({
          SaveExpProcessing: true,
        });        
        Experiment.UpdateActivities = Experiment.StartDate !== this.state.PreviousStartDate;
        ExperimentService.updateExperiment(Experiment).then((data) => {
          console.log(data);
            if(data.length > 0){
              let _activities = data[0] as IActivityGridModel[];
              this.setState({
                Mode: "EDIT",
                SaveExpProcessing: false,
                ExperimentActivities: this.reduecActivityArray([..._activities]),
                ExperimentNotSaved: false,
                FormId:uuidv4()
              });
            }
            else{
              this.setState({
                Mode: "EDIT",
                SaveExpProcessing: false,
                ExperimentNotSaved: false
              });
            } 
      })
      .then(()=>{
        this.validateForm();
        });
      }
    } 
       
  }  
  onDismissHeaderMessage=(ev: any)=>{
    this.setState({HeaderMessage: ""});
  }
  onClickDeleteExp = () =>{
    let _hideDeleteDialog = this.state.HideDeleteDialog;
    this.setState({
      HideDeleteDialog: !_hideDeleteDialog,
      DeleteNotes: ""
    }) 
  }
  onChangeDeleteNotes=(ev: any)=>{
    this.setState({DeleteNotes: ev.target.value})
  }
  onClickDeleteConfirmation= () =>{
    const {DeleteNotes} = this.state;
    if(DeleteNotes.trim().length > 0){
        let notesWithUserProfile = DeleteNotes +" - Deleted by " + this.context.userName; 
        ExperimentService.deleteExperiment(this.state.Experiment.Id, notesWithUserProfile)
        .then(response => {
            this.setState({
              DeleteNotes:"", 
              HideDeleteDialog:true,  
              DisableForm: true,
              HeaderMessage: "Experiment deleted successfully. " + MessageText.DeletedExperiment,
              HeaderMessageType: MessageBarType.error
            });
        }).catch(error => {
            this.setState({
                HideDeleteDialog: true,
                HeaderMessage:AppConfig.ActivityForm.DeleteErrorMessage + error
            });
            console.log(error);
        });         
    }
    else {
      this.setState({HideDeleteDialog:false, DeleteErrorMessage: MessageText.DeleteNotesError});
    }
  }
  onClickCloneExperiment=(ev: any)=>{
    const {HideCloneDialog} = this.state;
    this.setState({
      HideCloneDialog:!HideCloneDialog
    });
  }
  onClickConfirmCloneExperiment=(ev: any)=>{
    const {HideCloneDialog, Experiment} = this.state;
    this.setState({
      HideCloneDialog:!HideCloneDialog,
      FormActionLoading:true,
      InfoMessage:MessageText.CloningExpLoaderTxt
    });    
    ExperimentService.cloneExperiment(Experiment.Id).then((res)=>{
      const _url = "/PlanExperiment?id=" + res.CloneExpId +"&ParentId="+ Experiment.Id;
      this.setState({
        RedirectUri: _url,
        DisableForm:false,
        InfoMessage:'Loading...',
        HeaderMessageType:MessageBarType.success,
        HeaderMessage:MessageText.CloneSuccessMessage});
      });
  }
  getActivityColumns=():IColumn[]=>{
    let _columns = [
      {
        key: "ActivityDate",
        name: "Date",
        fieldName: "ActivityDate",
        minWidth: 90,
        maxWidth: 110,
        onRender: (item: IActivityGridModel) => {
          return <div>{moment.utc(item.ActivityDate).format("MM/DD/YYYY")}</div>;
        },
      },
      {
        key: "ActivityName",
        name: "Activity Name",
        fieldName: "ActivityName",
        minWidth: 200,
        maxWidth: 250,
      },      
      {
        key: "ShiftName", 
        name: "Shift(s)",
        fieldName: "ShiftName",
        minWidth: 150,
        maxWidth: 180,
        onRender: (item: IActivityGridModel) => {
          if(!item.ShiftName){
              return <span></span>;
          }
          else{
              return (<div>
                  { item.ShiftName.split("|").map((eq,key)=>{return <div key={key}>{eq}</div>})}
                  </div>
              );
          }
        }
      },
      {
        key: "LocationName",
        name: "Location(s)",
        fieldName: "LocationName",
        minWidth: 150,
        maxWidth: 180,
        onRender: (item: IActivityGridModel) => {
          if(!item.LocationName){
              return <span></span>;
          }
          else{
              return (<div>
                  { item.LocationName.split("|").map((eq,key)=>{return <div key={key}>{eq}</div>})}
                  </div>
              );
          }
        }
      },      
      {
        key: "EquipmentName",
        name: "Equipment(s)",
        fieldName: "EquipmentName",
        minWidth: 150,
        maxWidth: 180,
        onRender: (item: IActivityGridModel) => {
          if(!item.EquipmentName){
              return <span></span>;
          }
          else{
              return (<div>
                  { item.EquipmentName.split("|").map((eq,key)=>{return <div key={key}>{eq}</div>})}
                  </div>
              );
          }
        }
      },
      {
        key: "BookedForName",
        name: "Person",
        fieldName: "BookedForName",
        minWidth: 200,
        maxWidth: 220,
      },
      {
        key: "ActivityDescription",
        name: "Description",
        fieldName: "ActivityDescription",
        minWidth: 200,
        maxWidth: 250,
      },
    ];
    return _columns;
  }
}

