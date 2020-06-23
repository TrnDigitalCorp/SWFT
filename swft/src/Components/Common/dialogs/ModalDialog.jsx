import {Modal} from 'office-ui-fabric-react/lib/Modal';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

const scrollClass = {
    overflow: 'auto',
    'max-height': '100%',
};
const containerStyle ={
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        maxWidth:300
      }
}
class ModalDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
        };
    }
    render() {
        return (
            <div className="model">
                <Modal
                    isOpen={this.state.showModal}
                    onDismiss={this._closeModal}
                    containerClassName={containerStyle}
                    dragOptions={undefined}
                    isBlocking={true}
                    // scrollableContentClassName={scrollClass}
                >
                    {this.props.children}
                </Modal>
            </div>
        );
    }
}
ModalDialog.propTypes = {
    children: PropTypes.any,
    modalClassName: PropTypes.any,
    showModal: PropTypes.any,
};
export default ModalDialog;
