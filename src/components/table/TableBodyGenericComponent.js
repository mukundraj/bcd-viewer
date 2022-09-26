import {useStore} from '../../store/store'
import { useState, useEffect } from 'react';
import {useSCComponentStore} from '../../store/SCComponentStore'

const TableBodyGeneric = ({columns, tableDataSorted}) => {

  // const maxColVals = useStore(state => state.maxColVals);
  const maxProportionalVal = useSCComponentStore(state => state.maxProportionalVal);
  const currentColorMap = useSCComponentStore(state => state.currentColorMap);
  // const [zVal, setZVal] = useState(1); // normalizing demominator data in table

  // update zVal if any of the maxColVals changes
  // useEffect(()=>{

  //   let overallMaxVal = Math.max(...Object.values(maxColVals));
  //   setZVal(parseFloat(overallMaxVal));
  //   console.log("overallMaxVal", overallMaxVal);

  // }, [maxColVals]);


  const setChosenGene = useStore(state => state.setChosenGene);

  function updateChosenGene(chosenGene){
    console.log('chosenGene ', chosenGene);
    setChosenGene([chosenGene]);
  }

  let tableDataInner = null;
    tableDataInner = 
        tableDataSorted.map((data) => {
          return (
            <tr key={data.key}>
              {columns.map(({ accessor }) => {
                if (accessor==='g')
                  return <td key={accessor}><button onClick={()=>updateChosenGene(data[accessor])}>{data[accessor]}</button></td>;
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
