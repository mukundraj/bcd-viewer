
import React, { useCallback, useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import RangeSlider from 'react-bootstrap-range-slider';
import {Form, FormGroup, Col, Row, ProgressBar} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import {OrthographicView} from '@deck.gl/core';
import {useStore,useAuthStore, usePersistStore} from '../store/store'
import {useGEComponentStore} from '../store/GEComponentStore'
import Colorbar from '../components/ColorbarComponent'
import ColorSquare from '../components/ColorSquareComponent'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {getUrl, pidToSrno, pad} from "../shared/common"
import BcdCarousel from "./BcdCarouselComponent"
import FrequencyBars from "./FrequencyBarsComponent"
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Dendrogram from './DendrogramComponent'
import DualSlider from './DualSliderComponent'
import Breadcrumbs from './BreadcrumbsComponent'
import RegEnrich from "./RegEnrichComponent"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../css/Tooltip.css'
import {TOOLTEXTS as ttText} from '../shared/tooltipTexts'
// import ReactGA from "react-ga4";

function Loader({dataConfig, validatedURLParams}){

  const {maxCountMetadataKey, basePath, dpathGeneExprs, dpathFreqBarsJsons, regEnrichZarrPath, nameInfoFilePath} = dataConfig;

  const carouselRef = useStore(state => state.carouselRef);

  const generalToggleFlag = useStore(state => state.generalToggleFlag);
  const togglePid = useStore(state => state.togglePid);
  const [initialRender, setInitialRender] = useState(true);
  const setCurrentColorMap = useStore(state => state.setCurrentColorMap);
  
  const [coordsData, setCoordsData] = useState([{"x":0, "y":0, "z":0, "count":0}]);

  const chosenGene = usePersistStore(state => state.chosenGene);
  const setChosenGene = usePersistStore(state => state.setChosenGene);

  const chosenGene2 = useStore(state => state.chosenGene2);
  const setChosenGene2 = useStore(state => state.setChosenGene2);

  // const [chosenGene, setChosenGene] = useState([geneOptions[0]])
  // const [chosenPuckid, setChosenPuckid] = useState(1)
  const [unifiedData, setUnifiedData] = useState([{"x":0, "y":0, "z":0, "count":0, "count2":0, logcnt1:1, logcnt2:1}]);
  // const [unifiedDataTmp1, setUnifiedDataTmp1] = useState([{"x":0, "y":0, "z":0, "count":0, "count2":0, logcnt1:1, logcnt2:1}]);
  const [fbarsData, setFbarsData] = useState({"regionwise_cnts":[], "sorted_puckwise_cnts":[]});

  const umiLowerThreshold = useGEComponentStore(state => state.umiLowerThreshold);
  const setUmiLowerThreshold = useGEComponentStore(state => state.setUmiLowerThreshold);
  const umiUpperThreshold = useGEComponentStore(state => state.umiUpperThreshold);
  const setUmiUpperThreshold = useGEComponentStore(state => state.setUmiUpperThreshold);
  const umiLowerThreshold2 = useGEComponentStore(state => state.umiLowerThreshold2);
  const setUmiLowerThreshold2 = useGEComponentStore(state => state.setUmiLowerThreshold2);
  const umiUpperThreshold2 = useGEComponentStore(state => state.umiUpperThreshold2);
  const setUmiUpperThreshold2 = useGEComponentStore(state => state.setUmiUpperThreshold2);
  const opacityVal = useGEComponentStore(state => state.opacityVal);
  const setOpacityVal = useGEComponentStore(state => state.setOpacityVal);

  const urlUmiLowerThreshold = useGEComponentStore(state => state.urlUmiLowerThreshold);
  const setUrlUmiLowerThreshold = useGEComponentStore(state => state.setUrlUmiLowerThreshold);
  const urlUmiUpperThreshold = useGEComponentStore(state => state.urlUmiUpperThreshold);
  const setUrlUmiUpperThreshold = useGEComponentStore(state => state.setUrlUmiUpperThreshold);
  const urlUmiLowerThreshold2 = useGEComponentStore(state => state.urlUmiLowerThreshold2);
  const setUrlUmiLowerThreshold2 = useGEComponentStore(state => state.setUrlUmiLowerThreshold2);
  const urlUmiUpperThreshold2 = useGEComponentStore(state => state.urlUmiUpperThreshold2);
  const setUrlUmiUpperThreshold2 = useGEComponentStore(state => state.setUrlUmiUpperThreshold2);

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

  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);

  const geneOptions = useStore(state => state.geneOptions);
  const setGeneOptions = useStore(state => state.setGeneOptions);

  const [curNisslUrl, setCurNisslUrl] = useState('');
  const [curAtlasUrl, setCurAtlasUrl] = useState('');
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const viaURL = useStore(state => state.viaURL); // conveys whether the user has entered the page via a URL
  const setViaURL = useStore(state => state.setViaURL);

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


  useEffect(() => {
    // ReactGA.send({ hitType: "pageview", page: "/genex" });
    document.title = "Gene Expression | BrainCellData Viewer";
  }, []);

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
      if (togglePid===chosenPuckid.pid){
        alert("Already showing requested puck: srno "+parseInt(pidToSrno[chosenPuckid.pid]));
      }else{
        setDataLoadStatus((p)=>({gene:0, puck:0, metadata:0}));
        setChosenPuckid({...chosenPuckid, pid:togglePid});
        carouselRef.current.goToSlide(parseInt(pidToSrno[togglePid]-1));
      }
    }else{
      setInitialRender(false);
    }    


  },[generalToggleFlag]);


  // determine percentage of data loaded when dataLoadStatus changes
  useEffect(()=>{
    console.log("dataLoadStatus", dataLoadStatus);
    // 100% -> puck 4; gene 1; metadata 1;
    setDataLoadPercent((Math.round(100*(dataLoadStatus.puck+dataLoadStatus.gene+dataLoadStatus.metadata)/6)));
  }, [dataLoadStatus]);

  // loading background image data and coords on puck change
  useEffect(()=>{

    // create full coords path
    // console.log("coordsPath ", coordsPath);

    // read coords data
    const fetchData = async () => {
      let coordsUrl = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/coords.csv`
      // let coordsUrl = await getUrl(coordsPath);
      const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});

      setCoordsData(readData);
      console.log("new  puckid ", chosenPuckid);
      // console.log(readData);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }
    fetchData();

    const fetchNissl = async () => {
      // todo: remove hardcoding below by updating basePath and relativePath
      let nis_url = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/nis_${pad(chosenPuckid.pid, 3)}.png`
      setCurNisslUrl(nis_url);
      // setDataLoadStatus((p)=>{ console.log(p.dataLoadStatus); return (p.dataLoadStatus+1)});
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }

    const fetchAtlas = async () => {
      // todo: remove hardcoding below by updating basePath and relativePath
      let atlas_url = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/chuck_sp_wireframe_${pad(chosenPuckid.pid,3)}.png`;

      setCurAtlasUrl(atlas_url);
      // setDataLoadStatus(dataLoadStatus+1);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));

    }

    fetchNissl();
    fetchAtlas();

    const fetchGeneOptions = async () => {
      let geneOptionsUrl = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/geneOptions.json`
      // let geneOptionsUrl = await getUrl(geneOptionsPath);
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


  // },[relativePath, chosenPuckid.pid]);
  },[chosenPuckid.pid]);

  // when puck changes and coords loaded, load both gene data and gene metadata (maxCounts)
  useEffect(()=>{

    // read gene data
    const fetchData = async () => {
      let geneDataUrl = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/gene_${chosenGene[0]}.csv`
      // let geneDataUrl = await getUrl(geneDataPath);
      const geneData = await load(geneDataUrl, [CSVLoader]);

      let readData = null;
      if (chosenGene2.length > 0){ // fetch and update both geneData1 and geneData2
        
        let geneDataUrl = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/gene_${chosenGene2[0]}.csv`
        // let geneDataUrl = await getUrl(geneDataPath);

        // load metadata for gene1 and gene2
        let metaDataUrl1 = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/metadata_gene_${chosenGene[0]}.json`
        // let metaDataUrl1 = await getUrl(meta_data_path1);
        let metaDataUrl2 = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/metadata_gene_${chosenGene2[0]}.json`
        // let metaDataUrl2 = await getUrl(meta_data_path2);

        let [metaData, metaData2] = await Promise.all([
                                    fetch(metaDataUrl1).then(response => response.json()), 
                                    fetch(metaDataUrl2).then(response => response.json())]);

        let locMaxUmiThreshold = parseFloat(metaData[maxCountMetadataKey]);
        locMaxUmiThreshold = locMaxUmiThreshold>0 ? locMaxUmiThreshold : 0.1;
        setMaxUmiThreshold(locMaxUmiThreshold);

        if (urlUmiUpperThreshold !==null){ // use URL params if provided
          setUmiUpperThreshold(urlUmiUpperThreshold);
          setUrlUmiUpperThreshold(null);
        }else{
          setUmiUpperThreshold(locMaxUmiThreshold);
        }
        if (urlUmiLowerThreshold !== null){ // use URL params if provided
          setUmiLowerThreshold(urlUmiLowerThreshold);
          setUrlUmiLowerThreshold(null);
        }else{
          setUmiLowerThreshold(0.01);
        }

        let locMaxUmiThreshold2 = parseFloat(metaData2[maxCountMetadataKey]);
        locMaxUmiThreshold2 = locMaxUmiThreshold2>0 ? locMaxUmiThreshold2 : 0.1;
        setMaxUmiThreshold2(locMaxUmiThreshold2);

        if (urlUmiUpperThreshold2 !==null){ // use URL params if provided
          setUmiUpperThreshold2(urlUmiUpperThreshold2);
          setUrlUmiUpperThreshold2(null);
        }else{
          setUmiUpperThreshold2(locMaxUmiThreshold2);
        }
        if (urlUmiLowerThreshold2 !== null){ // use URL params if provided
          setUmiLowerThreshold2(urlUmiLowerThreshold2);
          setUrlUmiLowerThreshold2(null);
        }else{
          setUmiLowerThreshold2(0.01);
        }

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
        let metaDataUrl1 = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/metadata_gene_${chosenGene[0]}.json`
        // let metaDataUrl1 = await getUrl(meta_data_path1);
        let metaData = await fetch(metaDataUrl1)
          .then(response => response.json());

        let locMaxUmiThreshold = parseFloat(metaData[maxCountMetadataKey]);
        locMaxUmiThreshold = locMaxUmiThreshold>0 ? locMaxUmiThreshold : 0.1;
        setMaxUmiThreshold(locMaxUmiThreshold);

        if (urlUmiUpperThreshold !==null){ // use URL params if provided
          setUmiUpperThreshold(urlUmiUpperThreshold);
          setUrlUmiUpperThreshold(null);
        }else{
          setUmiUpperThreshold(locMaxUmiThreshold);
        }
        if (urlUmiLowerThreshold !== null){ // use URL params if provided
          setUmiLowerThreshold(urlUmiLowerThreshold);
          setUrlUmiLowerThreshold(null);
        }else{
          setUmiLowerThreshold(0.01);
        }

        readData = coordsData.map((obj, index) => ({
          ...obj,
          ...geneData[index], 
          count2: 0,
          logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
          logcnt2: 1
        }));
      }       
      setUnifiedData(readData);
      if (coordsData.length>1 && (!geneOptions.includes(chosenGene2[0]))){
        setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1})); 
        }
    }
    
    if (chosenPuckid.gene === chosenGene[0]){ // loading gene data when not triggered by region enrichment
      fetchData();
    }else{
      setChosenGene([chosenPuckid.gene]); // only update gene to match the gene set by region enrichment component
    }

  }, [coordsData]);

  // loading new gene data and gene metadata on new gene selection
  useEffect(()=>{
    // console.log("new chosen gene ", chosenGene);

    if (geneOptions.includes(chosenGene[0])){
      // create filename string using gene name and puckid

      // read gene data
      const fetchData = async () => {
      let geneDataUrl = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/gene_${chosenGene[0]}.csv`
      // let geneDataUrl = await getUrl(geneDataPath);
        const geneData = await load(geneDataUrl, [CSVLoader]);

        // load metadata for gene1
        let metaDataUrl1 = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/metadata_gene_${chosenGene[0]}.json`
        // let metaDataUrl1 = await getUrl(meta_data_path1);
        let metaData = await fetch(metaDataUrl1).then(response => response.json());
        let locMaxUmiThreshold = parseFloat(metaData[maxCountMetadataKey]);
        locMaxUmiThreshold = locMaxUmiThreshold>0?locMaxUmiThreshold:0.1;
        setMaxUmiThreshold(locMaxUmiThreshold);

        if (urlUmiUpperThreshold !==null){ // use URL params if provided
          setUmiUpperThreshold(urlUmiUpperThreshold);
          setUrlUmiUpperThreshold(null);
        }else{
          setUmiUpperThreshold(locMaxUmiThreshold);
        }
        if (urlUmiLowerThreshold !== null){ // use URL params if provided
          setUmiLowerThreshold(urlUmiLowerThreshold);
          setUrlUmiLowerThreshold(null);
        }else{
          setUmiLowerThreshold(0.01);
        }

        console.log('locMaxUmiThreshold', locMaxUmiThreshold, 'chosenGene', chosenGene);


        // create unifiedData
        let readData = null;

        // if unifiedData.length != coordsData.length, then gene2 data is stale due to pid change-> reload gene2 data for current puck
        if (chosenGene2.length>0 && (unifiedData.length !== coordsData.length)){ // gene2 data present but is stale
          // read gene2 data
          let geneDataUrl2 = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/gene_${chosenGene2[0]}.csv`
          const geneData2 = await load(geneDataUrl2, [CSVLoader]);

          // read metadata for gene2
          let metaDataUrl2 = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/metadata_gene_${chosenGene2[0]}.json`
          let metaData2 = await fetch(metaDataUrl2).then(response => response.json());
          let locMaxUmiThreshold2 = parseFloat(metaData2[maxCountMetadataKey]);
          locMaxUmiThreshold2 = locMaxUmiThreshold>0?locMaxUmiThreshold:0.1;

          // create unifiedData including gene2
          readData = coordsData.map((obj, index) => ({
            ...obj,
            ...geneData[index], 
            count2: geneData2[index],
            logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
            logcnt2: Math.log(geneData2[index].count + 1)/Math.log(locMaxUmiThreshold2+1),
          }));

        } else if(chosenGene2.length>0){ // if a comparison gene is also selected (and comparison gene data not stale due to NO pid change)
          readData = coordsData.map((obj, index) => ({
            ...obj,
            ...geneData[index], 
            count2: unifiedData[index].count2,
            logcnt1: Math.log(geneData[index].count + 1)/Math.log(locMaxUmiThreshold+1),
            logcnt2: unifiedData[index].logcnt2,
          }));
        }else{ // when no comparison gene is selected
        console.log('geneData', geneData);
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
        console.log('readData', readData);

        if (coordsData.length>1){ // to deal with extra inital pass causing progress bar value to overshoot 100%
          if (!geneOptions.includes(chosenGene2[0])){ // delay increment until gene2 is loaded
            setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1}));
            }
        }
      }
      fetchData();
    }else{
      console.log("chosen gene not included", chosenGene);
    }
      
  }, [chosenGene]);
  
  // loading new counts on new gene selection for chosenGene2
  useEffect(()=>{
    console.log('unidatalength', unifiedData.length, unifiedData);
    if(chosenPuckid.gene !== chosenGene[0]) // hacky way to prevent following code running when only unifiedData.length changes but not chosenGene2 - happens when changing puck - fixme todo
    if (unifiedData.length>1){
      if (geneOptions.includes(chosenGene2[0])){
        // create filename string using gene name and puckid

        // read gene data
        const fetchData = async () => {
          let gene2DataUrl = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/gene_${chosenGene2[0]}.csv`
          // let gene2DataUrl = await getUrl(gene2DataPath);
          const gene2Data = await load(gene2DataUrl, [CSVLoader]);

          // load metadata for gene2
          let metaDataUrl2 = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/metadata_gene_${chosenGene2[0]}.json`
          // let metaDataUrl2 = await getUrl(meta_data_path2);
          let metaData2 = await fetch(metaDataUrl2).then(response => response.json());
          let locMaxUmiThreshold2 = parseFloat(metaData2[maxCountMetadataKey]);
          locMaxUmiThreshold2 = locMaxUmiThreshold2>0?locMaxUmiThreshold2:0.1;
          setMaxUmiThreshold2(locMaxUmiThreshold2);

          if (urlUmiUpperThreshold2 !==null){ // use URL params if provided
            setUmiUpperThreshold2(urlUmiUpperThreshold2);
            setUrlUmiUpperThreshold2(null);
          }else{
            setUmiUpperThreshold2(locMaxUmiThreshold2);
          }
          if (urlUmiLowerThreshold2 !== null){ // use URL params if provided
            setUmiLowerThreshold2(urlUmiLowerThreshold2);
            setUrlUmiLowerThreshold2(null);
          }else{
            setUmiLowerThreshold2(0.01);
          }

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
          // setUnifiedDataTmp1(readData);
          setUnifiedData(readData);
          console.log('chosenGene2 included', readData);

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
        console.log("chosenGene2 not included", chosenGene2, 'unifiedData', unifiedData, geneOptions, readData);
        if (coordsData.length>1){ // to deal with extra inital pass causing progress bar value to overshoot 100%
          setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1}));
        }

      }
    }else{
          setDataLoadStatus((p)=>({...p, gene:p.gene-1, metadata:p.metadata-1})); // to deal with URL param case wwhen both genes are required - hacky way to make space in progress bar for second gene data/make sure final state is not 100% without the second gene
    }

  }, [chosenGene2, unifiedData.length]); // adding unifiedData for URLParam case unifiedData is delayed (won't also lead to unnecessary loads)

  // loading new counts on new gene selection for chosenGene2 - only for cases when both gene and puck are not loaded at same time - todo - remove redundant code
  useEffect( ()=>{ 
    if(chosenPuckid.gene === chosenGene[0]){
      if (unifiedData.length>1){
      if (geneOptions.includes(chosenGene2[0])){
        // create filename string using gene name and puckid

        // read gene data
        const fetchData = async () => {
          let gene2DataUrl = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/gene_${chosenGene2[0]}.csv`
          // let gene2DataUrl = await getUrl(gene2DataPath);
          const gene2Data = await load(gene2DataUrl, [CSVLoader]);

          // load metadata for gene2
          let metaDataUrl2 = `${basePath}${dpathGeneExprs}/puck${chosenPuckid.pid}/metadata_gene_${chosenGene2[0]}.json`
          // let metaDataUrl2 = await getUrl(meta_data_path2);
          let metaData2 = await fetch(metaDataUrl2).then(response => response.json());
          let locMaxUmiThreshold2 = parseFloat(metaData2[maxCountMetadataKey]);
          locMaxUmiThreshold2 = locMaxUmiThreshold2>0?locMaxUmiThreshold2:0.1;
          setMaxUmiThreshold2(locMaxUmiThreshold2);

          // if (urlUmiUpperThreshold2 !==null){ // use URL params if provided
          //   setUmiUpperThreshold2(urlUmiUpperThreshold2);
          //   setUrlUmiUpperThreshold2(null);
          // }else{
          //   setUmiUpperThreshold2(locMaxUmiThreshold2);
          // }
          // if (urlUmiLowerThreshold2 !== null){ // use URL params if provided
          //   setUmiLowerThreshold2(urlUmiLowerThreshold2);
          //   setUrlUmiLowerThreshold2(null);
          // }else{
          //   setUmiLowerThreshold2(0.01);
          // }

          if (viaURL===false){
            setUmiUpperThreshold2(locMaxUmiThreshold2);
            setUmiLowerThreshold2(0.01);
          }
          

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
          // setUnifiedDataTmp1(readData);
          setUnifiedData(readData);
          console.log('chosenGene2 included', chosenGene2, readData.length, unifiedData.length, urlUmiUpperThreshold2, urlUmiLowerThreshold2);
          
          setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1}));
        }
        fetchData();
        setViaURL(false);
      }else{

        // create unifiedData
        let readData = unifiedData.map((obj, index) => ({
          ...obj,
          count2:0,
          logcnt2: 1, 
        }));

        // update state of unifiedData

        setUnifiedData(readData);
        console.log("chosenGene2 not included", chosenGene2, 'unifiedData', unifiedData, geneOptions);
        // if (coordsData.length>1){ // to deal with extra inital pass causing progress bar value to overshoot 100%
        //   console.log('notinc')
        //   setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1}));
        // }

      }
     } 
    }
    

  }, [chosenGene2, unifiedData.length]);

  // update loader after second gene removed
  useEffect(()  => {
    if (!geneOptions.includes(chosenGene2[0])&&unifiedData.length>1){
          setDataLoadStatus((p)=>({...p, gene:p.gene+1, metadata:p.metadata+1}));
      console.log('gene removeds')
      }

  }, [chosenGene2]);


  // // recreate unifiedData on change of umiUpperThreshold or umiLowerThreshold for matching the colormap to active range
  // useEffect(()=>{

  //   if (chosenGene2.length>0){
  //     let readData = unifiedData.map((obj, index) => ({
  //       ...obj,
  //       logcnt1: Math.log(unifiedData[index].count + 1 - umiLowerThreshold)/Math.log(umiUpperThreshold+1)
  //     }));
  //     setUnifiedData(readData);
  //   console.log("set1 ", readData, unifiedData, chosenGene2)
  //   }    

  // }, [umiLowerThreshold, umiUpperThreshold]);

  // // recreate unifiedData on change of umiUpperThreshold2 or umiLowerThreshold2 for matching the colormap to active range
  // useEffect(()=>{
  //   if (chosenGene2.length>0 && unifiedDataTmp1.length>1){ // testing unifiedDataTmp1.length>1 to avoid extra pass that caused progress bar overshoot on first time addition of second gene
  //     let readData = unifiedDataTmp1.map((obj, index) => ({
  //       ...obj,
  //       logcnt2: Math.log(unifiedDataTmp1[index].count2 +1 - umiLowerThreshold2)/Math.log(umiUpperThreshold2+1)
  //     }));
  //     setUnifiedData(readData);
  //     console.log("set2 ", readData, unifiedDataTmp1);
  //   }  

  // }, [umiLowerThreshold2, umiUpperThreshold2, unifiedDataTmp1]);


  // loading frequency bar plot data on change of chosenGene
  useEffect(()=>{
    

    const fetchData = async () => {
      // let fbars_data_path = `${freqBarsDataPath}/${chosenGene}.json`
      // let fbarsDataUrl = await getUrl(fbars_data_path);
      let fbarsDataUrl = `${basePath}${dpathFreqBarsJsons}/${chosenGene[0]}.json`
      console.log('fbarsDataUrl', fbarsDataUrl);
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
    if (x===chosenPuckid.pid){
      alert("Already showing requested puck: srno "+parseInt(pidToSrno[chosenPuckid.pid]));
    }else{
      setDataLoadStatus((p)=>({gene:0, puck:0, metadata:0}));setChosenPuckid({...chosenPuckid, pid:x});};
  }
  
  // let regEnrichZarrPath = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/`;

  const updateChosenItem = (newItem, newPid) => {
    console.log('chosenGene ', newItem, ' pid ', newPid);
    setDataLoadStatus({gene:0, puck:0, metadata:0});
    setChosenPuckid({pid:newPid, gene:newItem, cell:chosenPuckid.cell}); 
    carouselRef.current.goToSlide(parseInt(pidToSrno[newPid]-1));
  }

  return(
    <div>
      <Breadcrumbs/>
      {/* <h4>{title}</h4> */}
      <Row>
        <Col xs="2">
          Select Puck
            &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.common.selpuck}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
        </Col>
          <Col xs="10">
            <BcdCarousel setPuckidAndLoadStatus={setPuckidAndLoadStatus} chosenPuckid={chosenPuckid.pid}></BcdCarousel>
          </Col>
        </Row>
      <Form>
        <FormGroup as={Row} className="mt-4">
          <Form.Label column sm="3">Select Gene(s)
                &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.ge.selectgene}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
          </Form.Label>
          <Col xs="2">
            <Typeahead
              id="basic-typeahead-single"
              labelKey="name"
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, gene:0, metadata:0}));setChosenGene(x); setChosenPuckid({...chosenPuckid, gene:x[0]});}}
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
            for Puck ID:<span style={{fontWeight:"bold"}}>{pidToSrno[chosenPuckid.pid]}</span>
            &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.common.pid}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
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
            UMI Count Threshold(s)
                &nbsp;
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.ge.umithresh}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
          </Form.Label>
          <Col xs="1">
            <DualSlider maxThreshold={maxUmiThreshold}
                        upperThreshold={umiUpperThreshold}
                        lowerThreshold={umiLowerThreshold}
                        setUmiLowerThreshold={setUmiLowerThreshold} 
                        setUmiUpperThreshold={setUmiUpperThreshold}>
            </DualSlider>
          </Col>
          <Col xs="1">
            Max: {Math.round(maxUmiThreshold* 1000) / 1000}
          </Col>
          {chosenGene2.length>0?<>
          <Col xs="1">
            <DualSlider maxThreshold={maxUmiThreshold2}
                        upperThreshold={umiUpperThreshold2}
                        lowerThreshold={umiLowerThreshold2}
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
              onChange={(checked)=>{if (checked){setFbarActiveDataName('regionwise_cnts')}else{setFbarActiveDataName('sorted_puckwise_cnts')}}}/>&nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.ge.toggle}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
          </Col>
          <Col xs="4" className="d-flex flex-row">
            <FrequencyBars
            setPuckidAndLoadStatus={setPuckidAndLoadStatus}
            data={fbarsData}
            fbarActiveDataName={fbarActiveDataName}
            curSrno={parseInt(pidToSrno[chosenPuckid.pid])}
            />
            &nbsp;
            <div className="justify-content-center">
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">{fbarActiveDataName==="sorted_puckwise_cnts"?ttText.ge.freqbar_p:ttText.ge.freqbar_r}</Tooltip>}>
              <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
            </OverlayTrigger>
            </div>
          </Col>
        </FormGroup>
        <FormGroup as={Row}>
          <Col xs="4"className="d-flex flex-row">
            {chosenGene2.length>0?<ColorSquare/>:<Colorbar max={maxUmiThreshold} cells={15} setCurrentColorMap={setCurrentColorMap}/>}
            &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.ge.colormap}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>

          </Col>
          <Form.Label column sm="1">
            Opacity
            &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.ge.opacity}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
          </Form.Label>
          <Col xs="1">
            <RangeSlider
              value={opacityVal}
              onChange={e => setOpacityVal(e.target.value)}
              min={0}
              max={1}
              step={0.01}
            />
          </Col>
          <Col xs="1" className="d-flex flex-row">
            <Form.Check 
              // defaultChecked={wireframeStatus}
              checked={nisslStatus}
            type={'checkbox'}
            id={`nis-checkbox`}
            label={`Nissl`}
            onChange={e => setNisslStatus(e.target.checked)}
          />
            &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.common.nissl}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
          </Col>
          <Col xs="2" className="d-flex flex-row">
            <Form.Check 
              // defaultChecked={wireframeStatus}
              checked={wireframeStatus}
            type={'checkbox'}
            id={`wf-checkbox`}
            label={`Wireframe`}
            onChange={e => setWireframeStatus(e.target.checked)}
          />
            &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.common.wireframe}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
          </Col>
        </FormGroup>
      </Form>
      <div className="add-border floater" >
        {curNisslUrl !=='' && curAtlasUrl !==''?
        <Scatterplot id={'left_splot'} 
          unidata={unifiedData} 
          lowerThreshold={umiLowerThreshold} upperThreshold={umiUpperThreshold} maxThreshold={maxUmiThreshold}
          lowerThreshold2={umiLowerThreshold2} upperThreshold2={umiUpperThreshold2} maxThreshold2={maxUmiThreshold2}
          opacityVal={opacityVal}
          viewState={viewState}
          onViewStateChange={onViewStateChange}
          curNisslUrl={curNisslUrl}
          curAtlasUrl={curAtlasUrl}
          chosenItem2={chosenGene2}
        />:null}
      </div>
      <div className="floater mt-2">
            &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.common.dendro}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
        <Dendrogram
          showDendrobar={false}
          divWidth="70%" divHeight="60%"
          sbarWidth={100} sbarHeight={100}
          mode="multiSelect"
        />
        <RegEnrich setDataLoadStatus={setDataLoadStatus}
                  regEnrichZarrPath={`${basePath}${regEnrichZarrPath}`}
                  updateChosenItem={updateChosenItem}
                  firstColHeader="Gene"
                  nameInfoFilePath={`${basePath}${nameInfoFilePath}`}
                  helptip={<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.ge.regenrich}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
}
                  
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



