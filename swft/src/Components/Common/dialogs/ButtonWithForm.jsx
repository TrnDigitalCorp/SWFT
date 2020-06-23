import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CommandBarButton} from 'office-ui-fabric-react';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';
import ModalDialog from './ModalDialog';
const modalContainer = {
    'max-width': '82%',
    'max-height': '100%',
    height: 'auto',
    overflow: 'hidden',
    width: '50%',
};
class ButtonWithForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideDialog: false,
        };
    }
    componentDidMount() {
        this.setState({
            hideDialog: this.props.hideDialog,
        });
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.hideDialog !== this.props.hideDialog) {
            this.setState({
                hideDialog: this.props.hideDialog,
            });
        }
    }

    render() {
        return (
            <>
                {this.props.buttonType === 'Command' ? (
                    <CommandBarButton
                        iconProps={{
                            iconName: this.props.iconString,
                        }}
                        text={this.props.buttonTxt}
                        onClick={this.props.onBtnClick}
                        name={this.props.buttonTxt}
                    />
                ) : (
                    <DefaultButton
                        text={this.props.buttonTxt}
                        onClick={this.props.onBtnClick}
                        name={this.props.buttonTxt}
                    />
                )}
                {this.state.hideDialog ? (
                    <ModalDialog
                        hideDialog={this.state.hideDialog}
                        modalClassName={modalContainer}
                    >
                        {this.props.children}
                    </ModalDialog>
                ) : (
                    ''
                )}
            </>
        );
    }
}

ButtonWithForm.propTypes = {
    children: PropTypes.any,
    iconString: PropTypes.string,
    buttonTxt: PropTypes.string.isRequired,
    onBtnClick: PropTypes.func.isRequired,
    dialogTitle: PropTypes.string,
    subText: PropTypes.string,
    isBlocking: PropTypes.bool.isRequired,
    hideDialog: PropTypes.bool.isRequired,
    buttonType: PropTypes.string,
};

export default ButtonWithForm;
