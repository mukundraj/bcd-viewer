import {useStore} from '../../store/store'
import {pidToSrno} from "../../shared/common"
import { useState, useEffect } from 'react';
import {useSCComponentStore} from '../../store/SCComponentStore'

const TableBodyGeneric = ({ columns, tableDataSorted, setDataLoadStatus}) => {

  const setChosenPuckid = useStore(state => state.setChosenPuckid);
  const carouselRef = useStore(state => state.carouselRef);

  const updateChosenGene = (newGene, newPid) => {
    console.log('chosenGene ', newGene, ' pid ', newPid);

    setDataLoadStatus({gene:0, puck:0, metadata:0});
    setChosenPuckid({pid:newPid, gene:newGene}); 
    carouselRef.current.goToSlide(parseInt(pidToSrno[newPid]-1));

  }

  let tableDataInner = null;
    tableDataInner = 
        tableDataSorted.map((data) => {
          return (
            <tr key={data.key}>
              {columns.map(({ accessor }) => {
                if (accessor==='g')
                  return <td key={accessor}><button className="regexptooltip" onClick={()=>updateChosenGene(data[accessor], data['p'])}>{data[accessor]}<span className='regexptooltiptext'>pid:{pidToSrno[data['p']]}</span></button></td>;
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
