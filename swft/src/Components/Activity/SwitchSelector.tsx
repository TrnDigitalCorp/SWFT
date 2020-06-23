import * as React from 'react';
import './SwitchSelector.css';
import {Label} from 'office-ui-fabric-react/lib/Label';
import {ISwitchSelectorProps, ISwitchSelectorState} from './interfaces/ISwitchSelector';
import { IActivityShift } from './interfaces/IActivityForm';

export default class SwitchSelector extends React.Component<ISwitchSelectorProps,ISwitchSelectorState> {
    constructor(props:ISwitchSelectorProps) {
        super(props);
        this.state = {
            arrayInput: [],
        };
    }
    componentDidMount() {
        const {arrayInput} = this.props;
        this.setState({
            arrayInput,
        });
    }
    componentDidUpdate(prevProps:ISwitchSelectorProps, prevState:ISwitchSelectorState) {
        const {arrayInput} = this.props;
        if (prevProps.arrayInput.length !== arrayInput.length) {
            this.setState({
                arrayInput,
            });
        }
    }
    handleSelection = (event:any ) => {
        let currData:any = event.currentTarget.dataset;
        let indexvalue = parseInt(currData.cusindex);
        let updatedArr:any = this.state.arrayInput;
        updatedArr[indexvalue].isSelected =
            currData.selected === 'false' ? true : false;
        this.setState({
            arrayInput: updatedArr,
        });
        this.props.handleChangeFunction(updatedArr);
    }
    renderSwithcSelector = (arrayInput:IActivityShift[]) => {
        const {viewForm} = this.props;
        return (
            <div className="SwitchSelector" key={arrayInput.length}>
                {arrayInput.map((item, key) => {
                    return (
                        <div
                            className={viewForm?'viewFormDisabled':''}
                            key={key + item.Id}
                            data-cusindex={key}
                            data-selected={item.isSelected}
                            onClick={ev => {
                                this.handleSelection(ev);
                            }}
                        >
                            <div
                                className={
                                    item.isSelected
                                        ? 'switch switchSelected'
                                        : 'switch'
                                }
                                title={item.DisplayName}
                            >
                                {item.DisplayName}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    render() {
        const {labelHead, required} = this.props;
        const {arrayInput} = this.state;
        return (
            <div>
                {labelHead && (
                    <Label className={required? 'requiredLabel':''}>
                        {labelHead}
                    </Label>
                )}
                {this.renderSwithcSelector(arrayInput)}
            </div>
        );
    }
}