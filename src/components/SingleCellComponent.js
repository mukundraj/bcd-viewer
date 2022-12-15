import Breadcrumbs from './BreadcrumbsComponent'
import {useEffect, useRef } from 'react';
import {getUrl, fetchJson} from "../shared/common"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ZarrLoader from "../loaders/ZarrLoader"
import {Col, Row, FormGroup, FormLabel} from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import produce from "immer";
import Table from './table/TableComponent'
import {useStore, usePersistStore} from '../store/store'
import {useSCComponentStore} from '../store/SCComponentStore'
import { useSortableTable } from "./table/hooks";
import Colorbar from '../components/ColorbarComponent'
import {Form} from 'react-bootstrap'
import Dendrogram from './DendrogramComponent'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


function SingleCell(props){

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

  const [maxCellTypes, setMaxCellTypes] = useState(10);
  const [minCompoPct, setMinCompoPct] = useState(0.25);
  const [multiSelections, setMultiSelections] = useState([]);
  const [cellClassSelection, setCellClassSelection] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [geneOptions, setGeneOptions] = useState([]);
  const [globalMaxAvgVal, setGlobalMaxAvgVal] = useState(0);
  const [adaptNormalizerStatus, setAdaptNormalizerStatus] = useState(true);
  // const [mappedCelltypeToIdx, setMappedCelltypeToIdx] = useState({});
  const [regionToCelltype, setRegionToCelltype] = useState(()=>{});
  const [cellClassOptions, setCellClassOptions] = useState(()=>[]);
  const prevMultiSelections = useRef([]);
  const cellTypeColumn = [{"label":"celltype \t\t\t\t\t\t\t", "accessor":"ct"}] // tabs maintain col width, consequently col height
  const cellClassColumn = [{"label":"cellclass \t\t\t\t\t\t\t", "accessor":"cc"}] // tabs maintain col width, consequently col height
  const topStructureColumn = [{"label":"topstructure \t\t\t\t\t\t\t", "accessor":"tr"}] // tabs maintain col width, consequently col height
  const setTableDataSorted = useStore(state => state.setTableDataSorted);
  const setCurrentColorMap = useSCComponentStore(state => state.setCurrentColorMap);
  const maxAvgVal = useSCComponentStore(state => state.maxAvgVal);
  const setMaxAvgVal = useSCComponentStore(state => state.setMaxAvgVal);
  const sortByToggleVal = useSCComponentStore(state => state.sortByToggleVal);
  const toggleSortByToggleVal = useSCComponentStore(state => state.toggleSortByToggleVal);
  const tableDataFiltered = useSCComponentStore(state => state.tableDataFiltered);
  const setTableDataFiltered = useSCComponentStore(state => state.setTableDataFiltered);
  const selectedRegIds = usePersistStore(state => state.selectedRegIds);


  const maxColVals = useStore(state => state.maxColVals);
  const setMaxColVals = useStore(state => state.setMaxColVals);

  let scPathInBucket  = `https://storage.googleapis.com/bcdportaldata/singlecell_data`;
  const maxProportionalVal = useSCComponentStore(state => state.maxProportionalVal);
  const setMaxProportionalVal = useSCComponentStore(state => state.setMaxProportionalVal);
  
  const sortField = useStore(state => state.sortField);
  const setSortField = useStore(state => state.setSortField);
  const order = useStore(state => state.order);
  const setOrder = useStore(state => state.setOrder);

  useEffect(()=>{ // since 'order' is shared between component - fix it sometime
    setOrder("desc");
    setSortField("");
  },[]);

  // get zarr store connection and initialize geneOptions
  useEffect(()=>{
    const fetchData = async () => {
      let zloader = new ZarrLoader({zarrPathInBucket:scPathInBucket});
      let mappedCelltypeToIdxFile =`${scPathInBucket}/s2/s2_regtocell/mappedCellType_to_idx.json`;
      let regionToCelltypeFile = `${scPathInBucket}/s2/s2_regtocell/region_to_celltype.json`
      // let dataGenes = await zloader.getFlatArrDecompressed("z_proportions.zarr/var/human_name/categories");
      // let dataCellTypesRaw = await zloader.getFlatArrDecompressed("z_proportions.zarr/obs/_index");
      let [dataGenes, dataCellTypesRaw, dataCellClasses, dataMaxPct, dataUniqCellClasses, dataMapStatus,
          dataTopStructs,
          dataMappedCellTypesToIdx, dataRegionToCellTypeMap,
          dataGlobalMaxAvgVal] = await Promise.all(
        [zloader.getFlatArrDecompressed("/scZarr.zarr/var/genes"),
          zloader.getFlatArrDecompressed("/scZarr.zarr/obs/clusters"), 
          zloader.getFlatArrDecompressed("/scZarr.zarr/metadata/cellclasses"), 
          zloader.getFlatArrDecompressed("/scZarr.zarr/metadata/maxpcts"), // pct contribution from majority contributing cell class
          zloader.getFlatArrDecompressed("/scZarr.zarr/metadata/uniqcellclasses"), 
          zloader.getFlatArrDecompressed("/scZarr.zarr/metadata/mapStatus"), 
          zloader.getFlatArrDecompressed("/scZarr.zarr/metadata/topstructs"), 
          fetchJson(mappedCelltypeToIdxFile), 
          fetchJson(regionToCelltypeFile),
          zloader.getFlatArrDecompressed("/scZarr.zarr/metadata/globalMaxAvgVal")
          ]); 

      // let dataX = await zloader.getDataColumn("z1.zarr/X", 0);
      // console.log(dataGenes);
      setCellClassOptions(dataUniqCellClasses);

      let myRe = /=([\s\S]*)$/
      let dataCellTypes = dataCellTypesRaw.map(x=>myRe.exec(x)[0].slice(1));
      setGeneOptions(dataGenes);
      let initTableData = new Array(dataCellTypes.length).fill({})
      initTableData = initTableData.map((x,i)=>{return {"id":i, "ct":dataCellTypes[i], "cc":dataCellClasses[i], "pct":parseFloat(dataMaxPct[i]), "st":dataMapStatus[i], "tr":dataTopStructs[i], "cid":dataMappedCellTypesToIdx[dataCellTypes[i]]}}) // cid:celltype idx
      setTableData(initTableData);
      setTableDataSorted(initTableData);
      // setMappedCelltypeToIdx(dataMappedCellTypesToIdx);
      setRegionToCelltype(dataRegionToCellTypeMap);
      setGlobalMaxAvgVal(parseFloat(dataGlobalMaxAvgVal[0]));
      // console.log('initTableData', initTableData);

      // let zloader2 = new ZarrLoader({scPathInBucket});
      // let dataGenes2 = await zloader2.getFlatArrDecompressed("scZarr.zarr/var/genes");
      // let dataCellTypesRaw2 = await zloader2.getFlatArrDecompressed("scZarr.zarr/obs/clusters");
      // console.log('dataGenes2', dataGenes2);
      // console.log('datacellTypesRaw2', dataCellTypesRaw2);
    }

    fetchData();

  }, []);

  // updating tableData json array on change in selected genes
  useEffect(()=>{
    const fetchData = async (col_idx) => {
      let zloader = new ZarrLoader({zarrPathInBucket:scPathInBucket});
      // let zloader2 = new ZarrLoader({scPathInBucket});
      // let dataCol = await zloader.getDataColumn("z_proportions.zarr/X", col_idx);
      // let [dataCol, avgDataCol] = await Promise.all([zloader.getDataColumn("z_proportions.zarr/X", col_idx),
      //                                             zloader2.getDataColumn("z_avgs.zarr/X", col_idx)]);
      let [dataCol, avgDataCol] = await Promise.all([zloader.getDataColumn("/scZarr.zarr/nz/X", col_idx),
                                                  zloader.getDataColumn("/scZarr.zarr/avg/X", col_idx)]);
      const scol_idx = col_idx+1; // shifted col_idx to avoid zero with no corresponding negative value
      let tableDataTmp = tableData.map((x,i)=>produce(x, draft=>{
        draft[scol_idx] = dataCol[i];
        draft[-scol_idx] = avgDataCol[i];
      }));
      setTableData(tableDataTmp);
      if (sortField===""){
        setSortField(scol_idx);
        setTableDataSorted(tableDataTmp);
        handleSorting(sortField, order, sortByToggleVal);
        // console.log(tableDataTmp);
      }
      // else{
      //   handleSorting(sortField, order);
      // }
    }

    // identify newly added or removed gene and update tableData accordingly
    let added = null, removed = null;
    if (prevMultiSelections.current.length<multiSelections.length){ // gene added
      added = multiSelections.filter(x => !prevMultiSelections.current.includes(x));
      console.log('added', added);
      let colIdx = geneOptions.indexOf(added[0]);
      fetchData(colIdx); // reminder: async function

      // adding gene entry to columns array
      let columnsTmp = columns;
      const scolIdx = colIdx+1; // shifted col_idx to avoid zero with no corresponding negative value
      columnsTmp.push({"label":added[0], "accessor":scolIdx, "sortable":true});
      setColumns(columnsTmp);
      console.log(columnsTmp);

    }else if(prevMultiSelections.current.length>multiSelections.length){ // gene removed
      removed = prevMultiSelections.current.filter(x => !multiSelections.includes(x));
      console.log('removed', removed);
      let colIdx = geneOptions.indexOf(removed[0]);
      const scolIdx = colIdx+1; // shifted col_idx to avoid zero with no corresponding negative value
      let tableDataTmp = tableData.map((x,i)=>produce(x, draft=>{
        delete draft[scolIdx];
        delete draft[-scolIdx];
      }));
      setTableData(tableDataTmp);

      // removing gene entry from column array
      let columnsTmp = columns.filter(x=>x.accessor!==scolIdx);
      setColumns(columnsTmp);

      let sortFieldAfterGeneRemoval = "";
      if (columnsTmp.length>0){
        sortFieldAfterGeneRemoval = columnsTmp.at(-1).accessor;
      }
      console.log(columnsTmp);

      console.log("sortField", sortField, colIdx, scolIdx, sortField===scolIdx);
      if (sortField===scolIdx){
        // Removing the current sortField
        setSortField(sortFieldAfterGeneRemoval);
        setTableDataSorted(tableDataTmp);
      }else{
        // Removig field that is not current sortField
        handleSorting(sortField, order, sortByToggleVal); // calls setTableDataSorted internally
      }


      // // removing the max col val for the removed column
      // setMaxColVals(produce(maxColVals, draft=>{
      //   delete draft[colIdx];
      // }));

    }

    console.log('multiSelections', multiSelections);
    prevMultiSelections.current=multiSelections;

  },[multiSelections]);

  const tableDataSorted = useStore(state => state.tableDataSorted);

  // filter tableDataSorted based on cellClassSelection
  useEffect(()=>{
    console.log('cellClassSelection ', cellClassSelection, 'tableData');
    console.log('selectedRegIds', selectedRegIds);

    let wantedCelltypes = new Set();

    // iterate over selectedRegIds
    for (let i=0; i<selectedRegIds.length; i++){
      if (!!regionToCelltype){
        console.log('selectedRegIds ', selectedRegIds[i]);
        const cellIdxInRegion = regionToCelltype[selectedRegIds[i]]; // cell idx among mapped region of chosen region
        console.log('cellIdxInRegion', cellIdxInRegion)
        // for (const cidx of cellIdxInRegion){
        for (const cidx in cellIdxInRegion){
          // wantedCelltypes.add(cidx);
          if (cellIdxInRegion[cidx]>minCompoPct){
            wantedCelltypes.add(parseInt(cidx));
          }
        }
      }
    }
    console.log('wantedCelltypes', wantedCelltypes.size, wantedCelltypes);
    
    

    if (cellClassSelection.length>0){
      // let tableDataFilteredTmp = tableDataSorted.filter(x => x.cc===cellClassSelection[0] && x.pct>minCompoPct);
      let tableDataFilteredTmp = tableDataSorted.filter(x => x.cc===cellClassSelection[0]);

      // filter further if wanted celltypes are identified, else no further filtering
      if (wantedCelltypes.size>0 || selectedRegIds.length>0){
        tableDataFilteredTmp = tableDataFilteredTmp.filter(x => wantedCelltypes.has(x.cid))
      }
      setTableDataFiltered(tableDataFilteredTmp);
    }else{

      let tableDataFilteredTmp = tableDataSorted;
      // filter further if wanted celltypes are identified, else no further filtering
      if (wantedCelltypes.size>0 || selectedRegIds.length>0){
        tableDataFilteredTmp = tableDataFilteredTmp.filter(x => wantedCelltypes.has(x.cid))
      }
      setTableDataFiltered(tableDataFilteredTmp);
    }

  }, [tableDataSorted, cellClassSelection, selectedRegIds, minCompoPct]);

 
  const [handleSorting] = useSortableTable(tableData);
  // const tableDataSorted = useStore(state => state.tableDataSorted);
  useEffect(()=>{
    handleSorting(sortField, order, sortByToggleVal);
    console.log("sortByToggleVal ", sortByToggleVal);
  }, [sortField, order, tableData, sortByToggleVal])
 

  // compute and set normalizer Z
  useEffect(()=>{

    let proportionVals = [], avgVals = [];
    let curShown = tableDataFiltered.slice(0, maxCellTypes);
    curShown.map(x=>{
    let curAccessors = columns.map(c=>c.accessor);
      for (let i=0; i<curAccessors.length;i++){
        proportionVals.push(x[curAccessors[i]]);
        avgVals.push(x[-curAccessors[i]]);
      }
    });
    console.log('proportionVals', proportionVals, order, sortField);
    
    console.log('curShown', curShown, columns);
    // console.log(proportionVals,"|", Math.max(...proportionVals), avgVals,"|", Math.max(...avgVals));

    if (adaptNormalizerStatus){
      setMaxProportionalVal(Math.max(...proportionVals)||Number.MIN_VALUE);
      setMaxAvgVal(Math.max(...avgVals));
    }else{
      setMaxProportionalVal(1);
      setMaxAvgVal(globalMaxAvgVal);
    }

  }, [tableDataFiltered, columns, maxCellTypes, selectedRegIds, adaptNormalizerStatus]);


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
              options={geneOptions}
              placeholder="Click here to select genes..."
              selected={multiSelections}
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
        <Row className="d-flex" style={{flexDirection:"row", flexGrow:1}}>
          <Col className="" xs="9">
            {columns.length>0?
              <>
                <Table columns={cellTypeColumn} tableDataSorted={tableDataFiltered} maxCellTypes={maxCellTypes} width={22} handleSorting={handleSorting}/>
                <Table columns={cellClassColumn} tableDataSorted={tableDataFiltered} maxCellTypes={maxCellTypes} width={12} handleSorting={handleSorting}/>
                <Table columns={topStructureColumn} tableDataSorted={tableDataFiltered} maxCellTypes={maxCellTypes} width={14} handleSorting={handleSorting}/>
                <Table columns={columns} tableDataSorted={tableDataFiltered} maxCellTypes={maxCellTypes} width={44} handleSorting={handleSorting}/>
              </>:null}
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
