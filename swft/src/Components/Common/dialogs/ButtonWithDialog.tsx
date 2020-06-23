import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BlockingDialog from './BlockingDialog';
import {CommandBarButton} from 'office-ui-fabric-react';
import {DefaultButton,PrimaryButton} from 'office-ui-fabric-react/lib/Button';

export interface IButtonWithDialogProps{
    iconString?: string;
    buttonTxt:string;
    onBtnClick: any;
    dialogTitle: string;
    subText: string;
    isBlocking: boolean;
    hideDialog: boolean;
    buttonType?: 'Primary'|'Command'|'Default';
    CustClassName: string;
    handleAction: any;
    actionBtnTxt: string;
    dismisBtnTxt: string;
    disabled?:boolean;
}

export default class ButtonWithDialog extends Component<IButtonWithDialogProps,{}> {
    render() {
        return (
            <>
                {this.props.buttonType === 'Command' ? (
                    <CommandBarButton
                        iconProps={{
                            iconName: this.props.iconString,
                        }}
                        disabled={this.props.disabled}
                        text={this.props.buttonTxt}
                        onClick={this.props.onBtnClick}
                        name={this.props.buttonTxt}
                    />
                ) : (this.props.buttonType === 'Primary'?
                    (
                    <PrimaryButton
                        disabled={this.props.disabled}
                        text={this.props.buttonTxt}
                        onClick={this.props.onBtnClick}
                        name={this.props.buttonTxt}
                    />
                )
                :(
                <DefaultButton
                    disabled={this.props.disabled}
                    text={this.props.buttonTxt}
                    onClick={this.props.onBtnClick}
                    name={this.props.buttonTxt}
                />)
                )}
                <BlockingDialog
                    hideDialog={this.props.hideDialog}
                    title={this.props.dialogTitle}
                    handleAction={this.props.handleAction}
                    actionBtnTxt={this.props.actionBtnTxt}
                    isBlocking={this.props.isBlocking}
                    subText={this.props.subText}
                    dismissClick= {this.props.onBtnClick}
                    dismisBtnTxt= {this.props.dismisBtnTxt}
                    CustClassName= {this.props.CustClassName}
                >
                    {this.props.children}
                </BlockingDialog>
            </>
        );
    }
}