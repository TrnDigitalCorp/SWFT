import React from 'react';
import {Dialog, DialogType} from 'office-ui-fabric-react/lib/Dialog';
import {Spinner,SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import { IBlockingSpinnerProps } from './IBlockingSpinner';
export const BlockingSpinner = (props:IBlockingSpinnerProps) => {
    return (
        <div>
            <Dialog
                hidden={props.hideDialog}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: '',
                    subText: '',
                    styles:{content:{borderTop:0} }
                }}
                modalProps={{
                    isBlocking: true,
                    styles: {main: {minWidth: 200,minHeight: 100}},
                }}
            >
                <Spinner
                    label={props.label}
                    ariaLive="assertive"
                    labelPosition="right"
                    size={SpinnerSize.large}
                />
            </Dialog>
        </div>
    );
}

