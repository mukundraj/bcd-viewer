import {useStore, usePersistStore} from '../../store/store'
import { useState, useEffect } from 'react';
import {useSCComponentStore} from '../../store/SCComponentStore'
import {useNavigate} from 'react-router-dom'

const TableBody = ({columns, tableDataSorted}) => {

  // const maxColVals = useStore(state => state.maxColVals);
  const maxProportionalVal = useSCComponentStore(state => state.maxProportionalVal);
  const currentColorMap = useSCComponentStore(state => state.currentColorMap);
  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);
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

      // navigate('/cellspatial', {state:{celltype:celltype}});

      // get freqBar data for this celltype to derminne maxima puckid
    const fetchData = async (celltype) => {
      let fbarsDataUrl = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/freqbars/cell_jsons_s2c/${celltype}.json`
      const readData = await fetch(fbarsDataUrl)
        .then(response => response.json())
        .then(readData => {
          // find maxima pid
          const counts = readData.sorted_puckwise_cnts.map(o => o.cnt);
          const maxIdx = counts.indexOf(Math.max(...counts));
          const maximaPid = readData.sorted_puckwise_cnts[maxIdx].key[0];

          setChosenPuckid({...chosenPuckid, pid:maximaPid, cell:celltype});
          navigate('/cellspatial');
          return readData;
        } )
        .catch(error => {
          alert("Could not find spatial data for this cell type");
          console.log(error);
          return undefined;
        });

    }

      // get celltype freqbar data and set maxima pid
      fetchData(celltype);

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
                    <>
                      {accessor=='ct'?<button className="btn btn-light btn-sm py-0" disabled={data.st=='Y'?false:true} style={{borderWidth:"0"}} onClick={()=>{toCellSpatial(data[accessor])}}>{data[accessor]}</button>: <>{data[accessor]}, <span style={{color:'#BB8FCE'}}>{data.pct}%</span></>}

                  {/* <span style={{color:'#8E44AD'}}>{data.cc}</span>, <span style={{color:'#BB8FCE'}}>{data.pct}%</span> */}
                      </>
                  :tData===0?"-":""}
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
