import React, { useCallback, useState, useEffect } from 'react';
import {useStore} from '../store/store'
import {useCSComponentStore} from '../store/CSComponentStore'
import Breadcrumbs from './BreadcrumbsComponent'
import {Form, FormGroup, Col, Row, ProgressBar} from 'react-bootstrap'
import BcdCarousel from "./BcdCarouselComponent"
import {getUrl, pidToSrno, pad} from "../shared/common"
import RangeSlider from 'react-bootstrap-range-slider';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';

function LoaderCellSpatial({dataConfig}){

  const {prefix, maxCountMetadataKey, title, basePath, relativePath, freqBarsDataPath} = dataConfig;
  const carouselRef = useStore(state => state.carouselRef);
  const chosenPuckid = useStore(state => state.chosenPuckid);
  const setChosenPuckid = useStore(state => state.setChosenPuckid);
  const [dataLoadStatus, setDataLoadStatus] = useState({puck:0, gene:0, metadata:0});
  const [dataLoadPercent, setDataLoadPercent] = useState(0);
  const [opacityVal, setOpacityVal] = useState(1.0);
  
  const wireframeStatus = useStore(state => state.wireframeStatus);
  const setWireframeStatus = useStore(state => state.setWireframeStatus);
  const nisslStatus = useStore(state => state.nisslStatus);
  const setNisslStatus = useStore(state => state.setNisslStatus);

  const chosenCell = useCSComponentStore(state => state.chosenCell);
  const setChosenCell = useCSComponentStore(state => state.setChosenCell);
  const chosenCell2 = useCSComponentStore(state => state.chosenCell2);
  const setChosenCell2 = useCSComponentStore(state => state.setChosenCell2);
  
  const cellOptions = useCSComponentStore(state => state.cellOptions);
  const setCellOptions = useCSComponentStore(state => state.setCellOptions);
  const [coordsData, setCoordsData] = useState([{"x":0, "y":0, "z":0, "count":0}]);
  const [curNisslUrl, setCurNisslUrl] = useState('https://storage.googleapis.com/ml_portal/test_data/gene_csvs/puck1/nis_001.png');
  const [curAtlasUrl, setCurAtlasUrl] = useState('https://storage.googleapis.com/ml_portal/test_data/gene_csvs/puck1/chuck_sp_labelmap_001.png');


  let setPuckidAndLoadStatus = (x)=>{
    if (x===chosenPuckid){
      alert("Already showing requested puck: srno "+parseInt(pidToSrno[chosenPuckid]));
    }else{
      setDataLoadStatus((p)=>({gene:0, puck:0, metadata:0}));setChosenPuckid(x);
    };
  }


  // // determine percentage of data loaded when dataLoadStatus changes
  // useEffect(()=>{

  //   // 100% -> puck 4; gene 1; metadata 1;
  //   setDataLoadPercent((Math.round(100*(dataLoadStatus.puck+dataLoadStatus.gene+dataLoadStatus.metadata)/6)));
  // }, [dataLoadStatus]);

  // loading background image data and coords on puck change
  useEffect(()=>{

    // create full coords path
    // console.log("coordsPath ", coordsPath);

    // read coords data
    const fetchData = async () => {
      // let testUrl = 'https://storage.googleapis.com/bcdportaldata/cellspatial_data/puck1/coords.csv'
      let coordsUrl = `${basePath}${relativePath}/puck${chosenPuckid}/coords.csv`
      // const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});
      const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});

      setCoordsData(readData);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }
    fetchData();

    const fetchNissl = async () => {
      let nis_url = `${basePath}${relativePath}/puck${chosenPuckid}/nis_${pad(chosenPuckid, 3)}.png`

      setCurNisslUrl(nis_url);
      // setDataLoadStatus((p)=>{ console.log(p.dataLoadStatus); return (p.dataLoadStatus+1)});
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }

    const fetchAtlas = async () => {
      let atlas_url = `${basePath}${relativePath}/puck${chosenPuckid}/chuck_sp_wireframe_${pad(chosenPuckid,3)}.png`;

      setCurAtlasUrl(atlas_url);
      // setDataLoadStatus(dataLoadStatus+1);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));

    }

    fetchNissl();
    fetchAtlas();

    const fetchCellOptions = async () => {
      let cellOptionsUrl = `${basePath}${relativePath}/puck${chosenPuckid}/cellOptions.json`
      // const geneOptions = await load(geneOptionsUrl, [CSVLoader], {csv:{delimiter:":"}});
      fetch(cellOptionsUrl
      // ,{
      //   headers : { 
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json'
      //    }
      // }
      )
        .then(function(response){
          // console.log(response)
          return response.json();
        })
        .then(function(myJson) {
          // console.log(myJson.geneOptions, dataLoadStatus);
          // setData(myJson)
          setCellOptions(myJson.cellOptions);
          setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
        });
    }

    fetchCellOptions();
    console.log("puck update initiated..");

  },[chosenPuckid]);

  return(
    <div>
      <Breadcrumbs/>
      <Row>
        <Col xs="2">
          Select Puck
        </Col>
        <Col xs="10">
          <BcdCarousel setPuckidAndLoadStatus={setPuckidAndLoadStatus} chosenPuckid={chosenPuckid}></BcdCarousel>
        </Col>
      </Row>
      <Form>
        <FormGroup as={Row} className="mt-4">
          <Form.Label column sm="3">Select Gene(s)</Form.Label>
          <Col xs="2">
            <Typeahead
              id="basic-typeahead-single"
              labelKey="name"
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, gene:0, metadata:0}));setChosenCell(x)}}
              options={cellOptions}
              placeholder="Choose a cell..."
              // defaultInputValue={geneOptions[0]}
              selected={chosenCell}
              filterBy={(option, props) => {
                /* Own filtering code goes here. */
                return (option.toLowerCase().indexOf(props.text.toLowerCase()) === 0)
              }}
            />
          </Col>
          <Col xs="2">
            <Typeahead
              id="basic-typeahead-single2"
              labelKey="name"
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, gene:0, metadata:0}));setChosenCell2(x)}}
              options={cellOptions}
              placeholder="Choose another cell..."
              // defaultInputValue={geneOptions[0]}
              selected={chosenCell2}
              filterBy={(option, props) => {
                /* Own filtering code goes here. */
                return (option.toLowerCase().indexOf(props.text.toLowerCase()) === 0)
              }}
              disabled={chosenCell.length>0?false:true}
              clearButton
            />
          </Col>
          <Col xs="2">
            for Puck ID:<span style={{fontWeight:"bold"}}>{pidToSrno[chosenPuckid]}</span>
          </Col>
          <Col xs="1">
            Loaded:
          </Col>
          <Col xs="2">
            <ProgressBar now={dataLoadPercent} label={`${dataLoadPercent}%`} />
          </Col>
        </FormGroup>
        {/* <FormGroup as={Row}> */}
        {/*   <Form.Label column sm="3"> */}
        {/*     UMI Count Threshold */}
        {/*   </Form.Label> */}
        {/*   <Col xs="1"> */}
        {/*     <DualSlider maxUmiThreshold={maxUmiThreshold} */}
        {/*                 setUmiLowerThreshold={setUmiLowerThreshold} */} 
        {/*                 setUmiUpperThreshold={setUmiUpperThreshold}> */}
        {/*     </DualSlider> */}
        {/*   </Col> */}
        {/*   <Col xs="1"> */}
        {/*     Max: {Math.round(maxUmiThreshold* 1000) / 1000} */}
        {/*   </Col> */}
        {/*   {chosenGene2.length>0?<> */}
        {/*   <Col xs="1"> */}
        {/*     <DualSlider maxUmiThreshold={maxUmiThreshold2} */}
        {/*                 setUmiLowerThreshold={setUmiLowerThreshold2} */} 
        {/*                 setUmiUpperThreshold={setUmiUpperThreshold2}> */}
        {/*     </DualSlider> */}
        {/*   </Col> */}
        {/*   <Col xs="1"> */}
        {/*     Max: {Math.round(maxUmiThreshold2* 1000) / 1000} */}
        {/*   </Col> */}
        {/*   </>:<Col xs="2"/>} */}
        {/*   <Col xs="1"> */}
        {/*     <BootstrapSwitchButton checked={fbarActiveDataName==='regionwise_cnts'} onstyle="outline-primary" offstyle="outline-secondary" */} 
        {/*     onlabel="R" offlabel="P" */}
        {/*       onChange={(checked)=>{if (checked){setFbarActiveDataName('regionwise_cnts')}else{setFbarActiveDataName('sorted_puckwise_cnts')}}}/> */}
        {/*   </Col> */}
        {/*   <Col xs="4"> */}
        {/*     <FrequencyBars */}
        {/*     setPuckidAndLoadStatus={setPuckidAndLoadStatus} */}
        {/*     data={fbarsData} */}
        {/*     /> */}
        {/*   </Col> */}
        {/* </FormGroup> */}
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
            <Form.Check 
              defaultChecked={wireframeStatus}
            type={'checkbox'}
            id={`nis-checkbox`}
            label={`Nissl`}
            onChange={e => setNisslStatus(e.target.checked)}
          />
          </Col>
          <Col xs="2">
            <Form.Check 
              defaultChecked={wireframeStatus}
            type={'checkbox'}
            id={`wf-checkbox`}
            label={`Wireframe`}
            onChange={e => setWireframeStatus(e.target.checked)}
          />
          </Col>
          <Col xs="4" className="align-items-center">
            {/* {chosenGene2.length>0?<ColorSquare/>:<Colorbar max={maxUmiThreshold} cells={15} setCurrentColorMap={setCurrentColorMap}/>} */}
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
}

export default LoaderCellSpatial;   
