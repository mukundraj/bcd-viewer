import {useStore, usePersistStore} from '../../store/store'
import {pidToSrno, srnoToPid} from "../../shared/common"
import { useState, useEffect } from 'react';
import {useSCComponentStore} from '../../store/SCComponentStore'
import useGetDendroBars from '../../hooks/useGetDendroBars';

const TableBodyGeneric = ({ columns, tableDataSorted, setDataLoadStatus, updateChosenItem, dendroBarsFullPath, firstColHeader}) => {

  
  const selectedRegIds = usePersistStore(state => state.selectedRegIds);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);
  const carouselRef = useStore(state => state.carouselRef);
  const [clickedGene, setClickedGene] = useState(null);
  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenGene = usePersistStore(state => state.setChosenGene);

  // const updateChosenGene = (newGene, newPid) => {
  //   console.log('chosenGene ', newGene, ' pid ', newPid);

  //   setDataLoadStatus({gene:0, puck:0, metadata:0});
  //   setChosenPuckid({pid:newPid, gene:newGene}); 
  //   carouselRef.current.goToSlide(parseInt(pidToSrno[newPid]-1));

  // }


  const handleClickedItem = (item, pid) => {
    console.log('clickedItem', item, pid, chosenPuckid, firstColHeader);
    if(firstColHeader === 'Gene'){
      setClickedGene(item); // item must be gene
    }else{
      updateChosenItem(item, pid); // item must be celltype
    }
    // updateChosenItem(gene, pid);
  }

  const dendroBarDataDict = useGetDendroBars({dendroBarsFullPath: dendroBarsFullPath, geneName: clickedGene, selectedRegIds: selectedRegIds});

  // case where pid also changes
  useEffect(()=>{
    // updateChosenItem(clickedGene, 11);
    // console.log('clickedGene', clickedGene);
    
    // console.log('dendroBarDataDict.curDendroBarData', dendroBarDataDict.curDendroBarData, clickedGene);

    // compute the mode puck 
    if (dendroBarDataDict.curDendroBarData === null)
      return;
    const modePuckIdx = dendroBarDataDict.curDendroBarData.indexOf(Math.max(...dendroBarDataDict.curDendroBarData)); 

    // convert puck idx to pid
    const modePid = srnoToPid[modePuckIdx+1];
    console.log('modePuck', modePid, 'clicked', clickedGene, chosenPuckid);
    
    // call updateChosenItem with clickedGene and pid
    if (chosenPuckid.pid !== modePid && clickedGene !== chosenPuckid.gene) // imp to prevent jump on region selection
    {
      updateChosenItem(clickedGene, modePid);
    }
    else if(chosenPuckid.pid === modePid && clickedGene !== chosenPuckid.gene)
    {
      setDataLoadStatus((p)=>({...p, gene:0, metadata:0}));
      setChosenGene([clickedGene]);
      setChosenPuckid({pid:modePid, gene:clickedGene});
    }
    // else if(chosenPuckid.pid !== modePid)
    //   updateChosenItem(clickedGene, modePid);
    // else
    //   alert('Already showing the puck with maximum expression for this gene and region selection');
    


  }, [dendroBarDataDict.curDendroBarData]);


  let tableDataInner = null;
    tableDataInner = 
        tableDataSorted.map((data, idx) => {
          return (
            <tr key={data.key}>
              {columns.map(({ accessor }) => {
                if (accessor==='g')
                  return <td key={accessor}><button className="regexptooltip" onClick={()=>handleClickedItem(data[accessor], data['p'])}>{data[accessor]}<div className='regexptooltiptext'>row:{idx+1}</div></button></td>;
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
