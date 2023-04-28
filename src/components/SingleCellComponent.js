import Breadcrumbs from './BreadcrumbsComponent'
import {useEffect, useRef, useMemo } from 'react';
import {getUrl, fetchJson} from "../shared/common"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ZarrLoader from "../loaders/ZarrLoader"
import {Col, Row, FormGroup, FormLabel} from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import produce from "immer";
import {useStore, usePersistStore} from '../store/store'
import {useSCComponentStore} from '../store/SCComponentStore'
import {useSCComponentPersistStore} from '../store/SCComponentStore'
import { useSortableTable } from "./table/hooks";
import Colorbar from '../components/ColorbarComponent'
import {Form} from 'react-bootstrap'
import Dendrogram from './DendrogramComponent'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
// import ReactGA from "react-ga4";
import GeneOverviewsComponent from './singlecell/GeneOverviewsComponent'
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import {useQuery} from 'react-query'
import Table from './TableComponent'


function SingleCell({dataConfig}){

  const {basePath, dpathScZarr, dpathMappedCellTypesToIdx, dpathRegionToCelltype, dpathIdAcroNameMap} = dataConfig;
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // console.log(user)
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const maxCellTypes = useSCComponentPersistStore(state => state.maxCellTypes);
  const setMaxCellTypes = useSCComponentPersistStore(state => state.setMaxCellTypes);

  const minCompoPct = useSCComponentPersistStore(state => state.minCompoPct);
  const setMinCompoPct = useSCComponentPersistStore(state => state.setMinCompoPct);

  const multiSelections = useSCComponentPersistStore(state => state.multiSelections);
  const setMultiSelections = useSCComponentPersistStore(state => state.setMultiSelections);

  const cellClassSelection = useSCComponentPersistStore(state => state.cellClassSelection);
  const setCellClassSelection = useSCComponentPersistStore(state => state.setCellClassSelection);

  const [tableData, setTableData] = useState([]);
  const [rawTableData, setRawTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [geneOptions, setGeneOptions] = useState([]);
  const [geneOptionsForDisplay, setGeneOptionsForDisplay] = useState([]);
  const [globalMaxAvgVal, setGlobalMaxAvgVal] = useState(0);
  const adaptNormalizerStatus = useSCComponentPersistStore(state => state.adaptNormalizerStatus);
  const setAdaptNormalizerStatus = useSCComponentPersistStore(state => state.setAdaptNormalizerStatus);
  // const [mappedCelltypeToIdx, setMappedCelltypeToIdx] = useState({});
  const [regionToCelltype, setRegionToCelltype] = useState(()=>{});
  const [cellClassOptions, setCellClassOptions] = useState(()=>[]);
  const prevMultiSelections = useRef([]);
  const setCurrentColorMap = useSCComponentStore(state => state.setCurrentColorMap);
  const maxAvgVal = useSCComponentStore(state => state.maxAvgVal);
  const setMaxAvgVal = useSCComponentStore(state => state.setMaxAvgVal);
  const sortByToggleVal = useSCComponentPersistStore(state => state.sortByToggleVal);
  const toggleSortByToggleVal = useSCComponentPersistStore(state => state.toggleSortByToggleVal);
  const tableDataFiltered = useSCComponentStore(state => state.tableDataFiltered);
  const setTableDataFiltered = useSCComponentStore(state => state.setTableDataFiltered);
  const selectedRegIds = usePersistStore(state => state.selectedRegIds);
  const selectedRegions = usePersistStore(state => state.selectedRegions);
  const [downsampledTableData, setDownsampledTableData] = useState({});
  const acroToNameMap = usePersistStore(state => state.acroToNameMap);
  const setAcroToNameMap = usePersistStore(state => state.setAcroToNameMap);

  const maxColVals = useStore(state => state.maxColVals);
  const setMaxColVals = useStore(state => state.setMaxColVals);

  let scPathInBucket = `${basePath}${dpathScZarr}`;
  const maxProportionalVal = useSCComponentStore(state => state.maxProportionalVal);
  const setMaxProportionalVal = useSCComponentStore(state => state.setMaxProportionalVal);
  
  const sortField = useSCComponentPersistStore(state => state.sortField);
  const setSortField = useSCComponentPersistStore(state => state.setSortField);
  const order = useSCComponentPersistStore(state => state.order);
  const setOrder = useSCComponentPersistStore(state => state.setOrder);

  const regionTreeJson = usePersistStore(state => state.regionTreeJson);
  const setRegionTreeJson = usePersistStore(state => state.setRegionTreeJson);
  const [regionTree, setRegionTree] = useState(null);

  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);

  // set page title
  useEffect(() => {
    // ReactGA.send({ hitType: "pageview", page: "/singlecell" });
    document.title = "Single Cell | BrainCellData Viewer";
  }, []);

  // read, build, and set region tree
  useEffect(()=>{
    const fetchData = async () => {
      let regionArrayDataPath = `test_data2/s9f/regions_array.json`
      let regionArrayDataUrl = await getUrl(regionArrayDataPath);
      const readData = await fetch(regionArrayDataUrl)
       .then(response => response.json());

      setRegionTreeJson(readData);
      var tree_util = require('tree-util')
      var standardConfig =  { id : 'id', parentid : 'parentid'};
      var trees = tree_util.buildTrees(readData, standardConfig);
      setRegionTree(trees[0]);

    }
    if (regionTreeJson === null){ 
      fetchData();
    }else{
      var tree_util = require('tree-util')
      var standardConfig =  { id : 'id', parentid : 'parentid'};
      var trees = tree_util.buildTrees(regionTreeJson, standardConfig);
      setRegionTree(trees[0]);
    }


  },[]);


  // helper function to create new geneOptions list with cool genes at top
  const moveCoolGenesToTop = (allGenes) => {
    const coolGenes = ['Siglech', 'Flt1', 'Dcn',  'Pitx2', 'Nrk', 'Slc6a4','Slc6a3', 'Sst', 'Vip'];
    // remove multiSelections from coolGenes to remove already selected cool genes from dropdown
    const coolGenesFiltered = coolGenes.filter(x => !multiSelections.includes(x));

    const allGenesCopy = [...allGenes];

    // iterate over coolGenesFiltered and move them to top of allGenes
    for (let i=0; i<coolGenesFiltered.length; i++){
      let idx = allGenesCopy.findIndex(x => x === coolGenesFiltered[i]);
      if (idx !== -1){
        let gene = allGenesCopy[idx];
        allGenesCopy.splice(idx, 1);
        allGenesCopy.unshift(gene);
      }
    }

    return  allGenesCopy;
  }

  // get zarr store connection and initialize geneOptions and geneOptionsForDisplay. Inits tableData and tableDataSorted
  useEffect(()=>{


    const fetchData = async () => {
      let zloader = new ZarrLoader({zarrPathInBucket:scPathInBucket});
      let mappedCelltypeToIdxFile =`${basePath}${dpathMappedCellTypesToIdx}`;
      let regionToCelltypeFile = `${basePath}${dpathRegionToCelltype}`
      // let dataGenes = await zloader.getFlatArrDecompressed("z_proportions.zarr/var/human_name/categories");
      // let dataCellTypesRaw = await zloader.getFlatArrDecompressed("z_proportions.zarr/obs/_index");
      let [dataGenes, dataCellTypesRaw, dataCellClasses, dataMaxPct, dataUniqCellClasses, dataMapStatus,
          dataTopStructs,
          dataMappedCellTypesToIdx, dataRegionToCellTypeMap,
          dataGlobalMaxAvgVal, 
          dataGeneSetCover, 
          dataNeuroTrans, 
          dataNeuroPep, 
          dataNeuroPepRecep] = await Promise.all(
        [zloader.getFlatArrDecompressed("/var/genes"),
          zloader.getFlatArrDecompressed("/obs/clusters"), 
          zloader.getFlatArrDecompressed("/metadata/cellclasses"), 
          zloader.getFlatArrDecompressed("/metadata/maxpcts"), // pct contribution from majority contributing cell class
          zloader.getFlatArrDecompressed("/metadata/uniqcellclasses"), 
          zloader.getFlatArrDecompressed("/metadata/mapStatus"), 
          zloader.getFlatArrDecompressed("/metadata/topstructs1"), 
          fetchJson(mappedCelltypeToIdxFile), 
          fetchJson(regionToCelltypeFile),
          zloader.getFlatArrDecompressed("/metadata/globalMaxAvgVal"),
          zloader.getFlatArrDecompressed("/metadata/geneCovers"),
          zloader.getFlatArrDecompressed("/metadata/neuroTrans"),
          zloader.getFlatArrDecompressed("/metadata/neuroPep"),
          zloader.getFlatArrDecompressed("/metadata/neuroPepRecep"),
          zloader.getFlatArrDecompressed("/metadata/neuroPepRecep")
          ]); 

      // let dataX = await zloader.getDataColumn("z1.zarr/X", 0);
      // console.log(dataGenes);
      setCellClassOptions(dataUniqCellClasses);
      console.log('dataCellTypesRaw', dataCellTypesRaw.length);

      let myRe = /=([\s\S]*)$/
      let dataCellTypes = dataCellTypesRaw.map(x=>myRe.exec(x)[0].slice(1));
      const coolGenesOnTopArray = moveCoolGenesToTop(dataGenes);
      setGeneOptions(dataGenes);
      setGeneOptionsForDisplay(coolGenesOnTopArray);
      let initTableData = new Array(dataCellTypes.length).fill({})
      initTableData = initTableData.map((x,i)=>{return {"id":i, "ct":dataCellTypes[i], "cc":dataCellClasses[i], "pct":parseFloat(dataMaxPct[i]), "st":dataMapStatus[i], "tr":dataTopStructs[i], "cid":dataMappedCellTypesToIdx[dataCellTypes[i]], "gs":dataGeneSetCover[i], "nt":dataNeuroTrans[i], "np":dataNeuroPep[i], "npr":dataNeuroPepRecep[i]}}) // cid:celltype idx
      setRawTableData(initTableData);
      // setTableDataSorted(initTableData);
      // setMappedCelltypeToIdx(dataMappedCellTypesToIdx);
      setRegionToCelltype(dataRegionToCellTypeMap);
      setGlobalMaxAvgVal(parseFloat(dataGlobalMaxAvgVal[0]));

    }

    fetchData();
    prevMultiSelections.current = [];

  }, []);

  // update geneOptionsForDisplay when multiSelections changes
  useEffect(()=>{
      const coolGenesOnTopArray = moveCoolGenesToTop(geneOptions);
      setGeneOptionsForDisplay(coolGenesOnTopArray);
  }, [multiSelections, geneOptions]);

  // fetch the idAcroNameMap and populate acroToNameMap
  const fetchAcroToNameMap = () => {

    let acroIdNameMapFile = `${basePath}${dpathIdAcroNameMap}`;

    return load(acroIdNameMapFile, [CSVLoader], {csv:{delimiter:"\t"}})
            .then((acroIdNameMap) => {
                let acroToNameMapTmp = {};
                acroIdNameMap.forEach(x=>acroToNameMapTmp[x.column2] = x.column3);
                setAcroToNameMap(acroToNameMapTmp);
                return Promise.resolve(acroToNameMapTmp);

              });
      }

  const queryAcroToNameMap = useQuery(
    ["acroIdToNameMap"],
    fetchAcroToNameMap,
  );

  useEffect(()=>{

    // console.log('rawtabledata11 in lone useEffect', rawTableData, prevMultiSelections.current);
    console.log('rawtabledata11 sortfield', sortField, 'order', order);
    
  }, [sortField]);

  // updating tableData json array on change in selected genes
  useEffect(()=>{
    const fetchData = async (col_idxs, tableDataTmp) => {

      for (const col_idx of col_idxs){
        let zloader = new ZarrLoader({zarrPathInBucket:scPathInBucket});
        let [dataCol, avgDataCol, countDataCol] = await Promise.all([zloader.getDataColumn("/nz_pct/X", col_idx),
                                                    zloader.getDataColumn("/avg/X", col_idx), 
                                                    zloader.getDataColumn("/counts/X", col_idx)]);

        const scol_idx = col_idx+1; // shifted col_idx to avoid zero with no corresponding negative value
        tableDataTmp = tableDataTmp.map((x,i)=>produce(x, draft=>{
          draft[String(scol_idx)] = [parseFloat(dataCol[i]),parseFloat(avgDataCol[i])] ;
          // draft[String(-scol_idx)] = avgDataCol[i];
          draft['c'+String(scol_idx)] = countDataCol[i];
        }));

      }

      setTableData(tableDataTmp);

      // if (sortField===""){
      //   const scol_idx = col_idxs[0]+1;
      //   setSortField(String(scol_idx));
      //   // handleSorting(scol_idx, order, sortByToggleVal); // also sets tableDataSorted
      // }
    }

    // identify newly added or removed gene and update tableData accordingly
    let added = null, removed = null;
    if (rawTableData.length>0){
      if (prevMultiSelections.current.length<multiSelections.length){ // gene added
        added = multiSelections.filter(x => !prevMultiSelections.current.includes(x));

        // iterate over added
        let columnsTmp = columns;
        let col_idxs = [];
        added.forEach((gene, i)=>{
          let colIdx = geneOptions.indexOf(added[i]);
          col_idxs.push(colIdx);
          // fetchData(colIdx); // reminder: async function
          // adding gene entry to columns array
          const scolIdx = colIdx+1; // shifted col_idx to avoid zero with no corresponding negative value
          columnsTmp.push({"Header":added[i], 
                          "accessor":String(scolIdx),
                          "isDotplot":true,
                          "disableFilters":true,});
        });
        let tableDataTmp = tableData.length===0?rawTableData.map(x=>x):tableData.map(x=>x); // diff inits for first and following times
        fetchData(col_idxs, tableDataTmp);
        setColumns(columnsTmp);
        if (multiSelections.length===1){
          setSortField(String(col_idxs[0]+1));
        }

      }else if(prevMultiSelections.current.length>multiSelections.length){ // gene removed
        removed = prevMultiSelections.current.filter(x => !multiSelections.includes(x));
        console.log('removed', removed);
        let colIdx = geneOptions.indexOf(removed[0]);
        const scolIdx = colIdx+1; // shifted col_idx to avoid zero with no corresponding negative value
        let tableDataTmp = tableData.map((x,i)=>produce(x, draft=>{
          delete draft[String(scolIdx)];
          // delete draft[String(-scolIdx)];
          delete draft['c'+String(scolIdx)];
        }));
        setTableData(tableDataTmp);

        // removing gene entry from column array
        let columnsTmp = columns.filter(x=>x.accessor!==String(scolIdx));
        setColumns(columnsTmp);
        
        let sortFieldAfterGeneRemoval = "";
        if (columnsTmp.length>0){
          sortFieldAfterGeneRemoval = columnsTmp.at(-1).accessor;
        }
        if (sortField===String(scolIdx)){
          // Removing the current sortField
          setSortField(sortFieldAfterGeneRemoval);
        }
        else{
          // Removig field that is not current sortField
          // handleSorting(sortField, order, sortByToggleVal); // calls setTableDataSorted internally
        }

      }
      prevMultiSelections.current=multiSelections;
    }


  },[multiSelections, rawTableData]);

  // sort table once tableData is updated with selected genes data
  useEffect(()=>{
    
        // console.log('tableData', tableData, 'columns', columns, 'rtColumns', rtColumns, prevMultiSelections);
        // handleSorting(sortField, order, sortByToggleVal); // also sets tableDataSorted

  },[tableData, sortField, order]);
  
  useEffect(()=>{

    setTableDataFiltered(tableData);

  },[tableData]);


  function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

  const rtColumns = useMemo(() => {
    const tmpRtCols = [ // react-table columns
    {
      Header: 'Celltype',
      accessor: 'ct',
      disableSortBy: true,
    },
    {
      Header: 'class',
      accessor: 'cc',
      disableSortBy: true,
      Filter: SelectColumnFilter,
      filter: 'includes',
    },
    {
      Header: 'topstructure',
      accessor: 'tr',
      disableSortBy: true,
    },
    {
      Header: 'geneset',
      accessor: 'gs',
      disableSortBy: true,
      filter: 'fuzzyText',
    },
    {
      Header: 'neurotrans_binary',
      accessor: 'nt',
      disableSortBy: true,
      filter: 'fuzzyText',
    },
    {
      Header: 'neuropep',
      accessor: 'np',
      disableSortBy: true,
      filter: 'fuzzyText',
    },
    {
      Header: 'receptor',
      accessor: 'npr',
      disableSortBy: true,
      filter: 'fuzzyText',
    },
  ]
    const tmpColumns = columns.map(col=>({
      ...col, 
  "sortType": (rowA, rowB, columnId, desc) => {
    // console.log('rowA', rowA, rowB);
    // if(desc){
      if (sortByToggleVal===-1){
        return (rowA.values[columnId][0] - rowB.values[columnId][0]);
      }else{
        return (rowA.values[columnId][1] - rowB.values[columnId][1]);
      }
    // }
    // else{
    //   if (sortByToggleVal===-1){
    //     return (rowB.values[columnId][0] - rowA.values[columnId][0]);
    //   }else{
    //     return (rowB.values[columnId][1] - rowA.values[columnId][1]);
    //   }
    // } 
    }}));

    tmpRtCols.push(...tmpColumns);

    return tmpRtCols;

  }, [tableData, sortByToggleVal]); // note 'order' is not explicity dependency here


  return(
    <>
      <Breadcrumbs/>
      <div className="d-flex" style={{flexDirection:"column", flexGrow:1}}>
        <Row>
          <Col xs="2">Select genes:</Col>
          <Col xs="6">
            <Typeahead
              id="basic-typeahead-multiple"
              labelKey="name"
              multiple
              onChange={setMultiSelections}
              options={geneOptionsForDisplay}
              placeholder="Click here to select genes..."
              selected={multiSelections}
              filterBy={(option, props) => {
                /* Own filtering code goes here. */
                return (option.toLowerCase().indexOf(props.text.toLowerCase()) === 0)
              }}
            />
          </Col>
          <Col xs="2">Max #celltypes:</Col>
          <Col xs="2">
            <RangeSlider
              value={maxCellTypes}
              onChange={e => setMaxCellTypes(e.target.value)}
              min={0}
              max={130}
              step={1}
              tooltipPlacement="top"
              id="maxCellTypesSlider"
            />
          </Col>
        </Row>
        {columns.length>0?
        <Row className="mt-2">
          <Col xs="2">Select a cell class:</Col>
          <Col xs="2">
            <Typeahead
              id="cellclass-typeahead"
              labelKey="name"
              onChange={setCellClassSelection}
              options={cellClassOptions}
              placeholder="Currently showing all cell classes..."
              selected={cellClassSelection}
            />
          </Col>
          {selectedRegIds.length>0?<>
          <Col xs="2">Min composition %: </Col>
          <Col xs="2">
            <RangeSlider
              value={minCompoPct*100}
              onChange={e => setMinCompoPct(e.target.value/100)}
              min={0}
              max={100}
              step={1}
              tooltipPlacement="top"
            />
          </Col> </>:<Col xs="4"></Col>}
          <Col xs="1">
            Normalizer: 
          </Col>
          <Col xs="1">
            <BootstrapSwitchButton 
              checked={adaptNormalizerStatus} onstyle="outline-primary" offstyle="outline-secondary" width={70}
              onlabel="Adapt" offlabel="Fix" 
              onChange={(checked) => {if (checked){ setAdaptNormalizerStatus(true)}else{setAdaptNormalizerStatus(false)}}}/>
          </Col>
          <Col xs="2">
            {/* <RangeSlider */}
            {/*   value={minCompoPct} */}
            {/*   onChange={e => setMinCompoPct(e.target.value)} */}
            {/*   min={0} */}
            {/*   max={100} */}
            {/*   step={1} */}
            {/* /> */}
          </Col>
        </Row>:null}
        <Row>
          {columns.length>0?
            <>
              <Col xs="9">
                <div style={{float:'left', width:'70%'}}>&nbsp;</div>
                <div style={{ float:'left', width:'29%'}}>
                  <GeneOverviewsComponent columns={columns} downsampledTableData={downsampledTableData}/>
                </div>
              </Col>
              <Col cs="3"></Col>
            </>:null}
        </Row>
        <Row className="d-flex" style={{flexDirection:"row", flexGrow:1}}>
          <Col className="" xs="9">
            {columns.length>0?
              <div style={{overflow:"scroll", height:'70vh'}}>
                <Table columns={rtColumns} data={tableData} sortField={sortField} setSortField={setSortField} sortOrder={order} 
                    setSortOrder={setOrder} 
                    adaptNormalizerStatus={adaptNormalizerStatus}
                    maxCellTypes={maxCellTypes}
                    setMaxAvgVal={setMaxAvgVal}
                    globalMaxAvgVal={globalMaxAvgVal}
                    sortByToggleVal={sortByToggleVal}
                />
              </div>:null}
          </Col>
          <Col xs="3">
            <Row style={{marginTop:"10px"}}>
              {columns.length>0?<>
                <Form.Check
                  value="sortbyavgexp"
                  type="radio"
                  aria-label="sort by avg exp"
                  label="Sort by AvgExpression"
                  onChange={toggleSortByToggleVal}
                  checked={sortByToggleVal===1}
                />
                <Colorbar style={{marginTop:"5px"}} max={maxAvgVal} cells={7} setCurrentColorMap={setCurrentColorMap} barWidth={26}/> </> :null
              }
            </Row>
            <Row style={{marginTop:"25px"}}>
              {maxProportionalVal>0? 
                <>
                  <Form.Check
                    value="sortbypercentexp"
                    type="radio"
                    aria-label="sort by percent exp"
                    label="Sort by PercentExpression"
                    onChange={toggleSortByToggleVal}
                    checked={sortByToggleVal===-1}
                  />
                  <div style={{marginTop:"5px"}}>
                    <div><span className="dotlegend"><span className="dot" style={{width:"16px", height:"16px", backgroundColor:"gray"}}></span></span>{Math.round(maxProportionalVal*100)} %</div>
                    <div><span className="dotlegend"><span className="dot" style={{width:"12px", height:"12px", backgroundColor:"gray"}}></span></span>{Math.round(maxProportionalVal*75)} %</div>
                    <div><span className="dotlegend"><span className="dot" style={{width:"8px", height:"8px", backgroundColor:"gray"}}></span></span>{Math.round(maxProportionalVal*50)} %</div>
                    <div><span className="dotlegend" style={{textAlign:"center"}}><span className="dot" style={{width:"4px", height:"4px", backgroundColor:"gray"}}></span></span>{Math.round(maxProportionalVal*25)} %</div>
                  </div>
                </>:null
              }
            </Row>
            <Row>
              <Dendrogram
                showDendrobar={false}
                divWidth="100%" divHeight="100%"
                sbarWidth={100} sbarHeight={240}
              />
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default SingleCell;

// https://stackoverflow.com/questions/40589499/what-do-the-signs-in-numpy-dtype-mean
// https://codesandbox.io/s/react-with-bootstrap-and-radio-buttons-u3zr3?file=/src/App.js:590-754
