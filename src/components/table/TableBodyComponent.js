import {useStore} from '../../store/store'
import { useState, useEffect } from 'react';

const TableBody = ({columns, tableData}) => {

  const maxColVals = useStore(state => state.maxColVals);
  const [zVal, setZVal] = useState(1); // normalizing demominator data in table

  // update zVal if any of the maxColVals changes
  useEffect(()=>{

    let overallMaxVal = Math.max(...Object.values(maxColVals));
    setZVal(parseFloat(overallMaxVal));
    console.log("overallMaxVal", overallMaxVal);

  }, [maxColVals]);

  let radius = 20;

  let tableDataInner = null;
    tableDataInner = 
        tableData.map((data) => {
          return (
            <tr key={data.id}>
              {columns.map(({ accessor }) => {
                const tData = data[accessor]/zVal;
                const rFactor = isNaN(tData)?0:tData;
                return <td key={accessor}>{isNaN(tData)?data[accessor]:tData===0?"-":""}<span style={{width:rFactor*radius, height:rFactor*radius}}className="dot"></span></td>;
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
