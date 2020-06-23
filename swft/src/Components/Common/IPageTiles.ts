export interface IPageLink{ 
    order: number;
    Name: string;
    RedirectURI: any;
    RedirectKey: any;
    IconName: string;
    IconTitle: string;
}
export interface IPageTilesProps{ 
    maxTilesPerRow:number;
    pageLinksArr:IPageLink[]|any[];
    handlePageTileClick:(item:IPageLink)=>void ;
}