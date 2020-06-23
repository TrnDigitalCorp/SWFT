import *as React from 'react';
import {chunk} from 'lodash';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { IHomePageLink, IHomeButtonProps } from './IHomeButton';
import { link } from 'fs';

export default class HomeButton extends React.Component<IHomeButtonProps,{}> {    
    render() {
        const { link } = this.props;
        let disabledBtn = link.RedirectURI?"ms-Grid PageTile":"ms-Grid PageTile disabledHomeBtn";
        return (            
            <div className={disabledBtn} 
                title={link.Tooltip}    
                onClick={ev =>this.handleSelection(link,ev)}
                style={{boxShadow: Depths.depth16, minHeight:"65px", border:"solid 2px gray"}} >                                                                               
                <div className="ms-Grid-row" style={{width:"100%"}} > 
                    <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4" style={{textAlign:"center"}}>
                    { link.Icon ? <FontIcon iconName={link.Icon} style={{paddingLeft:"20px", fontSize:"1.7em", verticalAlign:"bottom", color:"#EDBD11"}}></FontIcon> : "" }
                    </div>
                    <div className="ms-Grid-col ms-sm8 ms-md8 ms-lg8">
                        { link.Text }
                    </div>                        
                </div>              
            </div>
        );
    }    
    handleSelection = (item:IHomePageLink, ev:any) => {
        ev.preventDefault();
        if(!item.RedirectKey){
            window.open(item.RedirectURI, "_blank");
        }
        this.props.handlePageTileClick(item);
    }
}

