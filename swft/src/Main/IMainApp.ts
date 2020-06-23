export interface IUserDetail{ 
    name:string;
    userName:string;
    isAdmin:boolean;
}
export interface IAccountInfo{ 
    account:IUserDetail;
}
export interface ISystemAdmin{ 
    SystemAdminId:number;
    SystemAdminName:string;
    SystemAdminEmailId:string;
}
export interface IMainAppProps{ 
    accountInfo:IAccountInfo;
}
export interface IMainApprState{ 
    systemAdmins:ISystemAdmin[];
    selectedKey:string;
    isLoaded: boolean;
}