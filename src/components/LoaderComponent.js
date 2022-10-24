
import React, { useCallback, useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import RangeSlider from 'react-bootstrap-range-slider';
import {Form, FormGroup, Col, Row, ProgressBar} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import {OrthographicView} from '@deck.gl/core';
import {useStore,useAuthStore} from '../store/store'
import Colorbar from '../components/ColorbarComponent'
import ColorSquare from '../components/ColorSquareComponent'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {getUrl, pidToSrno} from "../shared/common"
import BcdCarousel from "./BcdCarouselComponent"
import FrequencyBars from "./FrequencyBarsComponent"
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Dendrogram from './DendrogramComponent'
import DualSlider from './DualSliderComponent'
import Breadcrumbs from './BreadcrumbsComponent'
import RegEnrich from "./RegEnrichComponent"

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function Loader({dataConfig}){

  const {prefix, maxCountMetadataKey, title, relativePath, freqBarsDataPath} = dataConfig;

  const carouselRef = useStore(state => state.carouselRef);

  const generalToggleFlag = useStore(state => state.generalToggleFlag);
  const togglePid = useStore(state => state.togglePid);
  const [initialRender, setInitialRender] = useState(true);
  const setCurrentColorMap = useStore(state => state.setCurrentColorMap);
  
  const [coordsData, setCoordsData] = useState([{"x":0, "y":0, "z":0, "count":0}]);

  // const [chosenGene, setChosenGene] = useState(["Pcp4"])
  const chosenGene = useStore(state => state.chosenGene);
  const setChosenGene = useStore(state => state.setChosenGene);

  const chosenGene2 = useStore(state => state.chosenGene2);
  const setChosenGene2 = useStore(state => state.setChosenGene2);

  // const [chosenGene, setChosenGene] = useState([geneOptions[0]])
  // const [chosenPuckid, setChosenPuckid] = useState(1)
  const [unifiedData, setUnifiedData] = useState([{"x":0, "y":0, "z":0, "count":0, "count2":0, logcnt1:1, logcnt2:1}]);
  const [fbarsData, setFbarsData] = useState({"regionwise_cnts":[], "sorted_puckwise_cnts":[]});

  // const [umiThreshold, setUmiThreshold ] = useState(0.01);
  const [umiLowerThreshold, setUmiLowerThreshold ] = useState(0.01);
  const [umiUpperThreshold, setUmiUpperThreshold ] = useState(0.01);
  const [umiLowerThreshold2, setUmiLowerThreshold2 ] = useState(1.0);
  const [umiUpperThreshold2, setUmiUpperThreshold2 ] = useState(1.0);
  const [opacityVal, setOpacityVal] = useState(1.0);

  const [dataLoadStatus, setDataLoadStatus] = useState({puck:0, gene:0, metadata:0});
  const [dataLoadPercent, setDataLoadPercent] = useState(0);
  // const [fbarActiveDataName, setFbarActiveDataName] = useState('sorted_puckwise_cnts');
  //
  const fbarActiveDataName = useStore(state => state.fbarActiveDataName);
  const setFbarActiveDataName = useStore(state => state.setFbarActiveDataName);

  const wireframeStatus = useStore(state => state.wireframeStatus);
  const setWireframeStatus = useStore(state => state.setWireframeStatus);
  const nisslStatus = useStore(state => state.nisslStatus);
  const setNisslStatus = useStore(state => state.setNisslStatus);

  const maxUmiThreshold = useStore(state => state.maxUmiThreshold);
  const setMaxUmiThreshold = useStore(state => state.setMaxUmiThreshold);
  const maxUmiThreshold2 = useStore(state => state.maxUmiThreshold2);
  const setMaxUmiThreshold2 = useStore(state => state.setMaxUmiThreshold2);

  const chosenPuckid = useStore(state => state.chosenPuckid);
  const setChosenPuckid = useStore(state => state.setChosenPuckid);

  const geneOptions = useStore(state => state.geneOptions);
  const setGeneOptions = useStore(state => state.setGeneOptions);

  const [curNisslUrl, setCurNisslUrl] = useState('https://storage.googleapis.com/ml_portal/test_data/gene_csvs/puck1/nis_001.png');
  const [curAtlasUrl, setCurAtlasUrl] = useState('https://storage.googleapis.com/ml_portal/test_data/gene_csvs/puck1/chuck_sp_labelmap_001.png');
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  // async function getUrl(pathInBucket){
  //   console.log(pathInBucket);
  //     const storage = getStorage();
  //     const gsReference = ref(storage, pathInBucket);
  //     let url = await getDownloadURL(ref(storage, gsReference))
  //       .then((url) => url);
  //   console.log(url);
  //   return url;
  // }
  
  // useEffect(()=>{
  //   console.log('unifiedData', unifiedData);
  // }, [unifiedData]);

  // generalToggleFlag gets toggled when the user clicks on frequency bar or dendro bar
  useEffect(()=>{
    console.log("generalToggleFlag ", generalToggleFlag, ", dendroPid ", togglePid);
    if (initialRender===false){
      if (togglePid===chosenPuckid){
        alert("Already showing requested puck: srno "+parseInt(pidToSrno[chosenPuckid]));
      }else{
        setDataLoadStatus((p)=>({gene:0, puck:0, metadata:0}));
        setChosenPuckid(togglePid);
        carouselRef.current.goToSlide(parseInt(pidToSrno[togglePid]-1));
      }
    }else{
      setInitialRender(false);
    }    


  },[generalToggleFlag]);

  // determine percentage of data loaded when dataLoadStatus changes
  useEffect(()=>{

    // 100% -> puck 4; gene 1; metadata 1;
    setDataLoadPercent((Math.round(100*(dataLoadStatus.puck+dataLoadStatus.gene+dataLoadStatus.metadata)/6)));
  }, [dataLoadStatus]);

  // loading background image data and coords on puck change
  useEffect(()=>{

    // create full coords path
    // console.log("coordsPath ", coordsPath);

    // read coords data
    const fetchData = async () => {
      let coordsPath = `${relativePath}/puck${chosenPuckid}/coords.csv`
      let coordsUrl = await getUrl(coordsPath);
      const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});

      setCoordsData(readData);
      console.log("new  puckid ", chosenPuckid);
      // console.log(readData);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }
    fetchData();

    const fetchNissl = async () => {
      let nis_url = await getUrl(`${relativePath}/puck${chosenPuckid}/nis_${pad(chosenPuckid, 3)}.png`)

      setCurNisslUrl(nis_url);
      // setDataLoadStatus((p)=>{ console.log(p.dataLoadStatus); return (p.dataLoadStatus+1)});
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }

    const fetchAtlas = async () => {
      // let atlas_url = await getUrl(`${relativePath}/puck${chosenPuckid}/chuck_sp_wireframe_${pad(chosenPuckid,3)}.png`)
      let atlas_url = await getUrl(`test_data2/common/wireframe_trans_bg/chuck_sp_wireframe_${pad(chosenPuckid,3)}.png`)

      setCurAtlasUrl(atlas_url);
      // setDataLoadStatus(dataLoadStatus+1);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));

    }

    fetchNissl();
    fetchAtlas();

    const fetchGeneOptions = async () => {
      let geneOptionsPath = `${relativePath}/puck${chosenPuckid}/geneOptions.json`
      let geneOptionsUrl = await getUrl(geneOptionsPath);
      // const geneOptions = await load(geneOptionsUrl, [CSVLoader], {csv:{delimiter:":"}});
      fetch(geneOptionsUrl
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
          setGeneOptions(myJson.geneOptions);
          setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
        });
    }


    fetchGeneOptions();


  },[relativePath, chosenPuckid]);

  // when puck changes, reload both gene data
  useEffect(()=>{
    // read gene data
    const fetchData = async () => {
      let geneDataPath = `${relativePath}/puck${chosenPuckid}/${prefix}${chosenGene[0]}.csv`
      let geneDataUrl = await getUrl(geneDataPath);
      const geneData = await load(geneDataUrl, [CSVLoader]);

      let readData = null;
      if (chosenGene2.length > 0){ // fetch and update both geneData1 and geneData2
        
        let geneDataPath = `${relativePath}/puck${chosenPuckid}/${prefix}${chosenGene2[0]}.csv`
        let geneDataUrl = await getUrl(geneDataPath);

        // load metadata for gene1 and gene2
        let meta_data_path1 = `${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenGene[0]}.json`
        let metaDataUrl1 = await getUrl(meta_data_path1);
        let meta_data_path2 = `${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenGene2[0]}.json`
        let metaDataUrl2 = await getUrl(meta_data_path2);

        let [metaData, metaData2] = await Promise.all([
                                    fetch(metaDataUrl1).then(response => response.json()), 
                                    fetch(metaDataUrl2).then(response => response.json())]);

        let locMaxUmiThreshold = parseFloat(metaData[maxCountMetadataKey]);
        locMaxUmiThreshold = locMaxUmiThreshold>0 ? locMaxUmiThreshold : 0.1;
        setMaxUmiThreshold(locMaxUmiThreshold);
        setUmiUpperThreshold(locMaxUmiThreshold);

        let locMaxUmiThreshold2 = parseFloat(metaData2[maxCountMetadataKey]);
        locMaxUmiThreshold2 = locMaxUmiThreshold2>0 ? locMaxUmiThreshold2 : 0.1;
        setMaxUmiThreshold2(locMaxUmiThreshold2);
        setUmiUpperThreshold2(locMaxUmiThreshold2);

        const geneData2= await load(geneDataUrl, [CSVLoader]);
          readData = coordsData.map((obj, index) => ({
            ...obj,
            ...geneData[index], 
            count2: geneData2[index].count,
            logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
            logcnt2: Math.log(geneData2[index].count + 1)/Math.log(locMaxUmiThreshold2+1),
          }));



      }else{ // just fetch and update geneData1

        // load metadata for gene1
        let meta_data_path1 = `${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenGene[0]}.json`
        let metaDataUrl1 = await getUrl(meta_data_path1);
        let metaData = await fetch(metaDataUrl1)
          .then(response => response.json());

        let locMaxUmiThreshold = parseFloat(metaData[maxCountMetadataKey]);
        locMaxUmiThreshold = locMaxUmiThreshold>0 ? locMaxUmiThreshold : 0.1;
        setMaxUmiThreshold(locMaxUmiThreshold);
        setUmiUpperThreshold(locMaxUmiThreshold);

        readData = coordsData.map((obj, index) => ({
          ...obj,
          ...geneData[index], 
          count2: 0,
          logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
          logcnt2: 1
        }));
      }       
      setUnifiedData(readData);
      if (coordsData.length>1)
        setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1})); 
    }

    fetchData();


  }, [coordsData]);

  // loading new counts on new gene selection
  useEffect(()=>{
    // console.log("new chosen gene ", chosenGene);

    if (geneOptions.includes(chosenGene[0])){
      // create filename string using gene name and puckid

      // read gene data
      const fetchData = async () => {
      let geneDataPath = `${relativePath}/puck${chosenPuckid}/${prefix}${chosenGene[0]}.csv`
      let geneDataUrl = await getUrl(geneDataPath);
        const geneData = await load(geneDataUrl, [CSVLoader]);

        // load metadata for gene1
        let meta_data_path1 = `${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenGene[0]}.json`
        let metaDataUrl1 = await getUrl(meta_data_path1);
        let metaData = await fetch(metaDataUrl1).then(response => response.json());
        let locMaxUmiThreshold = parseFloat(metaData[maxCountMetadataKey]);
        locMaxUmiThreshold = locMaxUmiThreshold>0?locMaxUmiThreshold:0.1;
        setMaxUmiThreshold(locMaxUmiThreshold);
        setUmiUpperThreshold(locMaxUmiThreshold);

        console.log('locMaxUmiThreshold', locMaxUmiThreshold, 'chosenGene', chosenGene);


        // create unifiedData
        let readData = null;
        if(chosenGene2.length>0){ // if a comparison gene is also selected
          readData = coordsData.map((obj, index) => ({
            ...obj,
            ...geneData[index], 
            count2: unifiedData[index].count2,
            logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
            logcnt2: unifiedData[index].logcnt2,
          }));
        }else{ // when no comparison gene is selected
          readData = coordsData.map((obj, index) => ({
            ...obj,
            ...geneData[index], // stores count
            logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
            count2: 0,
            logcnt2: 1
          }));
         }
        // update state of unifiedData
        setUnifiedData(readData);

        // let maxVal = Math.max(...unifiedData.map(o => o.count));
        // console.log(unifiedData);

        if (coordsData.length>1){ // to deal with extra inital pass causing progress bar value to overshoot 100%
          setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1}));
        }
      }
      fetchData();
    }else{
      console.log("chosen gene not included", chosenGene);
    }
      
  }, [chosenGene]);
  
  // loading new counts on new gene selection for chosenGene2
  useEffect(()=>{
    if (geneOptions.includes(chosenGene2[0])){
      // create filename string using gene name and puckid

      // read gene data
      const fetchData = async () => {
        let gene2DataPath = `${relativePath}/puck${chosenPuckid}/${prefix}${chosenGene2[0]}.csv`
        let gene2DataUrl = await getUrl(gene2DataPath);
        const gene2Data = await load(gene2DataUrl, [CSVLoader]);

        // load metadata for gene2
        let meta_data_path2 = `${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenGene2[0]}.json`
        let metaDataUrl2 = await getUrl(meta_data_path2);
        let metaData2 = await fetch(metaDataUrl2).then(response => response.json());
        let locMaxUmiThreshold2 = parseFloat(metaData2[maxCountMetadataKey]);
        locMaxUmiThreshold2 = locMaxUmiThreshold2>0?locMaxUmiThreshold2:0.1;
        setMaxUmiThreshold2(locMaxUmiThreshold2);
        setUmiUpperThreshold2(locMaxUmiThreshold2);

        // create unifiedData
        let readData = null;
        if (chosenGene2.length > 0){
          readData = unifiedData.map((obj, index) => ({
            ...obj,
            count2:gene2Data[index].count,
            logcnt1: unifiedData[index].logcnt1,
            logcnt2: Math.log(gene2Data[index].count + 1)/Math.log(locMaxUmiThreshold2+1)
          }));
        }

        // update state of unifiedData
        setUnifiedData(readData);

        setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1}));
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
      console.log("chosenGene2 not included", chosenGene2, dataLoadStatus);
      if (coordsData.length>1){ // to deal with extra inital pass causing progress bar value to overshoot 100%
        setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1}));
      }

    }

  }, [chosenGene2])

  // recreate unifiedData on change of umiUpperThreshold or umiLowerThreshold
  useEffect(()=>{

    if (chosenGene2.length>0){
      let readData = unifiedData.map((obj, index) => ({
        ...obj,
        logcnt1: Math.log(unifiedData[index].count + 1 - umiLowerThreshold)/Math.log(umiUpperThreshold+1)
      }));
      setUnifiedData(readData);
    }    

  }, [umiLowerThreshold, umiUpperThreshold]);

  // recreate unifiedData on change of umiUpperThreshold2 or umiLowerThreshold2
  useEffect(()=>{
    if (chosenGene2.length>0){
      let readData = unifiedData.map((obj, index) => ({
        ...obj,
        logcnt2: Math.log(unifiedData[index].count2 +1 - umiLowerThreshold2)/Math.log(umiUpperThreshold2+1)
      }));
      setUnifiedData(readData);
      console.log("set2 ", readData);
    }  

  }, [umiLowerThreshold2, umiUpperThreshold2]);


  // loading frequency bar plot data on change of chosenGene
  useEffect(()=>{
    

    const fetchData = async () => {
      let fbars_data_path = `${freqBarsDataPath}/${chosenGene}.json`
      let fbarsDataUrl = await getUrl(fbars_data_path);
      // let meta_data_path2 = 'https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1/metadata_gene_Pcp4.json'
      // console.log('meta_data_path ', meta_data_path);
      // console.log('meta_data_path ', meta_data_path2);
      const readData = await fetch(fbarsDataUrl)
       .then(response => response.json());
        // .then(data_str => JSON.parse(data_str));


      // console.log(readData);
      setFbarsData(readData);
      // setCoordsData(readData);
      // setMaxUmiThreshold(parseFloat(readData['maxCount']));
      // setMaxUmiThreshold(parseFloat(readData[maxCountMetadataKey]));
      // setDataLoadStatus((p)=>({...p, metadata:p.metadata+1}));
    }
    fetchData();
    
    console.log(fbarsData);


  },[chosenGene]);

  
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
      {/* <h4>{title}</h4> */}
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
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, gene:0, metadata:0}));setChosenGene(x)}}
              options={geneOptions}
              placeholder="Choose a gene..."
              // defaultInputValue={geneOptions[0]}
              selected={chosenGene}
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
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, gene:0, metadata:0}));setChosenGene2(x)}}
              options={geneOptions}
              placeholder="Choose another gene..."
              // defaultInputValue={geneOptions[0]}
              selected={chosenGene2}
              filterBy={(option, props) => {
                /* Own filtering code goes here. */
                return (option.toLowerCase().indexOf(props.text.toLowerCase()) === 0)
              }}
              disabled={chosenGene.length>0?false:true}
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
            <DualSlider maxUmiThreshold={maxUmiThreshold}
                        setUmiLowerThreshold={setUmiLowerThreshold} 
                        setUmiUpperThreshold={setUmiUpperThreshold}>
            </DualSlider>
          </Col>
          <Col xs="1">
            Max: {Math.round(maxUmiThreshold* 1000) / 1000}
          </Col>
          {chosenGene2.length>0?<>
          <Col xs="1">
            <DualSlider maxUmiThreshold={maxUmiThreshold2}
                        setUmiLowerThreshold={setUmiLowerThreshold2} 
                        setUmiUpperThreshold={setUmiUpperThreshold2}>
            </DualSlider>
          </Col>
          <Col xs="1">
            Max: {Math.round(maxUmiThreshold2* 1000) / 1000}
          </Col>
          </>:<Col xs="2"/>}
          <Col xs="1">
            <BootstrapSwitchButton checked={fbarActiveDataName==='regionwise_cnts'} onstyle="outline-primary" offstyle="outline-secondary" 
            onlabel="R" offlabel="P"
              onChange={(checked)=>{if (checked){setFbarActiveDataName('regionwise_cnts')}else{setFbarActiveDataName('sorted_puckwise_cnts')}}}/>
          </Col>
          <Col xs="4">
            <FrequencyBars
            setPuckidAndLoadStatus={setPuckidAndLoadStatus}
            data={fbarsData}
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
            {chosenGene2.length>0?<ColorSquare/>:<Colorbar max={maxUmiThreshold} cells={15} setCurrentColorMap={setCurrentColorMap}/>}
          </Col>
        </FormGroup>
      </Form>
      <div className="add-border floater" >
        <Scatterplot id={'left_splot'} 
          unidata={unifiedData} 
          umiLowerThreshold={umiLowerThreshold} umiUpperThreshold={umiUpperThreshold}
          umiLowerThreshold2={umiLowerThreshold2} umiUpperThreshold2={umiUpperThreshold2}
          opacityVal={opacityVal}
          viewState={viewState}
          onViewStateChange={onViewStateChange}
          curNisslUrl={curNisslUrl}
          curAtlasUrl={curAtlasUrl}
        />
      </div>
      <div className="floater">
        <Dendrogram
          setPuckidAndLoadStatus={(x)=>{setDataLoadStatus((p)=>({gene:0, puck:0, metadata:0}));setChosenPuckid(x);}}
        />
        <RegEnrich setChosenGene={(x)=>{setDataLoadStatus((p)=>({...p, gene:0, metadata:0}));setChosenGene(x)}}
/>
      </div>
      {/* <div className="add-border floater"> */}
      {/*   <Scatterplot id={'right_splot'} */} 
      {/*     unidata={unifiedData} threshold={umiThreshold} */} 
      {/*     opacityVal={opacityVal} */}
      {/*     viewState = {viewState} */}
      {/*     onViewStateChange={onViewStateChange} */}
      {/*     curNisslUrl={curNisslUrl} */}
      {/*     curAtlasUrl={curAtlasUrl} */}
      {/*   /> */}
      {/* </div> */}
    </div>
  );
}

export default Loader;   

// Reference
// https://devtrium.com/posts/async-functions-useeffect
// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
// https://stackoverflow.com/questions/50919164/how-to-merge-each-object-within-arrays-by-index
// https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
// https://firebase.google.com/docs/auth/web/manage-users - check if signed in already
// https://typeofnan.dev/why-you-cant-setstate-multiple-times-in-a-row/
// https://stackoverflow.com/questions/41278385/setstate-doesnt-update-the-state-immediately



