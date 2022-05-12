
import React, { useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import RangeSlider from 'react-bootstrap-range-slider';
import {Form, FormGroup, Col, Row} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015


function Loader(props) {

  // const [filename, setFilename] = useState('https://storage.googleapis.com/ml_portal/test_data/test.json')

  let init_data = [
    {"name":"Lafayette (LAFY)","code":"LF","address":"3601 Deer Hill Road, Lafayette CA 94549","entries":"3481","exits":"3616","coordinates":[-122.123801,37.893394]},
    {"name":"12th St. Oakland City Center (12TH)","code":"12","address":"1245 Broadway, Oakland CA 94612","entries":"13418","exits":"13547","coordinates":[-122.271604,37.803664]}, 
    {"name": "abc", "code":"12", "address":"test", "entries":"2345",  "exits": "43239", "coordinates":[-122.3,37.9]}]

  const [coordsData, setCoordsData] = useState([{"x":0, "y":0, "z":0, "count":0}]);

  const [chosenGene, setChosenGene] = useState("Pcp4")
  const [chosenPuckid, setChosenPuckid] = useState(1)
  const [unifiedData, setUnifiedData] = useState([{"x":0, "y":0, "z":0, "count":0}]);

  const [umiThreshold, setUmiThreshold ] = useState(-1);
  const [maxUmiThreshold, setMaxUmiThreshold] = useState(1);
  const [chosenPuckFolder, setChosenPuckFolder] = useState('https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1');

  let geneOptions = ['Pcp4', 'Calb1', 'Gng13', 'Gabra6']
  let basePath = 'https://storage.googleapis.com/ml_portal/test_data/gene_jsons'

  useEffect(()=>{
    console.log("new  puckid ", chosenPuckid);

    // create full coords path
    let coordsPath = `${basePath}/puck${chosenPuckid}/coords.csv`
    console.log("coordsPath ", coordsPath);

    // read coords data
    const fetchData = async () => {
      const readData = await load(coordsPath, [CSVLoader]);

      setCoordsData(readData);

    }
    fetchData();

    // update coordsData state

  },[basePath, chosenPuckid]);

  useEffect(()=>{
    console.log("new chosen gene ", chosenGene);

    // create filename string using gene name and puckid
    let geneDataPath = `${basePath}/puck${chosenPuckid}/gene_${chosenGene}.csv`
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
      

    }
    fetchData();
  },[basePath, chosenPuckid, coordsData, chosenGene]);


  return(
    <div>
      <h4>Brain Cell Data Viewer</h4>
      <Form>
        <FormGroup as={Row}>
          <Form.Label column sm="3">
            Puck ID
          </Form.Label>
          <Col xs="2">
            <RangeSlider
              value={chosenPuckid}
              onChange={e => setChosenPuckid(e.target.value)}
              min={1}
              max={3}
              step={2}
            />
          </Col>
          <Col xs="1">
            <Form.Control value={chosenPuckid} readOnly/>
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
              placeholder="Choose a gene..."
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
              min={-1}
              max={100}
            />
          </Col>
          <Col xs="1">
            <Form.Control value={umiThreshold} readOnly/>
          </Col>
        </FormGroup>
      </Form>
      <div className="add-border floater" >
        <Scatterplot id={'left_splot'} unidata={unifiedData} threshold={umiThreshold}/>
      </div>
      <div className="add-border floater">
        <Scatterplot id={'right_splot'} unidata={unifiedData} threshold={umiThreshold}/>
      </div>
    </div>
  );
}

export default Loader;   

// Reference
// https://devtrium.com/posts/async-functions-useeffect
// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
// https://stackoverflow.com/questions/50919164/how-to-merge-each-object-within-arrays-by-index


