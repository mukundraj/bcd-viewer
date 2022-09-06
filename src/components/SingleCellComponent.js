import Breadcrumbs from './BreadcrumbsComponent'
import {useEffect, useRef } from 'react';
import {getUrl} from "../shared/common"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ZarrLoader from "../loaders/ZarrLoader"
import {Col, Row, FormGroup, FormLabel} from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import produce from "immer";
import Table from './table/TableComponent'
import useStore from '../store/store'
import {useSCComponentStore} from '../store/SCComponentStore'
import { useSortableTable } from "./table/hooks";
import Colorbar from '../components/ColorbarComponent'


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
  const [multiSelections, setMultiSelections] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [geneOptions, setGeneOptions] = useState([]);
  const [cellTypes, setCellTypes] = useState([]);
  const prevMultiSelections = useRef([]);
  const cellTypeColumn = [{"label":"celltype                                   ", "accessor":"ct"}]
  const setTableDataSorted = useStore(state => state.setTableDataSorted);
  const setCurrentColorMap = useSCComponentStore(state => state.setCurrentColorMap);

  const maxColVals = useStore(state => state.maxColVals);
  const setMaxColVals = useStore(state => state.setMaxColVals);

  let zarrPathInBucket = `https://storage.googleapis.com/ml_portal/test_data/`
  const setScTableZVal = useStore(state => state.setScTableZVal);
  
  const sortField = useStore(state => state.sortField);
  const setSortField = useStore(state => state.setSortField);
  const order = useStore(state => state.order);

  // get zarr store connection and initialize geneOptions
  useEffect(()=>{
    const fetchData = async () => {
      let zloader = new ZarrLoader({zarrPathInBucket});
      let dataGenes = await zloader.getFlatArrDecompressed("z1.zarr/var/human_name/categories");
      let dataCellTypesRaw = await zloader.getFlatArrDecompressed("z1.zarr/obs/_index");
      // let dataX = await zloader.getDataColumn("z1.zarr/X", 0);

      let myRe = /=([\s\S]*)$/
      let dataCellTypes = dataCellTypesRaw.map(x=>myRe.exec(x)[0].slice(1));
      // console.log(dataGenes);
      // console.log(dataCellTypes);
      setGeneOptions(dataGenes);
      setCellTypes(dataCellTypes);
      let initTableData = new Array(dataCellTypes.length).fill({})
      initTableData = initTableData.map((x,i)=>{return {"id":i, "ct":dataCellTypes[i]}});
      setTableData(initTableData);
      setTableDataSorted(initTableData);
    }

    fetchData();

  }, []);

  // updating tableData json array on change in selected genes
  useEffect(()=>{
    const fetchData = async (col_idx) => {
      let zloader = new ZarrLoader({zarrPathInBucket});
      let dataCol = await zloader.getDataColumn("z1.zarr/X", col_idx);
      let tableDataTmp = tableData.map((x,i)=>produce(x, draft=>{
        draft[col_idx] = dataCol[i];
      }));
      setTableData(tableDataTmp);


      if (sortField===""){
        setTableDataSorted(tableDataTmp);
      }
      // else{
      //   handleSorting(sortField, order);
      // }
    }

    // identify newly added or removed gene and update tableData accordingly
    let added = null, removed = null;
    if (prevMultiSelections.current.length<multiSelections.length){
      added = multiSelections.filter(x => !prevMultiSelections.current.includes(x));
      console.log('added', added);
      let colIdx = geneOptions.indexOf(added[0]);
      fetchData(colIdx); // reminder: async function

      // adding gene entry to columns array
      let columnsTmp = columns;
      columnsTmp.push({"label":added[0], "accessor":colIdx, "sortable":true});
      setColumns(columnsTmp);
      console.log(columnsTmp);

    }else if(prevMultiSelections.current.length>multiSelections.length){
      removed = prevMultiSelections.current.filter(x => !multiSelections.includes(x));
      console.log('removed', removed);
      let colIdx = geneOptions.indexOf(removed[0]);
      let tableDataTmp = tableData.map((x,i)=>produce(x, draft=>{
        delete draft[colIdx];
      }));
      setTableData(tableDataTmp);

      // removing gene entry from column array
      let columnsTmp = columns.filter(x=>x.accessor!==colIdx);
      setColumns(columnsTmp);
      console.log(columnsTmp);

      console.log("sortField", sortField, colIdx, sortField===colIdx);
      if (sortField===colIdx){
        // Removing the current sortField
        setSortField("");
        setTableDataSorted(tableDataTmp);
      }else{
        // Removig field that is not current sortField
        handleSorting(sortField, order); // calls setTableDataSorted internally
      }


      // // removing the max col val for the removed column
      // setMaxColVals(produce(maxColVals, draft=>{
      //   delete draft[colIdx];
      // }));

    }

    console.log('multiSelections', multiSelections);
    prevMultiSelections.current=multiSelections;

  },[multiSelections]);
 
  const [handleSorting] = useSortableTable(tableData);
  // const tableDataSorted = useStore(state => state.tableDataSorted);
  useEffect(()=>{
    handleSorting(sortField, order);
  }, [sortField, order, tableData])
 
  const tableDataSorted = useStore(state => state.tableDataSorted);

  // compute and set normalizer Z
  useEffect(()=>{

    let vals = [];
    let curShown = tableDataSorted.slice(0, maxCellTypes);
    curShown.map(x=>{
    let curAccessors = columns.map(c=>c.accessor);
      for (let i=0; i<curAccessors.length;i++){
        vals.push(x[curAccessors[i]]);
      }
    });
    
    console.log(curShown, columns);
    console.log(vals,"|", Math.max(...vals));
    setScTableZVal(Math.max(1, Math.max(...vals)));
    

  }, [tableDataSorted, columns, maxCellTypes]);


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
            max={100}
            step={1}
          />
        </Col>
      </Row>
        <Row className="d-flex" style={{flexDirection:"row", flexGrow:1}}>
          <Col className="" xs="10">
            {columns.length>0?
              <>
                <Table columns={cellTypeColumn} tableDataSorted={tableDataSorted} maxCellTypes={maxCellTypes} width={24} handleSorting={handleSorting}/>
                <Table columns={columns} tableDataSorted={tableDataSorted} maxCellTypes={maxCellTypes} width={73} handleSorting={handleSorting}/>
              </>:null}
          </Col>
          <Col xs="2">
          <Row>
            {columns.length>0?<Colorbar max={20} cells={7} setCurrentColorMap={setCurrentColorMap} style={{marginTop:"30px"}}/>:null
            }
          </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default SingleCell;

// https://stackoverflow.com/questions/40589499/what-do-the-signs-in-numpy-dtype-mean
