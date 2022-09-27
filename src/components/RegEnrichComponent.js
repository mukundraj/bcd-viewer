import RangeSlider from 'react-bootstrap-range-slider';
import {Col, Row} from 'react-bootstrap'
import TableGeneric from './table/TableGenericComponent'
import { useSortableTableGeneric } from "./table/hooks";
import { useState, useEffect } from 'react';
import useStore from '../store/store'
import ZarrLoader from "../loaders/ZarrLoader"
import {getUrl} from "../shared/common"

function RegEnrich({setChosenGene}){


  const columns = [
    {
      label: "Gene", accessor: "g"
    },
    { label: "% in", accessor: "1",
    },
    { label: "% out", accessor: "-1",
    },
  ];

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

  const chosenPuckid = useStore(state => state.chosenPuckid);
  const selectedRegIds = useStore(state => state.selectedRegIds);
  const chosenGene = useStore(state => state.chosenGene);

  const [ridToIdx, setRidToIdx] = useState({});
  const [inFracs, setInFracs] = useState([]);
  const [outFracs, setOutFracs] = useState([]);
  const [geneNames, setGeneNames] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [minFrac, setMinFrac] = useState(0); // at least frac
  const [maxFrac, setMaxFrac] = useState(1); // at most frac
  const setCurrentREgene = useStore(state => state.setCurrentREgene);

  // useEffect(()=>{
  //     if (sortField===""){
  //       setSortField("1");
  //       handleSorting(sortField, "asc", 1);
  //       setTableDataSorted(tableData);
  //     }

  //       console.log("XXX" ,tableData);
    
  // }, [tableData]);


  useEffect(()=>{

    const fetchData = async (row_idx) => {
      // console.log("LLL");
      let zarrPathInBucket = `https://storage.googleapis.com/ml_portal/test_data/`
      let zloader = new ZarrLoader({zarrPathInBucket});
      // let dataRow = await zloader.getDataRow("nz_aggr.zarr/rids/X", row_idx);


      // loop though selectedRegIds and get nz counts for each region
      if (selectedRegIds.length>0){ // create new array
        let row_idx = ridToIdx[selectedRegIds[0]];
        let [dataRow, dataRowOut] = await Promise.all([zloader.getDataRow(`nz_aggr.zarr/p${chosenPuckid}/X`, row_idx), 
          zloader.getDataRow(`nz_aggr.zarr/p${chosenPuckid}/Xout`, row_idx)]);

        let inFracsTmp = dataRow; // for case with only one region selected
        let outFracsTmp = dataRowOut;

        if (selectedRegIds.length>1){ // add to existing array for >1 region selected
          for (let i=1; i<selectedRegIds.length; i++){
            let row_idx = ridToIdx[selectedRegIds[i]];
            let [dataRow, dataRowOut] = await Promise.all([zloader.getDataRow(`nz_aggr.zarr/p${chosenPuckid}/X`, row_idx), zloader.getDataRow(`nz_aggr.zarr/p${chosenPuckid}/Xout`, row_idx)]);
            for (let j=0; j<dataRow.length; j++){
              inFracsTmp[j] += dataRow[j];
              outFracsTmp[j] += dataRowOut[j];
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
    fetchData(0);
  },[chosenPuckid, selectedRegIds]);

  useEffect(()=>{

    const fetchData = async (row_idx) => {
      // console.log("LLL");
      let zarrPathInBucket = `https://storage.googleapis.com/ml_portal/test_data/`
      let zloader = new ZarrLoader({zarrPathInBucket});
      let dataRow = await zloader.getDataRow("nz_aggr.zarr/rids/X", row_idx);

      console.log("dataRow:", dataRow);

      let ridToIdxTmp = {};
      for (let i=0; i<dataRow.length; i++){
        ridToIdxTmp[dataRow[i]] = i;
      }
      setRidToIdx(ridToIdxTmp);

      let geneNamesPath = `https://storage.googleapis.com/ml_portal/test_data/gene_names.json`
      // let geneOptionsUrl = await getUrl(geneNamesPath);
      console.log("geneOptionsUrl ", geneNamesPath);
      // const geneOptions = await load(geneOptionsUrl, [CSVLoader], {csv:{delimiter:":"}});
      fetch(geneNamesPath)
        .then(function(response){
          return response.json();
        })
        .then(function(myJson) {
          setGeneNames(myJson.data)
        });


    }
    fetchData(0);
  },[]);

  useEffect(()=>{

    if (inFracs.length===outFracs.length && outFracs.length===geneNames.length){
      let fullDataTmp = [];
      for (let i=0; i<geneNames.length; i++){
        fullDataTmp.push({"key":i, "g": geneNames[i], "1":Math.round(inFracs[i]*1000)/1000, "-1": Math.round(outFracs[i]*1000)/1000})
      }

      // console.log(fullDataTmp);
      setFullData(fullDataTmp);

    }else{
      console.log("NO", inFracs.length, outFracs.length, geneNames.length);
      setFullData([]);
    }


  }, [geneNames, inFracs, outFracs]);


  useEffect(()=>{


    let filterdData = fullData.filter(obj=>{return (obj['1'] > minFrac) && (obj['-1'] < maxFrac) });
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


  let maxRows = 100;

  return(
    <>
      <h6>Region Enrichment{tableDataFiltered.length>0?<><span> : </span><span style={{backgroundColor:"#ccccff"}}>showing {tableDataFiltered.length>maxRows?maxRows:tableDataFiltered.length} out of {tableDataFiltered.length}</span></>:""} </h6>
        <Row>
          <Col xs="5">
            <Row>
              <Col xs="7">
                Min nz bead % in region &gt;
              </Col>
              <Col xs="5"> 
                <RangeSlider
                  value={minFrac}
                  onChange={e=>setMinFrac(e.target.value)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Col>
            </Row>
            <Row>
          <Col xs="7">
            Max nz bead % out of region &lt;
          </Col>
          <Col xs="5"> 
            <RangeSlider
              value={maxFrac}
              onChange={e=> setMaxFrac(e.target.value)}
              min={0}
              max={1}
              step={0.01}
            />
          </Col>
            </Row>
          </Col>
          <Col xs="7">
          <TableGeneric columns={columns} tableDataSorted={tableDataSorted} maxRows={maxRows} width={100} handleSorting={handleSorting} setChosenGene={setChosenGene}/>
          </Col>
        </Row>
    </>
  );
}

export default RegEnrich;
