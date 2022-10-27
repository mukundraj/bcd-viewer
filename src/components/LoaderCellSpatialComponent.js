import React, { useCallback, useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
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
import ZarrLoader from "../loaders/ZarrLoader"
import DualSlider from './DualSliderComponent'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Colorbar from '../components/ColorbarComponent'
import ColorSquare from '../components/ColorSquareComponent'

function LoaderCellSpatial({dataConfig}){

  const {prefix, maxCountMetadataKey, title, basePath, relativePath, freqBarsDataPath} = dataConfig;
  const carouselRef = useStore(state => state.carouselRef);
  
  const setCurrentColorMap = useStore(state => state.setCurrentColorMap);


  const maxScoreThreshold = useCSComponentStore(state => state.maxScoreThreshold);
  const setMaxScoreThreshold = useCSComponentStore(state => state.setMaxScoreThreshold);
  const maxScoreThreshold2 = useCSComponentStore(state => state.maxScoreThreshold2);
  const setMaxScoreThreshold2 = useCSComponentStore(state => state.setMaxScoreThreshold2);

  const chosenPuckid = useStore(state => state.chosenPuckid);
  const setChosenPuckid = useStore(state => state.setChosenPuckid);
  const [dataLoadStatus, setDataLoadStatus] = useState({puck:0, cell:0, metadata:0});
  const [dataLoadPercent, setDataLoadPercent] = useState(0);

  const [unifiedData, setUnifiedData] = useState([{"x":0, "y":0, "z":0, "count":0, "count2":0, logcnt1:1, logcnt2:1}]);

  const [scoreLowerThreshold, setScoreLowerThreshold ] = useState(0.0001);
  const [scoreUpperThreshold, setScoreUpperThreshold ] = useState(0.0001);
  const [scoreLowerThreshold2, setScoreLowerThreshold2 ] = useState(0.0001);
  const [scoreUpperThreshold2, setScoreUpperThreshold2 ] = useState(0.0001);
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

  const [cellNameToIdx, setCellNameToIdx] = useState({'Inh_Lhx6_Nmu_1':560 });

  const curPuckMaxScores = useCSComponentStore(state => state.curPuckMaxScores);
  const setCurPuckMaxScores = useCSComponentStore(state => state.setCurPuckMaxScores);



  // determine percentage of data loaded when dataLoadStatus changes
  useEffect(()=>{

    // 100% -> puck 4; cell 1; metadata 1;
    setDataLoadPercent((Math.round(100*(dataLoadStatus.puck+dataLoadStatus.cell+dataLoadStatus.metadata)/6)));

    console.log("dataLoadStatus changed to: ", dataLoadStatus);
  }, [dataLoadStatus]);

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
      console.log("nis_url: ", nis_url);

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

          console.log("cellOptions", myJson.cellOptions[560]);

          // create cellNameToIdx
          let cellNameToIdx = {};
          myJson.cellOptions.forEach((cell, idx)=>{
            cellNameToIdx[cell] = idx;
          }
          );
          setCellNameToIdx(()=>cellNameToIdx);
        });
    }

    fetchCellOptions();
    console.log("puck update initiated..");

  },[chosenPuckid]);


  // when puck changes, reload both cell data
  useEffect(()=>{
    // read gene data
    const fetchData = async () => {
      // let geneDataPath = `${relativePath}/puck${chosenPuckid}/${prefix}${chosenCell[0]}.csv`
      // let geneDataUrl = await getUrl(geneDataPath);
      // const geneData = await load(geneDataUrl, [CSVLoader]);

      let zarrPathInBucket = `${basePath}${relativePath}/puck${chosenPuckid}/`;
      console.log("zarrPathInBucket ", zarrPathInBucket);
      let zloader = new ZarrLoader({zarrPathInBucket});
      let rowIdx = cellNameToIdx[chosenCell[0]];
      const cellData = await zloader.getDataRow("cellxbead.zarr/X", rowIdx);

      let readData = null;
      if (chosenCell2.length > 0){ // fetch and update both geneData1 and geneData2
        
        // let geneDataPath = `${relativePath}/puck${chosenPuckid}/${prefix}${chosenGene2[0]}.csv`
        // let geneDataUrl = await getUrl(geneDataPath);

        // // load metadata for gene1 and gene2
        // let meta_data_path1 = `${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenGene[0]}.json`
        // let metaDataUrl1 = await getUrl(meta_data_path1);
        // let meta_data_path2 = `${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenGene2[0]}.json`
        // let metaDataUrl2 = await getUrl(meta_data_path2);

        // let [metaData, metaData2] = await Promise.all([
        //                             fetch(metaDataUrl1).then(response => response.json()), 
        //                             fetch(metaDataUrl2).then(response => response.json())]);

        // let locMaxUmiThreshold = parseFloat(metaData[maxCountMetadataKey]);
        // locMaxUmiThreshold = locMaxUmiThreshold>0 ? locMaxUmiThreshold : 0.1;
        // setMaxUmiThreshold(locMaxUmiThreshold);
        // setUmiUpperThreshold(locMaxUmiThreshold);

        // let locMaxUmiThreshold2 = parseFloat(metaData2[maxCountMetadataKey]);
        // locMaxUmiThreshold2 = locMaxUmiThreshold2>0 ? locMaxUmiThreshold2 : 0.1;
        // setMaxUmiThreshold2(locMaxUmiThreshold2);
        // setUmiUpperThreshold2(locMaxUmiThreshold2);

        // const geneData2= await load(geneDataUrl, [CSVLoader]);
        //   readData = coordsData.map((obj, index) => ({
        //     ...obj,
        //     ...geneData[index], 
        //     count2: geneData2[index].count,
        //     logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
        //     logcnt2: Math.log(geneData2[index].count + 1)/Math.log(locMaxUmiThreshold2+1),
        //   }));

      }else{ // just fetch and update geneData1

        // load metadata for gene1
        // let metaDataUrl = `${basePath}${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenCell[0]}.json`
        // // let metaDataUrl1 = await getUrl(meta_data_path1);
        // let metaData = await fetch(metaDataUrl)
        //   .then(response => response.json());

        // console.log('metaData', metaData);

        // let locMaxUmiThreshold = parseFloat(metaData[maxCountMetadataKey]);
        // locMaxUmiThreshold = locMaxUmiThreshold>0 ? locMaxUmiThreshold : 0.1;
        // setMaxUmiThreshold(locMaxUmiThreshold);
        // setUmiUpperThreshold(locMaxUmiThreshold);
        //

        let locMaxScores = await zloader.getDataRow("cellxbead.zarr/maxScores/X", 0);
        setCurPuckMaxScores(locMaxScores);



        let locMaxScoreThreshold = parseFloat(locMaxScores[rowIdx]);
        locMaxScoreThreshold = locMaxScoreThreshold>0 ? locMaxScoreThreshold : 0.0011;
        console.log("locMaxScoreThreshold", locMaxScoreThreshold, rowIdx, locMaxScores.indexOf(Math.max(...locMaxScores)));
        setMaxScoreThreshold(locMaxScoreThreshold);
        setScoreUpperThreshold(locMaxScoreThreshold);
        console.log("scoreLowerThreshold", scoreLowerThreshold);

        // console.log("coordsData", coordsData);
        // console.log("cellData", cellData);
        
        readData = coordsData.map((obj, index) => ({
          ...obj,
          count:cellData[index], 
          // count2: 0,
          // logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
          // logcnt2: 1
        }));
      }       
      console.log("readData", readData);

      setUnifiedData(readData);
      if (coordsData.length>1)
        setDataLoadStatus((p)=>({...p, cell:p.cell+1, metadata:p.metadata+1})); 
    }

    fetchData();


  }, [coordsData]);

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
    if (x===chosenPuckid){
      alert("Already showing requested puck: srno "+parseInt(pidToSrno[chosenPuckid]));
    }else{
      setDataLoadStatus((p)=>({gene:0, puck:0, metadata:0}));setChosenPuckid(x);};
  }

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
        <FormGroup as={Row}>
          <Form.Label column sm="3">
            UMI Count Threshold
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
            {/* <BootstrapSwitchButton checked={fbarActiveDataName==='regionwise_cnts'} onstyle="outline-primary" offstyle="outline-secondary" onlabel="R" offlabel="P" onChange={(checked)=>{if (checked){setFbarActiveDataName('regionwise_cnts')}else{setFbarActiveDataName('sorted_puckwise_cnts')}}}/> */}
          </Col>
          <Col xs="4">
            {/* <FrequencyBars */}
            {/* setPuckidAndLoadStatus={setPuckidAndLoadStatus} */}
            {/* data={fbarsData} */}
            {/* /> */}
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
          umiLowerThreshold={scoreLowerThreshold} umiUpperThreshold={scoreUpperThreshold}
          umiLowerThreshold2={scoreLowerThreshold2} umiUpperThreshold2={scoreUpperThreshold2}
          opacityVal={opacityVal}
          viewState={viewState}
          onViewStateChange={onViewStateChange}
          curNisslUrl={curNisslUrl}
          curAtlasUrl={curAtlasUrl}
        />
      </div>
    </div>
  );
}

export default LoaderCellSpatial;   
