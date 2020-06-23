export  interface INavBarProps{
    selectedKey:string|undefined;
    handleRedirection:(selectedKey:any)=>void;
}
export  interface INavBarState{
    isNavigate:boolean;
    selectedKey:string|undefined;
}