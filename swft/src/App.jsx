import React, {Component} from 'react';
import {AzureAD, AuthenticationState} from 'react-aad-msal';
import {authProvider} from './authProvider';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import {ActionButton} from 'office-ui-fabric-react';
import {initializeIcons} from '@uifabric/icons';
import { createBrowserHistory } from "history";

import './CSS/fabric.min.css';
import {MainApp} from './Main';
const history = createBrowserHistory();
initializeIcons();

class App extends Component {
    logoinCall = () => {
        authProvider.login();
    };
    render() {        
        return (
            <>
                <AzureAD provider={authProvider} forceLogin={true}>
                    {({authenticationState, accountInfo}) => {                   
                        return (
                            <React.Fragment>
                                {authenticationState ===
                                    AuthenticationState.Authenticated && (
                                   <MainApp history={history} accountInfo={accountInfo} />
                                )}
                                {authenticationState ===
                                    AuthenticationState.InProgress && (
                                    <div className="centeredContainer">
                                        <Spinner size={SpinnerSize.large} />
                                    </div>
                                )}
                                {authenticationState ===
                                    AuthenticationState.Unauthenticated && (
                                    <div className="centeredContainer">
                                        Authenticating user...
                                        <ActionButton
                                            onClick={this.logoinCall}
                                            allowDisabledFocus
                                        >
                                            Force Retry
                                        </ActionButton>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    }}
                </AzureAD>
            </>
        );
    }
}
export default App;
