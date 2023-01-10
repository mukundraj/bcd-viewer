import {useStore, usePersistStore} from '../../store/store'
import {pidToSrno} from "../../shared/common"
import { useState, useEffect } from 'react';
import {useSCComponentStore} from '../../store/SCComponentStore'

const TableBodyGeneric = ({ columns, tableDataSorted, setDataLoadStatus, updateChosenItem}) => {

  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);
  const carouselRef = useStore(state => state.carouselRef);

  let tableDataInner = null;
    tableDataInner = 
        tableDataSorted.map((data, idx) => {
          return (
            <tr key={data.key}>
              {columns.map(({ accessor }) => {
                if (accessor==='g')
                  return <td key={accessor}><button className="regexptooltip" onClick={()=>updateChosenItem(data[accessor], data['p'])}>{data[accessor]}<span className='regexptooltiptext'>pid:{pidToSrno[data['p']]},r:{idx}</span></button></td>;
                else
                  return <td key={accessor}>{data[accessor]}</td>;
              })}
            </tr>
          );
        });
  return(
    <>
      <tbody>
        {tableDataInner}
      </tbody>
    </>
  )
};

export default TableBodyGeneric;
