
import React, { useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import RangeSlider from 'react-bootstrap-range-slider';
import {Form, FormGroup, Col, Row} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015


function Loader(props) {

  const [filename, setFilename] = useState('https://storage.googleapis.com/ml_portal/test_data/test.json')

  let init_data = [
    {"name":"Lafayette (LAFY)","code":"LF","address":"3601 Deer Hill Road, Lafayette CA 94549","entries":"3481","exits":"3616","coordinates":[-122.123801,37.893394]},
    {"name":"12th St. Oakland City Center (12TH)","code":"12","address":"1245 Broadway, Oakland CA 94612","entries":"13418","exits":"13547","coordinates":[-122.271604,37.803664]}, 
    {"name": "abc", "code":"12", "address":"test", "entries":"2345",  "exits": "43239", "coordinates":[-122.3,37.9]}]

  const [data, setData] = useState(init_data);
  const [gene_data, setGenedata] = useState(init_data);
  const [chosenGene, setChosenGene] = useState([])
  const [chosenPuckid, setChosenPuckid] = useState(1)
  const [uni_data, setUnidata] = useState([{"x":0, "y":0, "z":0, "count":0}]);
  
  const [ umiThreshold, setUmiThreshold ] = useState(0);
  const [maxUmiThreshold, setMaxUmiThreshold] = useState(1);

  let geneOptions = ['Pcp4', 'Calb1', 'Gng13', 'Gabra6']

  useEffect(() => {

    // console.log("in loaderr component", count);
    // setCount(0)
    // declare the data fetching function
    const fetchData = async () => {
      const data = await fetch(filename)
        .then(response => response.text())
        .then(data_str => JSON.parse(data_str));

      console.log("in loader", data);
      let data2 = await load('https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1/coords.csv', [CSVLoader]);
      let gene_data2 = await load('https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1/gene_Pcp4.csv', [CSVLoader]);
      // set state here - not outside the {}
      setData(data2);
      setGenedata(gene_data2);

      let uni_data2 = data2.map((obj, index) => ({
        ...obj,
        ...gene_data2[index]
      }));

      setUnidata(uni_data2);
      console.log("chosenGene ", chosenGene);

    }

    fetchData();

    console.log("inside");
  }, [filename, chosenGene]);

  useEffect(()=>{
    console.log("new chosen gene ", chosenGene, React.version);

    // create filename string using gene name and puckid

    // update filename state
  },[chosenGene, chosenPuckid]);


  useEffect(()=>{

    // loads data based on filename
    //
    // update state of threshold(to 1) and maxThreshold(computed from data)

  }, [filename]);

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
              max={207}
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
            />
          </Col>
          <Col xs="1">
            <Form.Control value={umiThreshold} readOnly/>
          </Col>
        </FormGroup>
      </Form>
      <div className="add-border floater" >
        <Scatterplot id={'left_splot'} unidata={uni_data} threshold={umiThreshold}/>
      </div>
      <div className="add-border floater">
        <Scatterplot id={'right_splot'} unidata={uni_data} threshold={umiThreshold}/>
      </div>
    </div>
  );
}

export default Loader;   

// Reference
// https://devtrium.com/posts/async-functions-useeffect
// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
// https://stackoverflow.com/questions/50919164/how-to-merge-each-object-within-arrays-by-index


