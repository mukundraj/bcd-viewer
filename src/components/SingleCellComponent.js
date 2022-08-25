import Breadcrumbs from './BreadcrumbsComponent'
import {useEffect, useRef } from 'react';
import {getUrl} from "../shared/common"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ZarrLoader from "../loaders/ZarrLoader"
import {Col, Row, FormGroup, FormLabel} from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015


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
  const [treeData, setTreeData] = useState([]);
  const [geneOptions, setGeneOptions] = useState([]);
  const prevMultiSelections = useRef([]);


  let zarrPathInBucket = `https://storage.googleapis.com/ml_portal/test_data/`

  // get zarr store connection and initialize geneOptions
  useEffect(()=>{
    const fetchData = async () => {
      let zloader = new ZarrLoader({zarrPathInBucket});
      let dataGenes = await zloader.getFlatArrDecompressed("z1.zarr/var/human_name/categories");
      // let dataX = await zloader.getDataColumn("z1.zarr/X", 0);
      console.log(dataGenes);
      setGeneOptions(dataGenes);
    }
    
    fetchData();

  }, []);



  useEffect(()=>{
    const fetchData = async (col_idx) => {
      let zloader = new ZarrLoader({zarrPathInBucket});
      let dataCol = await zloader.getDataColumn("z1.zarr/X", col_idx);
      console.log(dataCol);
    }

    // identify newly added or removed gene
    let added = null, removed = null;
    if (prevMultiSelections.current.length<multiSelections.length){
      added = multiSelections.filter(x => !prevMultiSelections.current.includes(x));
      console.log('added', added);
      let colIdx = geneOptions.indexOf(added[0]);
      fetchData(colIdx);

    }else if(prevMultiSelections.current.length>multiSelections.length){

      removed = prevMultiSelections.current.filter(x => !multiSelections.includes(x));
      console.log('removed', removed);
    }

    if (added){
    // read newly selected column and add to json array
    

    }else if (removed){
    // remove dropped column if any from json array
    

    }

    
    console.log('multiSelections', multiSelections);
    prevMultiSelections.current=multiSelections;

  },[multiSelections]);
  
  return(
    <>
      <Breadcrumbs/>
      <Row>
        <Col xs="2">Select genes:</Col>
        <Col xs="6">
          <Typeahead
            id="basic-typeahead-multiple"
            labelKey="name"
            multiple
            onChange={setMultiSelections}
            options={geneOptions}
            placeholder="Choose genes..."
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
    </>
  );
}

export default SingleCell;

// https://stackoverflow.com/questions/40589499/what-do-the-signs-in-numpy-dtype-mean
