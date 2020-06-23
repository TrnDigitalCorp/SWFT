import React from 'react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import PropTypes from 'prop-types';
interface IFormWrapper {
    FormHeading:string
}
export default function FormWrapper(props:React.PropsWithChildren<IFormWrapper>) {
    return (
        <div className="FormWrapper" style={{boxShadow: Depths.depth4}}>
            <div className="formSection">
                <div className="sectionContainer">
                    <div className="subHeading">
                        <div style={{fontSize: "12pt", fontWeight: "bold"}}>{props.FormHeading}</div>
                    </div>
                    <div className="FormBody">{props.children}</div>
                </div>
            </div>
        </div>
    );
}

 
