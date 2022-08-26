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



  let tableDataInner = null;
  if (columns.length > 1){
    tableDataInner = 
        tableData.map((data) => {
          return (
            <tr key={data.id}>
              {columns.map(({ accessor }) => {
                const tData = data[accessor] ? data[accessor]/zVal : "——";
                return <td key={accessor}>{tData}</td>;
              })}
            </tr>
          );
        });
  }
  return(
    <>
      <tbody>
        {tableDataInner}
      </tbody>
    </>
  )
};

export default TableBody;
