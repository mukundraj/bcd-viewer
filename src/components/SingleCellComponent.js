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
  const [columns, setColumns] = useState([{"label":"celltype", "accessor":"ct"}]);
  const [geneOptions, setGeneOptions] = useState([]);
  const [cellTypes, setCellTypes] = useState([]);
  const prevMultiSelections = useRef([]);


  let zarrPathInBucket = `https://storage.googleapis.com/ml_portal/test_data/`

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
      columnsTmp.push({"label":added[0], "accessor":colIdx});
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

    }

    console.log('multiSelections', multiSelections);
    prevMultiSelections.current=multiSelections;

  },[multiSelections]);


  return(
    <>
      <Breadcrumbs/>
      <div>
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
        <div className="container" style={{height:"70vh"}}>
        <Table columns={columns} tableData={tableData} maxCellTypes={maxCellTypes}/>
        </div>
      </div>
    </>
  );
}

export default SingleCell;

// https://stackoverflow.com/questions/40589499/what-do-the-signs-in-numpy-dtype-mean
