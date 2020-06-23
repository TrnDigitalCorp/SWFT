import * as React from 'react';
import {Persona, PersonaSize,IPersonaStyles,IPersonaCoinStyles} from 'office-ui-fabric-react/lib/Persona';
import {Panel, PanelType} from 'office-ui-fabric-react/lib/Panel';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import {
    Pivot,
    PivotItem,
    PivotLinkFormat,
    IPivotStyles
} from 'office-ui-fabric-react/lib/Pivot';
import {Redirect, RouteComponentProps} from 'react-router-dom';

import {authProvider} from '../../authProvider';
import { IMainHeaderProps, IMainHeaderState } from './IMainHeader';

const pivotStyle:Partial<IPivotStyles> = {
    root: {textAlign: 'center'},
    linkIsSelected:{
        selectors: {
            '::before': {
                backgroundColor: 'white',
            },
        }
    }
};
const coinStyles:Partial<IPersonaCoinStyles>= {
    initials: {
        color: 'white!important',
    },
};
const personaStyles:Partial<IPersonaStyles> = {
    primaryText: {
        fontWeight: '600',
    },
    tertiaryText: {
        display: 'block',
    },
};
export class MainHeader extends React.Component<RouteComponentProps &IMainHeaderProps,IMainHeaderState> {
    constructor(props:RouteComponentProps & IMainHeaderProps) {
        super(props);
        this.state = {
            isOpen: false,
            selectedKey: '0',
            isNavigate:false
        };
    }
    componentDidMount() {
        const {selectedKey}: any = this.props;
        this.setState({
            selectedKey
        });
    }
    componentDidUpdate(prevProps:IMainHeaderProps, prevState:IMainHeaderState) {
        const {selectedKey}: any = this.props;
        if(this.state.selectedKey !==selectedKey){
            this.setState({
                selectedKey,
                isNavigate:false
            });
        }
    }
    handleUserInfoPanelClick = () => {
        this.setState(previous => {
            return {
                isOpen: !previous.isOpen,
            };
        });
    };
    logoutCall = () => {
        authProvider.logout();
    }
    handlePivotClick = (item:PivotItem|undefined):void=>{
        var itemProps:any = item?.props.headerButtonProps;
        var redirectURI:string = itemProps["data-linktext"] as string;
        this.setState({
            selectedKey: item?.props.itemKey,
            isNavigate:true
        });
        this.props.history.push(redirectURI);
        this.props.handleRedirection(item?.props.itemKey);
    }
    renderTertiaryText = () => {
        return (
            <ul className={'accountCntrlinks'}>
                <li>
                    <span className={'spanLink'} onClick={this.logoutCall}>
                        Sign out{' '}
                    </span>
                </li>
            </ul>
        );
    }
    render() {
        const {userDetail, appImageURL, appLogoText} = this.props;
        const {isOpen, selectedKey, isNavigate} = this.state;
        return (
            <>
                <header className="App-header">
                    <div className="row AppHeaderSection">
                        <div className="AppLogo">
                            {appImageURL ? (
                                <img
                                    src={appImageURL}
                                    alt="mainLogo"
                                    className={'AppLogoImage'}
                                />
                            ) : (
                                <div className={'MainAppLogoDiv'}>
                                    <div
                                        className={'AppLogoImg headerLogDiv'}
                                    ></div>
                                    <div style={{paddingLeft: "10px"}}>{appLogoText}</div>
                                </div>
                            )}
                        </div>
                        <div className="AppHeaderTxt">
                            <Pivot
                                aria-label="Main Navigation"
                                linkFormat={PivotLinkFormat.links}
                                styles={pivotStyle}
                                className={'Navigation'}
                                selectedKey={selectedKey||'0'}
                                onLinkClick={this.handlePivotClick.bind(this)}>
                                <PivotItem
                                    headerText="Home"
                                    headerButtonProps={{
                                        'data-order': 1,
                                        'data-title': 'Home',
                                        "data-linktext":'/Home'
                                    }}
                                    itemKey="0"
                                >
                                    {isNavigate?<Redirect to={'/Home'} />:''}
                                </PivotItem>
                                <PivotItem  headerButtonProps={{"data-linktext":'/PlanExperiment'}} headerText="Plan Experiment" itemKey="1">
                                    {isNavigate? <Redirect to={'/PlanExperiment'} />:''}
                                </PivotItem>
                                <PivotItem headerButtonProps={{"data-linktext":'/PlanActivity'}} headerText="Plan Lab Activity" itemKey="2">
                                    {isNavigate?<Redirect to={'/PlanActivity'} />:'' }
                                </PivotItem>
                                <PivotItem headerButtonProps={{"data-linktext":'/PlanOfficeSpace'}} headerText="Plan Office Usage" itemKey="3">
                                    {isNavigate?<Redirect to={'/PlanOfficeSpace'} />:'' }
                                </PivotItem>
                                <PivotItem headerButtonProps={{"data-linktext":'/Calendar'}} headerText="Calendar" itemKey="4">
                                    {isNavigate?<Redirect to={'/Calendar'} />:'' }
                                </PivotItem>
                                <PivotItem headerButtonProps={{"data-linktext":'/MyActivities'}} headerText="My Activities" itemKey="5">
                                    {isNavigate?<Redirect to={'/MyActivities'} />:'' }
                                </PivotItem>
                            </Pivot>
                        </div>
                        {userDetail && (
                            <div className="AppUserInfo">
                                <div
                                    className="AppUserInfoDiv"
                                    onClick={this.handleUserInfoPanelClick}
                                >
                                    <Persona
                                        coinSize={35}
                                        className={'infoBtnHeaderPerson'}
                                        secondaryText={userDetail.userName}
                                        text={userDetail.name}
                                        size={PersonaSize.size24}
                                        coinProps={{styles: coinStyles}}
                                        hidePersonaDetails={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                {userDetail && (
                    <Panel
                        headerText="My Account"
                        isOpen={isOpen}
                        isLightDismiss={true}
                        isBlocking={false}
                        type={PanelType.smallFixedFar}
                        onDismiss={this.handleUserInfoPanelClick}
                        closeButtonAriaLabel="Close"
                    >
                        <div
                            className={'accountHeader'}
                            style={{boxShadow: Depths.depth4}}
                        >
                            <Persona
                                coinSize={90}
                                className={'infoBtnHeaderPerson'}
                                secondaryText={userDetail.userName}
                                tertiaryText={'signout'}
                                showSecondaryText={true}
                                text={userDetail.name}
                                size={PersonaSize.size24}
                                coinProps={{styles: coinStyles}}
                                onRenderTertiaryText={this.renderTertiaryText}
                                styles={personaStyles}
                            />
                        </div>
                    </Panel>
                )}
            </>
        );
    }
}
