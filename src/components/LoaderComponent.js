
import React, { useCallback, useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import RangeSlider from 'react-bootstrap-range-slider';
import {Form, FormGroup, Col, Row} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import {OrthographicView} from '@deck.gl/core';


function Loader(props) {

  const [coordsData, setCoordsData] = useState([{"x":0, "y":0, "z":0, "count":0}]);

  // const [chosenGene, setChosenGene] = useState(["Pcp4"])
  const [chosenGene, setChosenGene] = useState(["Gad1"])
  const [chosenPuckid, setChosenPuckid] = useState(1)
  const [unifiedData, setUnifiedData] = useState([{"x":0, "y":0, "z":0, "count":0}]);

  const [umiThreshold, setUmiThreshold ] = useState(-1);
  const [maxUmiThreshold, setMaxUmiThreshold] = useState(1);
  const [opacityVal, setOpacityVal] = useState(0.5);

  // let geneOptions = ['Pcp4', 'Calb1', 'Gng13', 'Gabra6',
  //   'Mbp', 'Plp1', 'Mag',
  //   'Myoc', 'Agt', 'Gfap', 'Slc1a3', 'Aqp4',
  //   'Dcn', 'Flt1',
  //   'Rarres2', 'Foxj1'];

  // let basePath = 'https://storage.googleapis.com/ml_portal/test_data/gene_jsons'
  let geneOptions = ['Gad1', 'Gad2', 'Slc17a7'];

  let basePath = 'https://storage.googleapis.com/ml_portal/test_data/gene_csvs'

  useEffect(()=>{

    // create full coords path
    let coordsPath = `${basePath}/puck${chosenPuckid}/coords.csv`
    console.log("coordsPath ", coordsPath);

    // read coords data
    const fetchData = async () => {
      const readData = await load(coordsPath, [CSVLoader], {csv:{delimiter:":"}});

      setCoordsData(readData);
    console.log("new  puckid ", chosenPuckid);
      // console.log(readData);

    }
    fetchData();

    // update coordsData state

  },[basePath, chosenPuckid]);

  useEffect(()=>{
    // console.log("new chosen gene ", chosenGene);

    if (geneOptions.includes(chosenGene[0])){
      // create filename string using gene name and puckid
      // let geneDataPath = `${basePath}/puck${chosenPuckid}/gene_${chosenGene[0]}.csv`
      let geneDataPath = `${basePath}/puck${chosenPuckid}/rc_${chosenGene[0]}.csv`
      console.log("geneDataPath ", geneDataPath);

      // read gene data
      const fetchData = async () => {
        const geneData = await load(geneDataPath, [CSVLoader]);


        // create unifiedData
        let readData = coordsData.map((obj, index) => ({
          ...obj,
          ...geneData[index]
        }));

        // update state of unifiedData
        setUnifiedData(readData);

        // let maxVal = Math.max(...unifiedData.map(o => o.count));
        console.log("new puck loaded")

      }
      fetchData();
    }else{
      console.log("chosen gene not included", chosenGene);
    }
      
  },[coordsData, chosenGene]);
  

  useEffect(()=>{

    // Math.max.apply(Math, unifiedData.map(function(o) { return o.y; }))
    const fetchData = async () => {
      let meta_data_path = `${basePath}/puck${chosenPuckid}/metadata_gene_${chosenGene}.json`
      // let meta_data_path2 = 'https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1/metadata_gene_Pcp4.json'
      console.log('meta_data_path ', meta_data_path);
      // console.log('meta_data_path ', meta_data_path2);
      const readData = await fetch(meta_data_path)
       .then(response => response.json());
        // .then(data_str => JSON.parse(data_str));


      // setCoordsData(readData);
      setMaxUmiThreshold(parseInt(readData['maxCount']));
      

    }
    fetchData();

  }, [basePath, chosenPuckid, chosenGene]);

  
  const [viewState, setViewState] = useState({
    target: [228, 160, 0],
    zoom: 0
  });

  const onViewStateChange = useCallback(({viewState}) => {
    // Manipulate view state
    // viewState.target[0] = Math.min(viewState.target[0], 10);
    // Save the view state and trigger rerender
    setViewState(viewState);
  }, []);
  const [hoverInfo, setHoverInfo] = useState(0);

  return(
    <div>
      <h4>Brain Cell Data Viewer</h4>
      <Form>
        <FormGroup as={Row}>
          <Form.Label column sm="3">
            Puck Depth
          </Form.Label>
          <Col xs="2">
            <RangeSlider
              value={chosenPuckid}
              onChange={e => setChosenPuckid(e.target.value)}
              min={1}
              max={41}
              step={2}
            />
          </Col>
          <Col xs="1">
            Max: {41}
          </Col>
        </FormGroup>
        <FormGroup as={Row}>
          <Form.Label column sm="3">Select Gene</Form.Label>
          <Col xs="3">
            <Typeahead
              id="basic-typeahead-single"
              labelKey="name"
              onChange={setChosenGene}
              options={geneOptions}
              placeholder="Choose another gene..."
              defaultInputValue="Gad1"
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row}>
          <Form.Label column sm="3">
            UMI Count Threshold
          </Form.Label>
          <Col xs="2">
            <RangeSlider
              value={umiThreshold}
              onChange={e => setUmiThreshold(e.target.value)}
              min={0}
              max={maxUmiThreshold}
            />
          </Col>
          <Col xs="1">
            Max: {maxUmiThreshold}
          </Col>
        </FormGroup>
        <FormGroup as={Row}>
          <Form.Label column sm="3">
            Opacity proportion
          </Form.Label>
          <Col xs="2">
            <RangeSlider
              value={opacityVal}
              onChange={e => setOpacityVal(e.target.value)}
              min={0}
              max={1}
              step={0.01}
            />
          </Col>
          <Col xs="1">
            Max: {1}
          </Col>
        </FormGroup>
      </Form>
      <div className="add-border floater" >
        <Scatterplot id={'left_splot'} 
          unidata={unifiedData} threshold={umiThreshold} maxUmiThreshold={maxUmiThreshold} 
          opacityVal={opacityVal}
          viewState={viewState}
          onViewStateChange={onViewStateChange}
          hoverInfo = {hoverInfo}
          setHoverInfo = {setHoverInfo}
        />
      </div>
      <div className="add-border floater">
        <Scatterplot id={'right_splot'} 
          unidata={unifiedData} threshold={umiThreshold} maxUmiThreshold={maxUmiThreshold}
          opacityVal={opacityVal}
          viewState = {viewState}
          onViewStateChange={onViewStateChange}
          hoverInfo = {hoverInfo}
          setHoverInfo = {setHoverInfo}
        />
      </div>
    </div>
  );
}

export default Loader;   

// Reference
// https://devtrium.com/posts/async-functions-useeffect
// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
// https://stackoverflow.com/questions/50919164/how-to-merge-each-object-within-arrays-by-index


