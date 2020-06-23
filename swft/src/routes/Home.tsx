import *as React from 'react';
import './Home.css';
import {HomePageConfig} from './HomeConfig';
import PageTiles from '../Components/Common/PageTiles';
import {Redirect} from 'react-router-dom';
import { IHomePageLink } from '../Components/Common/IHomeButton';
import HomeButton from "../Components/Common/HomeButton";

interface IHomeState{
    shouldRedirect:boolean;
    redirectURI:any;
}
interface IHomeProps{
    handleRedirection:(selectedKey:any)=>void;
}
interface IHomePageConfig{
    HeaderText ?: string;
    ActionLinks : IHomePageLink[][];
    GuideLinks : IHomePageLink[];
}
export class Home extends React.Component<IHomeProps,IHomeState> {
    constructor(props:IHomeProps) {
        super(props);
        this.state ={
            shouldRedirect: false,
            redirectURI:'/Home'
        };
        this.props.handleRedirection('0');
    }
    
    handlePageTileClick = (item: IHomePageLink) => {
        this.setState({
            shouldRedirect: item.RedirectKey!="",
            redirectURI:item.RedirectURI 
        });
        this.props.handleRedirection(item.RedirectKey);
    };
    getHomePageConfig = () =>{
     try {
        var homePageConfig = JSON.parse(process.env.REACT_APP_HOME_PAGE_CONFIG?process.env.REACT_APP_HOME_PAGE_CONFIG:'');
        if (!homePageConfig) {
            return HomePageConfig as IHomePageConfig;
        }else
        {
            return homePageConfig as IHomePageConfig; //JSON.parse(homePageConfig);
        } 
     } catch (error) {
         console.log(error);
         return HomePageConfig;
     }
    }
    render() {
        const {shouldRedirect,redirectURI} = this.state;
        const pageConfig = this.getHomePageConfig();
        const columnWidth = 12 / pageConfig.ActionLinks?.length;
        const actionLinkColumnClass = `ms-Grid-col ms-sm12 ms-md${columnWidth} ms-lg${columnWidth}`;
        return (
            <div className="ms-Grid Home" dir="ltr">
                <div className="ms-Grid-row" style={{textAlign: "left", paddingTop:"20px"}}>
                    { 
                        pageConfig.HeaderText && (
                            <div className="ms-Grid-col ms-sm12" style={{fontSize: "14pt", paddingTop:"10px"}} dangerouslySetInnerHTML={{__html: pageConfig.HeaderText}}></div>
                        )
                    }
                </div>
                <div className="ms-Grid-row" style={{paddingTop:"50px"}}>
                    <div className="ms-Grid-col ms-sm12 ms-md7 ms-lg7">
                        <div className="ms-Grid">
                            <div className="ms-Grid-row">
                                {
                                    pageConfig.ActionLinks.map((linkArr: IHomePageLink[], ind) => {
                                        return (
                                            <div className={actionLinkColumnClass}>
                                                {
                                                    linkArr.map((_link: IHomePageLink, _ind) => {
                                                        return <HomeButton key={_ind} link={ _link } handlePageTileClick={this.handlePageTileClick}></HomeButton>
                                                    })
                                                }
                                            </div>                                            
                                        );
                                    })
                                }                                                                                     
                            </div>
                        </div>

                        {/* <PageTiles
                            maxTilesPerRow={itemToDisplay}
                            pageLinksArr={pageConfig.HomePageLinks}
                            handlePageTileClick={this.handlePageTileClick}
                        /> */}
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md2 ms-lg2">
                        <div style={{width:"50%", borderRight:"solid 5px gray", minHeight:"430px", marginTop:"7px"}}></div>
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md3 ms-lg3">
                        {
                            pageConfig.GuideLinks.map((_link: IHomePageLink, _ind) => {
                                return <HomeButton link={ _link } handlePageTileClick={this.handlePageTileClick}></HomeButton>;
                            })
                        }
                    </div>
                </div>
                {shouldRedirect?
                <Redirect to={redirectURI} />:""}
            </div>
        );
    }
}
