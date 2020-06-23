import { IUserDetail } from "../IMainApp";

export  interface IMainHeaderProps{
    appHeading?:string, 
    appLogoText:string,
    userDetail:IUserDetail, 
    appImageURL:string, 
    iconName?:string
    selectedKey:string|undefined;
    handleRedirection:(selectedKey:any)=>void;
}
export  interface IMainHeaderState{
    isOpen:boolean
    isNavigate:boolean;
    selectedKey:string|undefined;
}