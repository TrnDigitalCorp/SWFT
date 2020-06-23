export interface IHomePageLink{
    Text: string;
    Icon: string;
    Tooltip: string;
    RedirectURI: string;
    RedirectKey: string;
}
export interface IHomeButtonProps{
    link: IHomePageLink;
    handlePageTileClick:(item: IHomePageLink)=>void;
}