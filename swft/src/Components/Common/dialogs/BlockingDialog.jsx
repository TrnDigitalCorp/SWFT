import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogType,
    DialogFooter,
} from 'office-ui-fabric-react/lib/Dialog';
import {PrimaryButton, DefaultButton} from 'office-ui-fabric-react/lib/Button';

const stylesBlock ={    
    subText  :{
        marginBottom: '0px!important',
    }
}
const BlockingDialog = props => {
    return (
        <div>
            <Dialog
                hidden={props.hideDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: props.title,
                    subText: props.subText,
                }}
                modalProps={{
                    isBlocking: props.isBlocking,
                    // styles: {main: {maxWidth: 450}},
                }}
                onDismiss={props.dismissClick}
                styles={stylesBlock}
            >
                {props.children}
                <DialogFooter>
                    <PrimaryButton text={props.actionBtnTxt} onClick={props.handleAction}/>
                    {!props.isBlocking &&(<DefaultButton onClick={props.dismissClick} text={props.dismisBtnTxt} />)}
                </DialogFooter>
            </Dialog>
        </div>
    );
};

BlockingDialog.propTypes = {
    children: PropTypes.any,
    hideDialog: PropTypes.bool.isRequired,
    dismissClick: PropTypes.func,
    handleAction: PropTypes.func.isRequired,
    actionBtnTxt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isBlocking: PropTypes.bool.isRequired,
    subText: PropTypes.string,
    dismisBtnTxt: PropTypes.string,
    CustClassName: PropTypes.string,
};

export default BlockingDialog;
