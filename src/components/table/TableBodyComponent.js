import {useStore} from '../../store/store'
import { useState, useEffect } from 'react';
import {useSCComponentStore} from '../../store/SCComponentStore'

const TableBody = ({columns, tableDataSorted}) => {

  const maxColVals = useStore(state => state.maxColVals);
  const scTableZVal = useStore(state => state.scTableZVal);
  const currentColorMap = useSCComponentStore(state => state.currentColorMap);
  // const [zVal, setZVal] = useState(1); // normalizing demominator data in table

  // update zVal if any of the maxColVals changes
  // useEffect(()=>{

  //   let overallMaxVal = Math.max(...Object.values(maxColVals));
  //   setZVal(parseFloat(overallMaxVal));
  //   console.log("overallMaxVal", overallMaxVal);

  // }, [maxColVals]);

  let radius = 20;

  let computedColor = (cFactor) => currentColorMap(cFactor*radius); // cFactor = colorFactor

  let tableDataInner = null;
    tableDataInner = 
        tableDataSorted.map((data) => {
          return (
            <tr key={data.id}>
              {columns.map(({ accessor }) => {
                const tData = data[accessor]/scTableZVal;
                const rFactor = isNaN(tData)?0:tData;
                return <td key={accessor}>{isNaN(tData)?data[accessor]:tData===0?"-":""}<span style={{width:rFactor*radius, height:rFactor*radius, backgroundColor:computedColor(rFactor)}} className="dot sctooltip"><span className="sctooltiptext">{data[accessor]}</span></span></td>;
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

export default TableBody;
