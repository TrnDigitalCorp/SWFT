import * as React from 'react';
import { ICalData } from './intefaces/ICalendar';
const uuidv4 = require('uuid/v4');
export interface ITotalByDateShiftProps {
    TotalCountArr:ICalData[];
}
export default class TotalByDateShift extends React.Component<ITotalByDateShiftProps, {}> {
 public render() {
      const {TotalCountArr} = this.props;
    return (
      <tr>
        <td key={uuidv4()}>
            Total Distinct People
        </td>
        {TotalCountArr.map((eachCountArr)=>{
            return(
            <td key={uuidv4()}>
                <div className={'ms-Grid-row CalendarCoinClass'}>
                    {eachCountArr.ShiftData.map((countByShift,key) =>{
                        return(
                            <div key={key + 'coin'}
                                className={'ms-Grid-col ms-sm3 calendatCoinDiv'}>
                                {countByShift.ActivityNumber}
                            </div>
                        )
                    })}
                </div>
            </td>)
        })}
      </tr>
    );
  }
}
