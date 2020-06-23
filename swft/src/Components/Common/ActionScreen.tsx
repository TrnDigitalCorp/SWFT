import * as React from 'react';
import BlockingDialog from './dialogs/BlockingDialog';
import {Redirect} from 'react-router-dom';
import {Icon} from 'office-ui-fabric-react';
import ModalDialog from './dialogs/ModalDialog';
import {PrimaryButton} from 'office-ui-fabric-react/lib/Button';

import './ActionScreen.css';
interface IActionScreenProps {
  subText:string;
  dialogTitle:string;
  actionBtnTxt:string;
  showModal:boolean;
  isBlocking:boolean;
  handleAction?:any;
  actionType:'Update'|'Delete'|'Create'|'Clone'|'Denied'|'Nothing'|'Failed';

  isActionBtnVisible?:boolean;
  leftBtnText?:string;
  leftBtnURI?:any;
  rightBtnText?:string;
  rightBtnURI?:any;

  shouldDefaultRedirect?:boolean;
  timmer?:number;
  defaulltRedirectURI?:any;
}
interface IActionScreenState{
    isRedirect:boolean;
    redirectAction:'left'|'right';
}
export default class ActionScreen extends React.Component<IActionScreenProps,IActionScreenState> {
  constructor(props:IActionScreenProps) {
    super(props);
    this.state ={
      isRedirect:false,
      redirectAction:"left"
    };
  }
  componentDidMount() {
    setTimeout(() => {
      if(this.props.shouldDefaultRedirect){
          this.setState({ isRedirect: true })
      }
    }, this.props.timmer);
  }
  

  getIcon = () :JSX.Element => {
    switch (this.props.actionType) {
      case "Update":
        return(
            <Icon iconName="CompletedSolid"
              className="actionIcon greenIcon"
            />
        );
      case "Nothing":        
          return(
            <Icon iconName="IncidentTriangle"
              className="actionIcon"
            />
        );;
      case "Failed":        
          return(
            <Icon iconName="StatusErrorFull"
              className="actionIcon redIcon"
            />
        );;
      case "Denied":        
          return(
            <Icon iconName="Blocked2Solid"
              className="actionIcon redIcon"
            />
        );;
      case "Delete":        
          return(
            <Icon iconName="Delete"
              className="actionIcon themeIcon"
            />
        );;
      case "Create":        
          return(
            <Icon iconName="CompletedSolid"
              className="actionIcon greenIcon"
            />
        );;
      case "Clone":        
          return(
            <Icon iconName="Copy"
              className="actionIcon themeIcon"
            />
        );;
    
      default:
          return(
            <Icon iconName="StatusErrorFull"
              className="actionIcon redIcon"
            />
        );;
    }
  }
  handlRedirectionClick=(event:any):void =>{
    let action = event.currentTarget.dataset.action;
    switch (action) {
      case "left":
          this.setState({
            isRedirect:true,
            redirectAction:"left"
          });
        break;
      case "right":
        this.setState({
          isRedirect:true,
          redirectAction:"right"
        });
        break;    
      default:
        break;
    }
  }
  redirectClone = (redirectURI:string) =>{
    window.location.href = window.location.origin+redirectURI;
  }
  public render() {
    const {dialogTitle,subText,isActionBtnVisible,leftBtnText,
      shouldDefaultRedirect,rightBtnURI,rightBtnText,defaulltRedirectURI,isBlocking,leftBtnURI} =this.props;
      const {redirectAction} = this.state;
    return (
      <div>
        <ModalDialog
            showModal={this.props.showModal}
            isBlocking={isBlocking} 
            >
            <div className="actionModal" dir="ltr">
              <div className={'actionIcon'}>
                  {this.getIcon()}
                </div>
                <div className={"actionHeading"}>
                  <h2>{dialogTitle}</h2>
                    <p>
                      <span>
                        {subText}
                      </span>
                    </p>
                </div> 
                {isActionBtnVisible && (
                <div className={"actionButtonsDiv"}>
                  <PrimaryButton
                    key="left"
                    text={leftBtnText}
                    data-action={'left'}
                    onClick={this.handlRedirectionClick}
                  />
                  <PrimaryButton
                    key="right"
                    text={rightBtnText}
                    data-action={'right'}
                    onClick={this.handlRedirectionClick}
                  />
                </div> )}    
                {shouldDefaultRedirect && this.state.isRedirect && (
                    this.props.actionType==="Clone"?this.redirectClone(defaulltRedirectURI):<Redirect to={defaulltRedirectURI} />         
                )}         
                {!shouldDefaultRedirect && this.state.isRedirect && (
                    <Redirect to={redirectAction=="left"?leftBtnURI:rightBtnURI} />          
                )}         
              </div>
        </ModalDialog>
      </div>
    );
  }
}