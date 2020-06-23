import React, {Component} from 'react';
import {Panel, PanelType} from 'office-ui-fabric-react/lib/Panel';
import PropTypes from 'prop-types';
class CustomPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.hideDialog,
        };
    }
    getPanelType = size => {
        switch (size) {
            case 'small':
                return PanelType.smallFixedFar;
            case 'medium':
                return PanelType.medium;
            default:
                return PanelType.extraLarge;
        }
    };
    render() {
        return (
            <div className="row">
                <Panel
                    isOpen={this.state.showModal}
                    onDismiss={this._closeModal}
                    type={this.getPanelType(this.props.size)}
                    // extraLarge
                    hasCloseButton={false}
                    isBlocking={false}
                    closeButtonAriaLabel="Close"
                >
                    {this.props.children}
                </Panel>
            </div>
        );
    }
}
CustomPanel.propTypes = {
    size: PropTypes.any,
    children: PropTypes.any,
    hideDialog: PropTypes.any,
};
export default CustomPanel;
