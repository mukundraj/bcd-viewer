import {useStore} from '../../store/store'
import { useState, useEffect } from 'react';
import {useSCComponentStore} from '../../store/SCComponentStore'
import {useNavigate} from 'react-router-dom'

const TableBody = ({columns, tableDataSorted}) => {

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
  //
  const navigate = useNavigate();

  const toCellSpatial = (celltype) => {
    console.log("toCellSpatial");
    navigate('/cellspatial', {state:{celltype:celltype}});
  }

  let radius = 15;

  let computedColor = (cFactor) => currentColorMap(cFactor); // cFactor = colorFactor

  let tableDataInner = null;
    tableDataInner = 
        tableDataSorted.map((data) => {
          return (
            <tr key={data.id}>
              {columns.map(({ accessor }) => {
                const tData = data[accessor]/maxProportionalVal;
                const rFactor = isNaN(tData)?0:tData;
                return <td key={accessor}>
                  {isNaN(tData)?
                    <><button className="btn btn-light btn-sm py-0" style={{borderWidth:"0"}} onClick={()=>{toCellSpatial(data[accessor])}}>{data[accessor]}</button>, <span style={{color:'#8E44AD'}}>{data.cc}</span>, <span style={{color:'#BB8FCE'}}>{data.pct}%</span></>:tData===0?"-":""}
                  <span style={{width:rFactor*radius, height:rFactor*radius, backgroundColor:computedColor(data[-accessor])}} className="dot sctooltip">
                    <span className="sctooltiptext">{Math.round(data[-accessor]*100)/100}, {Math.round(data[accessor]*100)}%</span>
                  </span>
                  </td>;
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
