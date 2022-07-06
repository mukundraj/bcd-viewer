
import React, { useCallback, useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import RangeSlider from 'react-bootstrap-range-slider';
import {Form, FormGroup, Col, Row} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import {OrthographicView} from '@deck.gl/core';
import {useStore,useAuthStore} from '../store/store'
import Colorbar from '../components/ColorbarComponent'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {getUrl} from "../shared/common"
import BcdCarousel from "./BcdCarouselComponent"


function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function Loader({prefix, maxCountMetadataKey, title, relativePath}) {

  const [coordsData, setCoordsData] = useState([{"x":0, "y":0, "z":0, "count":0}]);

  const [chosenGene, setChosenGene] = useState(["Pcp4"])
  // const [chosenGene, setChosenGene] = useState([geneOptions[0]])
  const [chosenPuckid, setChosenPuckid] = useState(1)
  const [unifiedData, setUnifiedData] = useState([{"x":0, "y":0, "z":0, "count":0}]);

  const [umiThreshold, setUmiThreshold ] = useState(-1);
  const [opacityVal, setOpacityVal] = useState(0.8);

  const maxUmiThreshold = useStore(state => state.maxUmiThreshold);
  const setMaxUmiThreshold = useStore(state => state.setMaxUmiThreshold);


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

    }
    fetchData();

    const fetchNissl = async () => {
      let nis_url = await getUrl(`${relativePath}/puck${chosenPuckid}/nis_${pad(chosenPuckid, 3)}.png`)

      setCurNisslUrl(nis_url);
    }

    const fetchAtlas = async () => {
      let atlas_url = await getUrl(`${relativePath}/puck${chosenPuckid}/chuck_sp_wireframe_${pad(chosenPuckid,3)}.png`)

      setCurAtlasUrl(atlas_url);

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
          console.log(myJson.geneOptions);
          // setData(myJson)
          setGeneOptions(myJson.geneOptions);
        });
    }


    fetchGeneOptions();


  },[relativePath, chosenPuckid]);

  // loading new counts on new gene selection
  useEffect(()=>{
    // console.log("new chosen gene ", chosenGene);

    if (geneOptions.includes(chosenGene[0])){
      // create filename string using gene name and puckid

      // read gene data
      const fetchData = async () => {
      let geneDataPath = `${relativePath}/puck${chosenPuckid}/${prefix}${chosenGene[0]}.csv`
      let geneDataUrl = await getUrl(geneDataPath);
      console.log("geneDataPath ", geneDataUrl);
        const geneData = await load(geneDataUrl, [CSVLoader]);


        // create unifiedData
        let readData = coordsData.map((obj, index) => ({
          ...obj,
          ...geneData[index]
        }));

        // update state of unifiedData
        setUnifiedData(readData);
        // console.log(readData);

        // let maxVal = Math.max(...unifiedData.map(o => o.count));
        // console.log(unifiedData);
        console.log("new puck loaded")

      }
      fetchData();
    }else{
      console.log("chosen gene not included", chosenGene);
    }
      
  },[coordsData, chosenGene]);
  
  // loading meta data on new puck or new gene selection
  useEffect(()=>{

    // Math.max.apply(Math, unifiedData.map(function(o) { return o.y; }))
    const fetchData = async () => {
      let meta_data_path = `${relativePath}/puck${chosenPuckid}/metadata_gene_${chosenGene}.json`
      let metaDataUrl = await getUrl(meta_data_path);
      // let meta_data_path2 = 'https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1/metadata_gene_Pcp4.json'
      console.log('meta_data_path ', meta_data_path);
      // console.log('meta_data_path ', meta_data_path2);
      const readData = await fetch(metaDataUrl)
       .then(response => response.json());
        // .then(data_str => JSON.parse(data_str));


      // setCoordsData(readData);
      // setMaxUmiThreshold(parseFloat(readData['maxCount']));
      setMaxUmiThreshold(parseFloat(readData[maxCountMetadataKey]));
    }
    fetchData();

  }, [relativePath, chosenPuckid, chosenGene]);

  
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

  return(
    <div>
      <h4>{title}</h4>
      <Row>
        <Col xs="2">
          Select Puck
        </Col>
          <Col xs="10">
            <BcdCarousel setChosenPuckid={setChosenPuckid} chosenPuckid={chosenPuckid}></BcdCarousel>
          </Col>
        </Row>
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
              max={207}
              step={2}
            />
          </Col>
          <Col xs="1">
            Max: {207}
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
              defaultInputValue={geneOptions[0]}
            />
          </Col>
          <Col xs="2">
            for Puck
          </Col>
          <Col xs="1">
            PID
          </Col>
          <Col xs="1">
            Loaded
          </Col>
          <Col xs="2">
            Progress Bar
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
              step={maxUmiThreshold/100}
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
          <Col xs="6">
            <Colorbar/>
          </Col>
        </FormGroup>
      </Form>
      <div className="add-border floater" >
        <Scatterplot id={'left_splot'} 
          unidata={unifiedData} threshold={umiThreshold}  
          opacityVal={opacityVal}
          viewState={viewState}
          onViewStateChange={onViewStateChange}
          curNisslUrl={curNisslUrl}
          curAtlasUral={curAtlasUrl}
        />
      </div>
      <div className="add-border floater">
        <Scatterplot id={'right_splot'} 
          unidata={unifiedData} threshold={umiThreshold} 
          opacityVal={opacityVal}
          viewState = {viewState}
          onViewStateChange={onViewStateChange}
          curNisslUrl={curNisslUrl}
          curAtlasUrl={curAtlasUrl}
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
// https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
// https://firebase.google.com/docs/auth/web/manage-users - check if signed in already



