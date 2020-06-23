import *as React from 'react';
import {chunk} from 'lodash';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import { IPageTilesProps, IPageLink } from './IPageTiles';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';

export default class PageTiles extends React.Component<IPageTilesProps,{}> {
    handleSelection = (item:IPageLink,ev:any) => {
        ev.preventDefault();
        this.props.handlePageTileClick(item);
    }
    CreateChunkAndFill = (maxTilesPerRow:number, pageLinksArr:IPageLink[]) => {
        var splitArray:any[] = chunk(pageLinksArr, maxTilesPerRow);
        for (var i = 0; i < splitArray.length; i++) {
            if (splitArray[i].length < maxTilesPerRow) {
                var b = maxTilesPerRow - splitArray[i].length;
                for (var j = 0; j < b; j++) {
                    splitArray[i].push({});
                }
            }
        }
        return splitArray;
    }
    render() {
        const {maxTilesPerRow, pageLinksArr} = this.props;
        var splitArray = this.CreateChunkAndFill(maxTilesPerRow, pageLinksArr);
        const tileClass =
            maxTilesPerRow === 3 ? 'ms-Grid-col ms-sm4' : 'ms-Grid-col ms-sm3';
        return (
            <>
                {splitArray.map((pageTileArr:IPageLink[], key:number) => {
                    return (
                        <div
                            className="ms-Grid-row PageTileSection"
                            key={key + (pageTileArr.length % key)}
                        >
                            {pageTileArr.map((item:IPageLink, key1:number) => {
                                return item.Name ? (
                                    <div
                                        className={[tileClass, 'PageTile'].join(' ')}
                                        key={item.order + key}
                                        onClick={ev =>this.handleSelection(item,ev)}
                                        style={{boxShadow: Depths.depth16}}
                                    >
                                        <div
                                            className="PageTileContent"
                                            title={item.Name}
                                            data-title={item.Name}                                            
                                        >
                                            {item.Name}
                                            {item.IconName ? <FontIcon iconName={item.IconName} title={item.IconTitle} 
                                                                style={{paddingLeft:"20px", fontSize:"1.7em", verticalAlign:"bottom", color:"#EDBD11"}}/>  : ""}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={[
                                            tileClass,
                                            'PageTile',
                                            'transparentBg',
                                        ].join(' ')}
                                        key={key1}
                                    ></div>
                                );
                            })}
                        </div>
                    );
                })}
            </>
        );
    }
}
