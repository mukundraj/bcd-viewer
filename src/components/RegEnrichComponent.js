import RangeSlider from 'react-bootstrap-range-slider';
import {Col, Row} from 'react-bootstrap'
import TableGeneric from './table/TableGenericComponent'
import { useSortableTableGeneric } from "./table/hooks";
import { useState, useEffect } from 'react';
import {useStore, usePersistStore} from '../store/store'
import ZarrLoader from "../loaders/ZarrLoader"
import {getUrl} from "../shared/common"

function RegEnrich({setDataLoadStatus, regEnrichZarrPath, updateChosenItem, firstColHeader, nameInfoFilePath, helptip}){


  let columns = null;

  if (firstColHeader=='Celltype'){

  columns = [
    {
      label: firstColHeader, accessor: "g"
    },
    { label: "pct", accessor: "1",
    },
    { label: "cnt", accessor: "-1",
    },
  ];

  }else if (firstColHeader=='Gene'){

    columns = [
      {
        label: firstColHeader, accessor: "g"
      },
      { label: "% in", accessor: "1",
      },
      { label: "% cnt", accessor: "-1",
      },
    ];


  }

  // const data = [
 // {
  // "id": 1,
  // "1": 0.23,
  // "-1": 1.0,
  //  "g": "A",
 // },
 // {
  // "id": 2,
  // "1": 0.3,
  // "-1": 0.5,
  //  "g": "B",
 // },
 // {
  // "id": 3,
  // "1": 0.4,
  // "-1": 0.2,
  //  "g": "C",
 // },
// ];
  // const [tableData, setTableData] = useState(data);
  // const tableDataFiltered = useStore(state => state.tableDataFiltered);
  const [tableDataFiltered, setTableDataFiltered] = useState([]);


  const [handleSorting] = useSortableTableGeneric(tableDataFiltered);
  const setSortField = useStore(state => state.setSortField);
  const sortField = useStore(state => state.sortField);
  const tableDataSorted = useStore(state => state.tableDataSorted);

  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenPuckid = useStore(state => state.setChosenPuckid);
  const selectedRegIds = usePersistStore(state => state.selectedRegIds);
  const chosenGene = usePersistStore(state => state.chosenGene);

  const [ridToIdx, setRidToIdx] = useState({});
  const [inFracs, setInFracs] = useState([]);
  const [outFracs, setOutFracs] = useState([]);
  const [maxNzOutPct, setMaxNzOutPct] = useState(100);
  const [maxNzInPct, setMaxNzInPct] = useState(100);
  const [geneNames, setGeneNames] = useState([]);
  const [maxExprPids, setMaxExprPids] = useState([]);
  const [fullData, setFullData] = useState([]);
  // const [minFrac, setMinFrac] = useState(0); // at least frac
  const minFrac = useStore(state => state.minFrac);
  const setMinFrac = useStore(state => state.setMinFrac);

  // const initSecFieldVal = firstColHeader==="Gene"?1:0;
  // const [maxFrac, setMaxFrac] = useState(initSecFieldVal); // at most frac
  const maxFrac = useStore(state => state.maxFrac);
  const setMaxFrac = useStore(state => state.setMaxFrac);


  const setCurrentREgene = useStore(state => state.setCurrentREgene);
  const setOrder = useStore(state => state.setOrder);

  useEffect(()=>{ // since 'order' is shared between component - fix it sometime
    setOrder("desc");
  },[]);


  useEffect(()=>{

    const fetchData = async (row_idx) => {
      // console.log("LLL");
      // let zarrPathInBucket = `https://storage.googleapis.com/ml_portal/test_data/`
      // let zarrPathInBucket = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/`
      let zloader = new ZarrLoader({zarrPathInBucket:regEnrichZarrPath});
      // let dataRow = await zloader.getDataRow("nz_aggr.zarr/rids/X", row_idx);


      // loop though selectedRegIds and get nz counts for each region
      if (selectedRegIds.length>0){ // create new array
        let row_idx = ridToIdx[selectedRegIds[0]];
            console.log('row_idx', row_idx, selectedRegIds, ridToIdx);
        // let [dataRow, dataRowOut] = await Promise.all([zloader.getDataRow(`nz_aggr.zarr/p${chosenPuckid}/X`, row_idx), 
        let [dataRow, dataRowOut] = await Promise.all([zloader.getDataRow(`/pall/X`, row_idx), 
          zloader.getDataRow(`/pall/Xout`, row_idx)]);

        let inFracsTmp = dataRow; // for case with only one region selected
        let outFracsTmp = dataRowOut;

        if (selectedRegIds.length>1){ // add to existing array for >1 region selected
          for (let i=1; i<selectedRegIds.length; i++){
            let row_idx = ridToIdx[selectedRegIds[i]];
            let [dataRow, dataRowOut] = await Promise.all([zloader.getDataRow(`/pall/X`, row_idx), zloader.getDataRow(`/pall/Xout`, row_idx)]);
            // console.log('dataRow', dataRow);
            if (!isNaN(dataRow[0]) && (!isNaN(dataRowOut[0]))){ // a lazy check too see if selected region/outRegion has no beads for current puck
              for (let j=0; j<dataRow.length; j++){
                inFracsTmp[j] += dataRow[j];
                outFracsTmp[j] += dataRowOut[j];
              }    
            }
          }
        }
        setInFracs(inFracsTmp);
        setOutFracs(outFracsTmp);
        // const initVal = 0;
        // const sum = inFracsTmp.reduce((p,c)=>p+c, initVal);
        // console.log('sum ', sum);

      }else if(selectedRegIds==0){
          let inFracsTmp = [];
          let outFracsTmp = [];
          setInFracs(inFracsTmp);
          setOutFracs(outFracsTmp);
      }
 


    }
    if(Object.keys(ridToIdx).length>0){
      fetchData(0);
    }
      
  },[chosenPuckid, selectedRegIds, ridToIdx]);

  useEffect(()=>{

    const fetchData = async (row_idx) => {
      // let zarrPathInBucket = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/`
      let zloader = new ZarrLoader({zarrPathInBucket:regEnrichZarrPath});
      let dataRow = await zloader.getDataRow("/rids/X", row_idx);

      let ridToIdxTmp = {};
      for (let i=0; i<dataRow.length; i++){
        ridToIdxTmp[dataRow[i]] = i;
      }
      setRidToIdx(ridToIdxTmp);

      // let geneInfoPath = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/gene_info.json`
      // let geneInfoPath = `${regEnrichZarrPath}names_info.json`
      let geneInfoPath = `${nameInfoFilePath}`
      // let geneOptionsUrl = await getUrl(geneNamesPath);
      console.log("geneOptionsUrl ", geneInfoPath);
      // const geneOptions = await load(geneOptionsUrl, [CSVLoader], {csv:{delimiter:":"}});
      fetch(geneInfoPath)
        .then(function(response){
          return response.json();
        })
        .then(function(myJson) {
          console.log("myJson ",myJson.data);
          setGeneNames(myJson.data)
          setMaxExprPids(myJson.maxExprPuck)
        });


    }
    fetchData(0);
  },[]);

  useEffect(()=>{

    if (inFracs.length===outFracs.length && outFracs.length===geneNames.length){
      let fullDataTmp = [];
      for (let i=0; i<geneNames.length; i++){
        fullDataTmp.push({"key":i, "g": geneNames[i], "1":Math.round(inFracs[i]*10000000)/10000000, "-1": Math.round(outFracs[i]*10000000)/10000000, "p": parseInt(maxExprPids[i])});
      }
      let maxNzOutPctTmp = Math.max(...outFracs);
      setMaxNzOutPct(maxNzOutPctTmp);
      let maxNzInPctTmp = Math.max(...inFracs);
      setMaxNzInPct(maxNzInPctTmp);

      // console.log('fullDataTmp', fullDataTmp);
      setFullData(fullDataTmp);

    }else{
      setFullData([]);
    }


  }, [geneNames, inFracs, outFracs, maxExprPids]);


  useEffect(()=>{


    let filterdData = null;

    if (firstColHeader==="Gene"){
      filterdData = fullData.filter(obj=>{return (obj['1'] > minFrac) && (obj['-1'] < maxFrac) });
    }else{
      filterdData = fullData.filter(obj=>{return (obj['1'] > minFrac) && (obj['-1'] > maxFrac) });
    }

    setTableDataFiltered(filterdData);
    // filterdData.sort((a,b)=>(a['1']>b['1'])?-1:1);



  }, [fullData, minFrac, maxFrac])

  useEffect(()=>{
    console.log("filterdData length ", tableDataFiltered.length, minFrac, maxFrac,tableDataFiltered);
    console.log("sortField ", sortField);


    if (sortField ===""){
      setSortField("1");
    }
    handleSorting("1", "desc");
    setCurrentREgene(chosenGene);

  }, [tableDataFiltered])

  
  // useEffect(()=>{
  //   console.log("chosenPuckid ", chosenPuckid, "selectedRegIds", selectedRegIds);
  // }, [chosenPuckid, selectedRegIds])


  let maxRows = 400;

  return(
    <>
      {selectedRegIds.length===0?<h6>No region currently selected. Select region(s) above to identify {firstColHeader}s that are enriched in selected region.</h6>:<>
      <h6>Region Enrichment &nbsp;{helptip}{tableDataFiltered.length>0?<><span> : </span><span style={{backgroundColor:"#ccccff"}}>showing {tableDataFiltered.length>maxRows?maxRows:tableDataFiltered.length} out of {tableDataFiltered.length}</span></>:""} </h6>
        <Row>
          <Col xs="5">
            <Row>
              <Col xs="7">
                {firstColHeader==='Gene'?'Min nz bead % in region more than:':'pct in selected region more than:'}
              </Col>
              <Col xs="5"> 
                <RangeSlider
                  value={minFrac}
                  onChange={e=>setMinFrac(e.target.value)}
                  min={0}
                  max={maxNzInPct}
                  step={maxNzInPct/1000}
                />
              </Col>
            </Row>
            <Row>
          <Col xs="7">
            {firstColHeader==='Gene'?'Max nz bead % out of region less than:':'cell bead count in region more than:'}
          </Col>
          <Col xs="5"> 
            <RangeSlider
              value={maxFrac}
              onChange={e=> setMaxFrac(e.target.value)}
              min={0}
              max={maxNzOutPct}
              step={maxNzOutPct/1000}
            />
          </Col>
            </Row>
          </Col>
          <Col xs="7">
          <TableGeneric columns={columns} tableDataSorted={tableDataSorted} maxRows={maxRows} width={100} handleSorting={handleSorting} setDataLoadStatus={setDataLoadStatus} updateChosenItem={updateChosenItem}/>
          </Col>
        </Row>
      </>
        }
    </>
  );
}

export default RegEnrich;
