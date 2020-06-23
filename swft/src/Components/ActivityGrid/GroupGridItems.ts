import _ from 'lodash';
import { IGroup} from 'office-ui-fabric-react/lib/DetailsList';
import { IActivityGridModel } from '../../Models/IActivityGridModel';
import AppConfig from '../../Constans';
import moment from 'moment';


export interface IGroupGridItems{
    ItemsArr:any[];
    GroupArr:IGroup[];
}
export interface IGroupData{
    ExpId:number;
    Expname:string;
    ExpOwner:string;
    ExpStartDate:any;
    isEditable:boolean;
}
export function groupAndSortGridItems(items:any[],groupByKey:string, groupByHeading:string,sortItemByKey:string,sortGroupKey:string,currUserObj:any) :IGroupGridItems{
    var groupedGridItems:IGroupGridItems = {ItemsArr:[] as any[],GroupArr:[] as IGroup[]} as IGroupGridItems;
    let groupByArr:any =  _.groupBy(items, groupByKey);
    if(groupByArr){
        let lastIndex = 0;
        var groups = Object.keys(groupByArr);
        for (let index = 0; index < groups.length; index++) {
            const eachGroup = groups[index];
            let key = '',
                name = '',
                data:IGroupData = {} as IGroupData,
                startIndex = 0,
                isCollapsed = true,
                count = 0,
                currGroup = [];
            try {
                currGroup = _.orderBy(groupByArr[eachGroup],sortItemByKey);
                count = currGroup.length;
                var currRecord = currGroup[0];
                if (eachGroup === "null") {
                    key = 'Stand-alone' + index;
                    name = "Stand-alone Activities";
                }
                else{
                    key = eachGroup; // this property is used as ID for opening Edit/View of the Exp Record
                    name = groupByHeading + currRecord["ExperimentName"];  
                    data = getExpData(currRecord,currUserObj);
                   
                }
                startIndex = lastIndex;
                isCollapsed = false;
                lastIndex = lastIndex + count;
                groupedGridItems.GroupArr.push({
                    key,
                    name,
                    startIndex,
                    count,
                    isCollapsed,
                    data
                });
                groupedGridItems.ItemsArr = groupedGridItems.ItemsArr.concat(currGroup); 
            } catch (error) {
                console.log(error);
            }
        } 
        groupedGridItems.GroupArr.sort((a:IGroup, b:IGroup):any=>{
            return a.data.ExpStartDate - b.data.ExpStartDate;
        });
    }
    console.log("groupedGridItems",groupedGridItems);
    return groupedGridItems;
 }
 function getExpData(currRecord:IActivityGridModel,currUserObj:any):IGroupData{
    let data:IGroupData = {} as IGroupData;
    data.ExpId = currRecord.ExperimentId;
    data.Expname = currRecord.ExperimentName;
    data.ExpOwner = currRecord.Owner;
    data.ExpStartDate = currRecord.ExperimentStartDate?new Date(moment(currRecord.ExperimentStartDate).format(AppConfig.DateFormats.NoTimeDate)):null;
    data.isEditable= isExpEditable(currRecord,currUserObj);
    return data;
 } 
 function isExpEditable (currRecord:IActivityGridModel,currUserObj:any):boolean{
    let isEditable:boolean=false;  
    isEditable = currRecord.Owner ? currRecord.Owner.toUpperCase() === currUserObj.userName.toUpperCase() : false;
    //check if it's administrator
    isEditable = isEditable || currUserObj.isAdmin;       
    //check if the group is for standalone activities
    return isEditable;
 }  