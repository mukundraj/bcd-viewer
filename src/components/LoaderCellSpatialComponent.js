import React, { useCallback, useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
import {useStore, usePersistStore} from '../store/store'
import {useCSComponentStore, useCSCPersistStore} from '../store/CSComponentStore'
import Breadcrumbs from './BreadcrumbsComponent'
import {Form, FormGroup, Col, Row, ProgressBar} from 'react-bootstrap'
import BcdCarousel from "./BcdCarouselComponent"
import {getUrl, pidToSrno, pad} from "../shared/common"
import RangeSlider from 'react-bootstrap-range-slider';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import ZarrLoader from "../loaders/ZarrLoader"
import DualSlider from './DualSliderComponent'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Colorbar from '../components/ColorbarComponent'
import ColorSquare from '../components/ColorSquareComponent'
import FrequencyBars from "./FrequencyBarsComponent"
import {useLocation} from 'react-router-dom';
import Dendrogram from './DendrogramComponent'
import RegEnrich from "./RegEnrichComponent"
import ReactGA from "react-ga4";

function LoaderCellSpatial({dataConfig}){

  const {prefix, maxCountMetadataKey, title, basePath, relativePath} = dataConfig;
  const carouselRef = useStore(state => state.carouselRef);
  const generalToggleFlag = useStore(state => state.generalToggleFlag);
  const togglePid = useStore(state => state.togglePid);
  const [initialRender, setInitialRender] = useState(true);
  
  const setCurrentColorMap = useStore(state => state.setCurrentColorMap);


  const maxScoreThreshold = useCSComponentStore(state => state.maxScoreThreshold);
  const setMaxScoreThreshold = useCSComponentStore(state => state.setMaxScoreThreshold);
  const maxScoreThreshold2 = useCSComponentStore(state => state.maxScoreThreshold2);
  const setMaxScoreThreshold2 = useCSComponentStore(state => state.setMaxScoreThreshold2);

  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);
  const [dataLoadStatus, setDataLoadStatus] = useState({puck:0, cell:0, metadata:0});
  const [dataLoadPercent, setDataLoadPercent] = useState(0);

  const fbarActiveDataName = useStore(state => state.fbarActiveDataName);
  const setFbarActiveDataName = useStore(state => state.setFbarActiveDataName);

  const [unifiedData, setUnifiedData] = useState([{"x":0, "y":0, "z":0, "count":0, "count2":0, logcnt1:1, logcnt2:1}]);
  const [fbarsData, setFbarsData] = useState({"regionwise_cnts":[], "sorted_puckwise_cnts":[]});

  const [scoreLowerThreshold, setScoreLowerThreshold ] = useState(0.3); // formerly: 0.0001
  const [scoreUpperThreshold, setScoreUpperThreshold ] = useState(0.0001);
  const [scoreLowerThreshold2, setScoreLowerThreshold2 ] = useState(0.0001);
  const [scoreUpperThreshold2, setScoreUpperThreshold2 ] = useState(0.0001);
  const [opacityVal, setOpacityVal] = useState(1.0);
  
  const wireframeStatus = useStore(state => state.wireframeStatus);
  const setWireframeStatus = useStore(state => state.setWireframeStatus);
  const nisslStatus = useStore(state => state.nisslStatus);
  const setNisslStatus = useStore(state => state.setNisslStatus);

  const chosenCell = useCSCPersistStore(state => state.chosenCell);
  const setChosenCell = useCSCPersistStore(state => state.setChosenCell);
  const chosenCell2 = useCSComponentStore(state => state.chosenCell2);
  const setChosenCell2 = useCSComponentStore(state => state.setChosenCell2);
  
  const cellOptions = useCSComponentStore(state => state.cellOptions);
  const setCellOptions = useCSComponentStore(state => state.setCellOptions);
  const [coordsData, setCoordsData] = useState([{"x":0, "y":0, "z":0, "count":0}]);
  const [curNisslUrl, setCurNisslUrl] = useState('https://storage.googleapis.com/ml_portal/test_data/gene_csvs/puck1/nis_001.png');
  const [curAtlasUrl, setCurAtlasUrl] = useState('https://storage.googleapis.com/ml_portal/test_data/gene_csvs/puck1/chuck_sp_labelmap_001.png');

  // const [cellNameToIdx, setCellNameToIdx] = useState({'Inh_Lhx6_Nmu_1':560 });
  const cellNameToIdx = useCSCPersistStore(state => state.cellNameToIdx);
  const setCellNameToIdx = useCSCPersistStore(state => state.setCellNameToIdx);

  const curPuckMaxScores = useCSComponentStore(state => state.curPuckMaxScores);
  const setCurPuckMaxScores = useCSComponentStore(state => state.setCurPuckMaxScores);
  const location = useLocation();

  // useEffect(() => {

  //   console.log('location', location);

  //   window.history.replaceState({}, document.title); // https://stackoverflow.com/questions/40099431/how-do-i-clear-location-state-in-react-router-on-page-reload
  // },[location]);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/cellspatial" });
    document.title = "Cell Spatial | BrainCellData Viewer";
  }, []);


  // generalToggleFlag gets toggled when the user clicks on frequency bar or dendro bar
  useEffect(()=>{
    console.log("generalToggleFlag ", generalToggleFlag, ", dendroPid ", togglePid);
    if (initialRender===false){
      if (togglePid===chosenPuckid.pid){
        alert("Already showing requested puck: srno "+parseInt(pidToSrno[chosenPuckid.pid]));
      }else{
        setDataLoadStatus((p)=>({cell:0, puck:0, metadata:0}));
        setChosenPuckid({...chosenPuckid, pid:togglePid});
        carouselRef.current.goToSlide(parseInt(pidToSrno[togglePid]-1));
      }
    }else{
      setInitialRender(false);
    }    


  },[generalToggleFlag]);

  // determine percentage of data loaded when dataLoadStatus changes
  useEffect(()=>{

    // 100% -> puck 4; cell 1; metadata 1;
    setDataLoadPercent((Math.round(100*(dataLoadStatus.puck+dataLoadStatus.cell+dataLoadStatus.metadata)/6)));

    console.log("dataLoadStatus changed to: ", dataLoadStatus);
  }, [dataLoadStatus]);

  // On puckid change, load cellOptions data and set cellNameToIdx
  useEffect(()=>{

    const fetchCellOptions = async () => {
      let cellOptionsUrl = `${basePath}${relativePath}/cellscores/puck${chosenPuckid.pid}/cellOptions.json`
      // const cellOptions = await load(cellOptionsUrl, [CSVLoader], {csv:{delimiter:":"}});
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
          // console.log(myJson.cellOptions, dataLoadStatus);
          // setData(myJson)
          setCellOptions(myJson.cellOptions);

          // console.log("cellOptions", myJson.cellOptions);

          // create cellNameToIdx
          let cellNameToIdx = {};
          myJson.cellOptions.forEach((cell, idx)=>{
            cellNameToIdx[cell] = idx;
          }
          );
          // setCellNameToIdx(()=>cellNameToIdx);
          setCellNameToIdx(cellNameToIdx);
        });
    }
    // console.log("chosenPuckid changed to: ", chosenPuckid, "initialRender", initialRender, location);
    if (initialRender===false || cellOptions.length===1){
      fetchCellOptions();
    }
    setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
      

  }, [chosenPuckid.pid, location.pathname]);
  
  // loading background image data and coords on puck change
  useEffect(()=>{

    // create full coords path
    // console.log("coordsPath ", coordsPath);
    console.log("chosenPuckid", chosenPuckid);


    // read coords data
    const fetchData = async () => {
      // let testUrl = 'https://storage.googleapis.com/bcdportaldata/cellspatial_data/puck1/coords.csv'
      let coordsUrl = `${basePath}${relativePath}/cellscores/puck${chosenPuckid.pid}/coords.csv`
      // const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});
      const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});

      setCoordsData(readData);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }

    const fetchNissl = async () => {
      let nis_url = `${basePath}${relativePath}/cellscores/puck${chosenPuckid.pid}/nis_${pad(chosenPuckid.pid, 3)}.png`
      console.log("nis_url: ", nis_url);

      setCurNisslUrl(nis_url);
      // setDataLoadStatus((p)=>{ console.log(p.dataLoadStatus); return (p.dataLoadStatus+1)});
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }

    const fetchAtlas = async () => {
      let atlas_url = `${basePath}${relativePath}/cellscores/puck${chosenPuckid.pid}/chuck_sp_wireframe_${pad(chosenPuckid.pid, 3)}.png`;

      setCurAtlasUrl(atlas_url);
      // setDataLoadStatus(dataLoadStatus+1);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));

    }

    // console.log('initialRender', initialRender, location, dataLoadStatus);
    if (dataLoadStatus.puck<=1 ){
      fetchData();
      fetchNissl();
      fetchAtlas();
      console.log("puck update initiated..");
    }



  },[cellNameToIdx]);

  useEffect(()=>{

    const fetchData = async () => {
      let zarrPathInBucket = `${basePath}${relativePath}/cellscores/puck${chosenPuckid.pid}/`;
      let zloader = new ZarrLoader({zarrPathInBucket});
      let rowIdx = cellNameToIdx[chosenCell[0]];
      let locMaxScores = await zloader.getDataRow("cellxbead.zarr/maxScores/X", 0);
      setCurPuckMaxScores(locMaxScores);

    }

    if (coordsData.length>1){ // adding to prevent double fetching during browser refresh
      fetchData();
    }


  },[coordsData]);


  // when puck changes and coords loaded, load both cells' metadata (maxScores)
  useEffect(()=>{

    // read cell data
    const fetchData = async () => {

      let zarrPathInBucket = `${basePath}${relativePath}/cellscores/puck${chosenPuckid.pid}/`;
      let zloader = new ZarrLoader({zarrPathInBucket});
      // let rowIdx = cellNameToIdx[chosenCell[0]];
      // console.log("zarrPathInBucket ", zarrPathInBucket, 'chosenPuckid', chosenPuckid, 'rowIdx', rowIdx, cellNameToIdx);

      let rowIdx = cellNameToIdx[chosenCell[0]];
      let readData = null;
      if (chosenCell2.length > 0){ // fetch and update both cellData1 and cellData2

        // let locMaxScores = await zloader.getDataRow("cellxbead.zarr/maxScores/X", 0);
        // setCurPuckMaxScores(locMaxScores);

        let locMaxScoreThreshold = parseFloat(curPuckMaxScores[rowIdx]);
        locMaxScoreThreshold = locMaxScoreThreshold>0 ? locMaxScoreThreshold : 0.0011;
        setMaxScoreThreshold(locMaxScoreThreshold);
        setScoreUpperThreshold(locMaxScoreThreshold);
        // console.log("locMaxScoreThreshold", locMaxScoreThreshold, rowIdx, locMaxScores.indexOf(Math.max(...locMaxScores)));
        let rowIdx2 = cellNameToIdx[chosenCell2[0]];
        let locMaxScoreThreshold2 = parseFloat(curPuckMaxScores[rowIdx2]);
        locMaxScoreThreshold2 = locMaxScoreThreshold2>0 ? locMaxScoreThreshold2 : 0.0011;
        setMaxScoreThreshold2(locMaxScoreThreshold2);
        setScoreUpperThreshold2(locMaxScoreThreshold2);

        const [cellData, cellData2] = await Promise.all([
          zloader.getDataRow("cellxbead.zarr/X", rowIdx),
          zloader.getDataRow("cellxbead.zarr/X", rowIdx2)]); 
          readData = coordsData.map((obj, index) => ({
            ...obj,
            count: cellData[index], 
            count2: cellData2[index],
            logcnt1: Math.log(cellData[index] + 1)/Math.log(locMaxScoreThreshold+1),
            logcnt2: Math.log(cellData2[index] + 1)/Math.log(locMaxScoreThreshold2+1),
          }));


      }else{ // just fetch and update cellData1

        const cellData = await zloader.getDataRow("cellxbead.zarr/X", rowIdx); 

        // let locMaxScores = await zloader.getDataRow("cellxbead.zarr/maxScores/X", 0);
        // setCurPuckMaxScores(locMaxScores);

        let locMaxScoreThreshold = parseFloat(curPuckMaxScores[rowIdx]);
        locMaxScoreThreshold = locMaxScoreThreshold>0 ? locMaxScoreThreshold : 0.0011;
        // console.log("locMaxScoreThreshold", locMaxScoreThreshold, rowIdx, locMaxScores.indexOf(Math.max(...locMaxScores)));
        setMaxScoreThreshold(locMaxScoreThreshold);
        setScoreUpperThreshold(locMaxScoreThreshold);
        console.log("scoreLowerThreshold", scoreLowerThreshold);

        readData = coordsData.map((obj, index) => ({
          ...obj,
          count:cellData[index], 
          count2: 0,
          logcnt1: Math.log(cellData[index] + 1)/Math.log(locMaxScoreThreshold+1),
          logcnt2: 1
        }));
      }       

      setUnifiedData(readData);
      if (coordsData.length>1)
        setDataLoadStatus((p)=>({...p, cell:p.cell+1, metadata:p.metadata+1})); 
    }

    if (chosenPuckid.cell === chosenCell[0]){
      fetchData();
    }else{
      console.log("chosenPuckid.cell", chosenPuckid.cell, "chosenCell", chosenCell);
      setChosenCell([chosenPuckid.cell]); // update cell to match the cell set by SincleCell tab
    }    

  // }, [coordsData]);
  }, [curPuckMaxScores]);


  // loading new counts on new cell selection
  useEffect(()=>{

    if (cellOptions.includes(chosenCell[0])){

      // read cell data
      const fetchData = async () => {

        let zarrPathInBucket = `${basePath}${relativePath}/cellscores/puck${chosenPuckid.pid}/`;
        let zloader = new ZarrLoader({zarrPathInBucket});
        let rowIdx = cellNameToIdx[chosenCell[0]];
        const cellData = await zloader.getDataRow("cellxbead.zarr/X", rowIdx);

        let locMaxScoreThreshold = parseFloat(curPuckMaxScores[rowIdx]);
        locMaxScoreThreshold = locMaxScoreThreshold>0 ? locMaxScoreThreshold : 0.0011;
        console.log("locMaxScoreThreshold", locMaxScoreThreshold);
        setMaxScoreThreshold(locMaxScoreThreshold);
        setScoreUpperThreshold(locMaxScoreThreshold);

        // create unifiedData
        let readData = null;
        if(chosenCell2.length>0){ // if a comparison cell is also selected
          readData = coordsData.map((obj, index) => ({
            ...obj,
            count:  cellData[index], 
            count2: unifiedData[index].count2,
            logcnt1: Math.log(cellData[index] + 1)/Math.log(locMaxScoreThreshold+1),
            logcnt2: unifiedData[index].logcnt2,
          }));
        }else{ // when no comparison cell is selected
          readData = coordsData.map((obj, index) => ({
            ...obj,
            count:cellData[index], 
            logcnt1: Math.log(cellData[index] + 1)/Math.log(locMaxScoreThreshold+1),
            count2: 0,
            logcnt2: 1
          }));
         }
        // update state of unifiedData
        setUnifiedData(readData);

        // let maxVal = Math.max(...unifiedData.map(o => o.count));
        // console.log(unifiedData);

        if (coordsData.length>1){ // to deal with extra inital pass causing progress bar value to overshoot 100%
          setDataLoadStatus((p)=>({...p, cell:p.cell+1, metadata:p.metadata+1}));
        }
      }
      fetchData();
    }else{
      console.log("chosen cell not included", chosenCell);
    }
      
  }, [chosenCell]);


  // loading new scores on chosenCell2 selection
  useEffect(()=>{

    if (cellOptions.includes(chosenCell2[0])){

      // read cell data
      const fetchData = async () => {

        let zarrPathInBucket = `${basePath}${relativePath}/cellscores/puck${chosenPuckid.pid}/`;
        let zloader = new ZarrLoader({zarrPathInBucket});
        let rowIdx = cellNameToIdx[chosenCell2[0]];
        const cell2Data = await zloader.getDataRow("cellxbead.zarr/X", rowIdx);

        let locMaxScoreThreshold2 = parseFloat(curPuckMaxScores[rowIdx]);
        locMaxScoreThreshold2 = locMaxScoreThreshold2>0 ? locMaxScoreThreshold2 : 0.0011;
        console.log("locMaxScoreThreshold2", locMaxScoreThreshold2);
        setMaxScoreThreshold2(locMaxScoreThreshold2);
        setScoreUpperThreshold2(locMaxScoreThreshold2);

        // create unifiedData
        let readData = null;
        if(chosenCell2.length>0){ // if a comparison cell is also selected
          readData = unifiedData.map((obj, index) => ({
            ...obj,
            count2: cell2Data[index], 
            logcnt1: unifiedData[index].logcnt1,
            logcnt2: Math.log(cell2Data[index] + 1)/Math.log(locMaxScoreThreshold2+1),
          }));
        }        

        // update state of unifiedData
        setUnifiedData(readData);

        setDataLoadStatus((p)=>({...p, cell:p.cell+1, metadata:p.metadata+1}));

      }
      fetchData();

    }else{
        // create unifiedData
        let readData = unifiedData.map((obj, index) => ({
          ...obj,
          count2:0,
          logcnt2: 1, 
        }));

        // update state of unifiedData
        setUnifiedData(readData);
      console.log("chosenCell2 not included", chosenCell2, dataLoadStatus);
      if (coordsData.length>1){ // to deal with extra inital pass causing progress bar value to overshoot 100%
        setDataLoadStatus((p)=>({...p, cell:p.cell+1, metadata:p.metadata+1}));
      }

    }


  }, [chosenCell2]);

  // recreate unifiedData on change of upperThreshold or lowerThreshold for matching the colormap to active range
  useEffect(()=>{

    if (chosenCell2.length>0){
      let readData = unifiedData.map((obj, index) => ({
        ...obj,
        logcnt1: Math.log(unifiedData[index].count + 1 - scoreLowerThreshold)/Math.log(scoreUpperThreshold+1)
      }));
      setUnifiedData(readData);
    }    

  }, [scoreLowerThreshold, scoreUpperThreshold]);

  // recreate unifiedData on change of upperThreshold2 or lowerThreshold2 for matching the colormap to active range
  useEffect(()=>{
    if (chosenCell2.length>0){
      let readData = unifiedData.map((obj, index) => ({
        ...obj,
        logcnt2: Math.log(unifiedData[index].count2 +1 - scoreLowerThreshold2)/Math.log(scoreUpperThreshold2+1)
      }));
      setUnifiedData(readData);
      console.log("set2 ", readData);
    }  

  }, [scoreLowerThreshold2, scoreUpperThreshold2]);

  // loading frequency bar plot data on change of chosenCell
  useEffect(()=>{
    
    const fetchData = async () => {
      let fbarsDataUrl = `${basePath}${relativePath}/freqbars/cell_jsons_s2c/${chosenCell[0]}.json`
      const readData = await fetch(fbarsDataUrl)
       .then(response => response.json());
        // .then(data_str => JSON.parse(data_str));
      // console.log(readData);
      setFbarsData(readData);
    }
    fetchData();
    
    console.log(fbarsData);

  },[chosenCell]);

  const [viewState, setViewState] = useState({
    // target: [228, 160, 0],
    target: [2048, 1802.5, 0],
    zoom: -3
  });

  const onViewStateChange = useCallback(({viewState}) => {
    // Manipulate view state
    // viewState.target[0] = Math.min(viewState.target[0], 10);
    // Save the view state and trigger rerender
    setViewState(viewState);
  }, []);
  
  let setPuckidAndLoadStatus = (x)=>{
    if (x===chosenPuckid.pid){
      alert("Already showing requested puck: srno "+parseInt(pidToSrno[chosenPuckid.pid]));
    }else{
      setDataLoadStatus((p)=>({cell:0, puck:0, metadata:0}));setChosenPuckid({...chosenPuckid, pid:x});};
  }
  
  const handleCellChange = (cell) => {
    if (cell.length>0){
      setChosenPuckid({...chosenPuckid, cell:cell[0]}); // update celltype in chosenPuckid as well to prevent reset of celltype in useEffect hook
    }
    setChosenCell(cell);
  }

  let regEnrichZarrPath = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/s2d_region_enrich/`;

  const updateChosenItem = (newItem, newPid) => {
    console.log('chosenCelltype ', newItem, ' pid ', newPid);
    setDataLoadStatus({cell:0, puck:0, metadata:0});
    setChosenPuckid({pid:newPid, cell:newItem, gene:chosenPuckid.gene}); 
    carouselRef.current.goToSlide(parseInt(pidToSrno[newPid]-1));
  }

  return(
    <div>
      <Breadcrumbs/>
      <Row>
        <Col xs="2">
          Select Puck
        </Col>
        <Col xs="10">
          <BcdCarousel setPuckidAndLoadStatus={setPuckidAndLoadStatus} chosenPuckid={chosenPuckid.pid}></BcdCarousel>
        </Col>
      </Row>
      <Form>
        <FormGroup as={Row} className="mt-4">
          <Form.Label column sm="3">Select Cell(s)</Form.Label>
          <Col xs="2">
            <Typeahead
              id="basic-typeahead-single"
              labelKey="name"
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, cell:0, metadata:0}));handleCellChange(x);}}
              options={cellOptions}
              placeholder="Choose a cell..."
              // defaultInputValue={cell[0]}
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
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, cell:0, metadata:0}));setChosenCell2(x)}}
              options={cellOptions}
              placeholder="Choose another cell..."
              // defaultInputValue={cell[0]}
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
            for Puck ID:<span style={{fontWeight:"bold"}}>{pidToSrno[chosenPuckid.pid]}</span>
          </Col>
          <Col xs="1">
            Loaded:
          </Col>
          <Col xs="2">
            <ProgressBar now={dataLoadPercent} label={`${dataLoadPercent}%`} />
          </Col>
        </FormGroup>
        <FormGroup as={Row}>
          <Form.Label column sm="3">
            Score Threshold
          </Form.Label>
          <Col xs="1">
            <DualSlider upperThreshold={maxScoreThreshold}
                        lowerThreshold={scoreLowerThreshold}
                        setUmiLowerThreshold={setScoreLowerThreshold} 
                        setUmiUpperThreshold={setScoreUpperThreshold}>
            </DualSlider>
          </Col>
          <Col xs="1">
            Max: {Math.round(maxScoreThreshold* 1000) / 1000}
          </Col>
          {chosenCell2.length>0?<>
          <Col xs="1">
            <DualSlider upperThreshold={maxScoreThreshold2}
                        lowerThreshold={scoreLowerThreshold2}
                        setUmiLowerThreshold={setScoreLowerThreshold2} 
                        setUmiUpperThreshold={setScoreUpperThreshold2}>
            </DualSlider>
          </Col>
          <Col xs="1">
            Max: {Math.round(maxScoreThreshold2* 1000) / 1000}
          </Col>
          </>:<Col xs="2"/>}
          <Col xs="1">
            <BootstrapSwitchButton checked={fbarActiveDataName==='regionwise_cnts'} onstyle="outline-primary" offstyle="outline-secondary" onlabel="R" offlabel="P" onChange={(checked)=>{if (checked){setFbarActiveDataName('regionwise_cnts')}else{setFbarActiveDataName('sorted_puckwise_cnts')}}}/>
          </Col>
          <Col xs="4">
            <FrequencyBars
             setPuckidAndLoadStatus={setPuckidAndLoadStatus}
             data={fbarsData}
            fbarActiveDataName={fbarActiveDataName}
            /> 
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
            {chosenCell2.length>0?<ColorSquare/>:<Colorbar max={maxScoreThreshold} cells={15} setCurrentColorMap={setCurrentColorMap}/>}
          </Col>
        </FormGroup>
      </Form>
      <div className="add-border floater" >
        <Scatterplot id={'left_splot'} 
          unidata={unifiedData} 
          lowerThreshold={scoreLowerThreshold} upperThreshold={scoreUpperThreshold} maxThreshold={maxScoreThreshold}
          lowerThreshold2={scoreLowerThreshold2} upperThreshold2={scoreUpperThreshold2} maxThreshold2={maxScoreThreshold2}
          opacityVal={opacityVal}
          viewState={viewState}
          onViewStateChange={onViewStateChange}
          curNisslUrl={curNisslUrl}
          curAtlasUrl={curAtlasUrl}
          chosenItem2={chosenCell2}
        />
      </div>
      <div className="floater">
        <Dendrogram
          showDendrobar={false}
          divWidth="70%" divHeight="60%"
          sbarWidth={100} sbarHeight={100}
        />
        <RegEnrich setDataLoadStatus={setDataLoadStatus}
                   regEnrichZarrPath={regEnrichZarrPath}
                  updateChosenItem={updateChosenItem}
                  firstColHeader="Celltype"
        />
      </div>
    </div>
  );
}

export default LoaderCellSpatial;   
