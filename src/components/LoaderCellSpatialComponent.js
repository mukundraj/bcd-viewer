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
import {fetchJson} from '../shared/common'
// import ReactGA from "react-ga4";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../css/Tooltip.css'
import {TOOLTEXTS as ttText} from '../shared/tooltipTexts'

function LoaderCellSpatial({dataConfig}){

  const {basePath, dpathCellScores, dpathFreqBarsJsons, regEnrichZarrPath, nameInfoFilePath} = dataConfig;
  const carouselRef = useStore(state => state.carouselRef);
  const generalToggleFlag = useStore(state => state.generalToggleFlag);
  const togglePid = useStore(state => state.togglePid);
  const [initialRender, setInitialRender] = useState(true);
  
  const setCurrentColorMap = useStore(state => state.setCurrentColorMap);


  const maxScoreThreshold = useCSComponentStore(state => state.maxScoreThreshold);
  const setMaxScoreThreshold = useCSComponentStore(state => state.setMaxScoreThreshold)
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

  const scoreLowerThreshold = useCSCPersistStore(state => state.scoreLowerThreshold);
  const setScoreLowerThreshold = useCSCPersistStore(state => state.setScoreLowerThreshold);
  const scoreUpperThreshold = useCSCPersistStore(state => state.scoreUpperThreshold);
  const setScoreUpperThreshold = useCSCPersistStore(state => state.setScoreUpperThreshold);
  const scoreLowerThreshold2 = useCSCPersistStore(state => state.scoreLowerThreshold2);
  const setScoreLowerThreshold2 = useCSCPersistStore(state => state.setScoreLowerThreshold2);
  const scoreUpperThreshold2 = useCSCPersistStore(state => state.scoreUpperThreshold2);
  const setScoreUpperThreshold2 = useCSCPersistStore(state => state.setScoreUpperThreshold2);

  const urlScoreLowerThreshold = useCSComponentStore(state => state.urlScoreLowerThreshold);
  const setUrlScoreLowerThreshold = useCSComponentStore(state => state.setUrlScoreLowerThreshold);
  const urlScoreUpperThreshold = useCSComponentStore(state => state.urlScoreUpperThreshold);
  const setUrlScoreUpperThreshold = useCSComponentStore(state => state.setUrlScoreUpperThreshold);
  const urlScoreLowerThreshold2 = useCSComponentStore(state => state.urlScoreLowerThreshold2);
  const setUrlScoreLowerThreshold2 = useCSComponentStore(state => state.setUrlScoreLowerThreshold2);
  const urlScoreUpperThreshold2 = useCSComponentStore(state => state.urlScoreUpperThreshold2);
  const setUrlScoreUpperThreshold2 = useCSComponentStore(state => state.setUrlScoreUpperThreshold2);

  const opacityVal = useCSComponentStore(state => state.opacityVal);
  const setOpacityVal = useCSComponentStore(state => state.setOpacityVal);
  
  const wireframeStatus = useStore(state => state.wireframeStatus);
  const setWireframeStatus = useStore(state => state.setWireframeStatus);
  const nisslStatus = useStore(state => state.nisslStatus);
  const setNisslStatus = useStore(state => state.setNisslStatus);

  const chosenCluster = useCSCPersistStore(state => state.chosenCluster);
  const setChosenCluster = useCSCPersistStore(state => state.setChosenCluster);
  const chosenCell2 = useCSComponentStore(state => state.chosenCell2);
  const setChosenCell2 = useCSComponentStore(state => state.setChosenCell2);

  const chosenCell = useCSCPersistStore(state => state.chosenCell);
  const setChosenCell = useCSCPersistStore(state => state.setChosenCell);
  const chosenClade = useCSCPersistStore(state => state.chosenClade);
  const setChosenClade = useCSCPersistStore(state => state.setChosenClade);
  const chosenClass = useCSCPersistStore(state => state.chosenClass);
  const setChosenClass = useCSCPersistStore(state => state.setChosenClass);
  
  const cellOptions = useCSComponentStore(state => state.cellOptions);
  const setCellOptions = useCSComponentStore(state => state.setCellOptions);

  const cladeOptions = useCSComponentStore(state => state.cladeOptions);
  const setCladeOptions = useCSComponentStore(state => state.setCladeOptions);
  const cellclassOptions = useCSComponentStore(state => state.cellclassOptions);
  const setCellclassOptions = useCSComponentStore(state => state.setCellclassOptions);

  const [coordsData, setCoordsData] = useState([{"x":0, "y":0, "z":0, "count":0}]);
  const [curNisslUrl, setCurNisslUrl] = useState('');
  const [curAtlasUrl, setCurAtlasUrl] = useState('');

  const cellNameToIdx = useCSCPersistStore(state => state.cellNameToIdx);
  const setCellNameToIdx = useCSCPersistStore(state => state.setCellNameToIdx);

  const curPuckMaxScores = useCSComponentStore(state => state.curPuckMaxScores);
  const setCurPuckMaxScores = useCSComponentStore(state => state.setCurPuckMaxScores);

  const aggregateBy = useCSCPersistStore(state => state.aggregateBy);
  const setAggregateBy = useCSCPersistStore(state => state.setAggregateBy);

  const cladeNameToAnno = useCSComponentStore(state => state.cladeNameToAnno);
  const setCladeNameToAnno = useCSComponentStore(state => state.setCladeNameToAnno);
  const cladeDisplayOptions = useCSComponentStore(state => state.cladeDisplayOptions);
  const setCladeDisplayOptions = useCSComponentStore(state => state.setCladeDisplayOptions);

  const [cladeDisplayName, setCladeDisplayName] = useState([]);

  const location = useLocation();

  // useEffect(() => {

  //   console.log('location', location);

  //   window.history.replaceState({}, document.title); // https://stackoverflow.com/questions/40099431/how-do-i-clear-location-state-in-react-router-on-page-reload
  // },[location]);

  useEffect(() => {
    // ReactGA.send({ hitType: "pageview", page: "/cellspatial" });
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
      let cellOptionsUrl = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/cellOptions.json`
      // const cellOptions = await load(cellOptionsUrl, [CSVLoader], {csv:{delimiter:":"}});

      const [cellOptionsJson, cladeOptionsJson, cellclassOptionsJson] = await Promise.all([
        fetchJson(cellOptionsUrl),
        fetchJson(`${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/cladeOptions.json`),
        fetchJson(`${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/cellclassOptions.json`)
      ]);

      // create cladeDisplayOptions containing cladeOptionsJson.cladeOption:cladeOptionsJson.cladeAnnos
      let cladeDisplayOptionsTmp = [];
      cladeOptionsJson.cladeOptions.forEach((clade, idx)=>{
        cladeDisplayOptionsTmp.push(`${cladeOptionsJson.cladeAnnos[idx]}:${clade}`);
      });
      setCladeDisplayOptions(cladeDisplayOptionsTmp);

      // create cladeNameToAnno
      let cladeNameToAnnoTmp = {};
      cladeOptionsJson.cladeOptions.forEach((clade, idx)=>{
        cladeNameToAnnoTmp[clade] = cladeOptionsJson.cladeAnnos[idx];
      });
      setCladeNameToAnno(cladeNameToAnnoTmp);

      setCellOptions(cellOptionsJson.cellOptions);
      setCladeOptions(cladeOptionsJson.cladeOptions);
      setCellclassOptions(cellclassOptionsJson.cellclassOptions);

      let cellNameToIdx = {};
      cellOptionsJson.cellOptions.forEach((cell, idx)=>{
        cellNameToIdx[cell] = idx;
      });
      const numCells = cellOptionsJson.cellOptions.length; // add one to account for '-' removed in cladeOptions in analysis_cs/s1c_beadxcell_zarr.py
      cladeOptionsJson.cladeOptions.forEach((clade, idx)=>{
        cellNameToIdx[clade] = idx+numCells;
      });
      const numClades = cladeOptionsJson.cladeOptions.length; 
      cellclassOptionsJson.cellclassOptions.forEach((cellclass, idx)=>{
        cellNameToIdx[cellclass] = idx+numCells+numClades;
      }
      );  


      setCellNameToIdx(cellNameToIdx);
      
      // fetch(cellOptionsUrl
      // // ,{
      // //   headers : { 
      // //     'Content-Type': 'application/json',
      // //     'Accept': 'application/json'
      // //    }
      // // }
      // )
      //   .then(function(response){
      //     // console.log(response)
      //     return response.json();
      //   })
      //   .then(function(myJson) {
      //     // console.log(myJson.cellOptions, dataLoadStatus);
      //     // setData(myJson)
      //     setCellOptions(myJson.cellOptions);

      //     // console.log("cellOptions", myJson.cellOptions);

      //     // create cellNameToIdx
      //     let cellNameToIdx = {};
      //     myJson.cellOptions.forEach((cell, idx)=>{
      //       cellNameToIdx[cell] = idx;
      //     }
      //     );
      //     // setCellNameToIdx(()=>cellNameToIdx);
      //     setCellNameToIdx(cellNameToIdx);
      //   });
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
      let coordsUrl = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/coords.csv`
      // const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});
      const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});

      setCoordsData(readData);
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }

    const fetchNissl = async () => {
      let nis_url = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/nis_${pad(chosenPuckid.pid, 3)}.png`
      console.log("nis_url: ", nis_url);

      setCurNisslUrl(nis_url);
      // setDataLoadStatus((p)=>{ console.log(p.dataLoadStatus); return (p.dataLoadStatus+1)});
      setDataLoadStatus((p)=>({...p, puck:p.puck+1}));
    }

    const fetchAtlas = async () => {
      let atlas_url = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/chuck_sp_wireframe_${pad(chosenPuckid.pid, 3)}.png`;

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
      let zarrPathInBucket = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/`;
      let zloader = new ZarrLoader({zarrPathInBucket});
      let rowIdx = cellNameToIdx[chosenCluster[0]];
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

      let zarrPathInBucket = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/`;
      let zloader = new ZarrLoader({zarrPathInBucket});
      // let rowIdx = cellNameToIdx[chosenCluster[0]];
      // console.log("zarrPathInBucket ", zarrPathInBucket, 'chosenPuckid', chosenPuckid, 'rowIdx', rowIdx, cellNameToIdx);

      let rowIdx = cellNameToIdx[chosenCluster[0]];
      let readData = null;
      if (rowIdx !== undefined){ // guard for case of URL based load having delayed cellNameToIdx loading, default non URL based loading doesn't have to wait
        if (chosenCell2.length > 0){ // fetch and update both cellData1 and cellData2

          // let locMaxScores = await zloader.getDataRow("cellxbead.zarr/maxScores/X", 0);
          // setCurPuckMaxScores(locMaxScores);

          let locMaxScoreThreshold = parseFloat(curPuckMaxScores[rowIdx]);
          locMaxScoreThreshold = locMaxScoreThreshold>0 ? locMaxScoreThreshold : 0.0011;
          setMaxScoreThreshold(locMaxScoreThreshold);
          if (urlScoreUpperThreshold !== null){ // if URL has scoreUpperThreshold, use that instead
            setScoreUpperThreshold(urlScoreUpperThreshold);
            setUrlScoreUpperThreshold(null);
          }else{
            setScoreUpperThreshold(locMaxScoreThreshold); // use maxScoreThreshold as default
          }
          if (urlScoreLowerThreshold !== null){ // if URL has scoreLowerThreshold, use that
            setScoreLowerThreshold(urlScoreLowerThreshold);
            setUrlScoreLowerThreshold(null);
          }
          // console.log("locMaxScoreThreshold", locMaxScoreThreshold, rowIdx, locMaxScores.indexOf(Math.max(...locMaxScores)));
          let rowIdx2 = cellNameToIdx[chosenCell2[0]];
          if (rowIdx2 !== undefined){ // guard for case of URL based load having delayed cellNameToIdx loading, default non URL based loading doesn't have to wait
            let locMaxScoreThreshold2 = parseFloat(curPuckMaxScores[rowIdx2]);
            locMaxScoreThreshold2 = locMaxScoreThreshold2>0 ? locMaxScoreThreshold2 : 0.0011;
            setMaxScoreThreshold2(locMaxScoreThreshold2);

            if (urlScoreUpperThreshold2 !== null){ // if URL has scoreUpperThreshold, use that instead)
              setScoreUpperThreshold2(urlScoreUpperThreshold2);
              setUrlScoreUpperThreshold2(null);
            }else{
              setScoreUpperThreshold2(locMaxScoreThreshold2); // use maxScoreThreshold as default
            }
            if (urlScoreLowerThreshold2 !== null){ // if URL has scoreLowerThreshold, use that
              setScoreLowerThreshold2(urlScoreLowerThreshold2);
              setUrlScoreLowerThreshold2(null);
            }

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

          }

        }else{ // just fetch and update cellData1

          const cellData = await zloader.getDataRow("cellxbead.zarr/X", rowIdx); 

          // let locMaxScores = await zloader.getDataRow("cellxbead.zarr/maxScores/X", 0);
          // setCurPuckMaxScores(locMaxScores);

          let locMaxScoreThreshold = parseFloat(curPuckMaxScores[rowIdx]);
          locMaxScoreThreshold = locMaxScoreThreshold>0 ? locMaxScoreThreshold : 0.0011;
          // console.log("locMaxScoreThreshold", locMaxScoreThreshold, rowIdx, locMaxScores.indexOf(Math.max(...locMaxScores)));
          setMaxScoreThreshold(locMaxScoreThreshold);
          console.log("urlScoreUpperThreshold ", urlScoreUpperThreshold, scoreUpperThreshold,coordsData.length);
          if (urlScoreUpperThreshold !== null){ // if URL has scoreUpperThreshold, use that instead
            setScoreUpperThreshold(urlScoreUpperThreshold);
            setUrlScoreUpperThreshold(null);
          }else{
            setScoreUpperThreshold(locMaxScoreThreshold); // use maxScoreThreshold as default
          }
          if (urlScoreLowerThreshold !== null){ // if URL has scoreLowerThreshold, use that
            setScoreLowerThreshold(urlScoreLowerThreshold);
            setUrlScoreLowerThreshold(null);
          }
          console.log("scoreLowerThreshold", scoreLowerThreshold);

          readData = coordsData.map((obj, index) => ({
            ...obj,
            count:cellData[index], 
            count2: 0,
            logcnt1: Math.log(cellData[index] + 1)/Math.log(locMaxScoreThreshold+1),
            logcnt2: 1
          }));
        }       
      }

      setUnifiedData(readData);
      if (coordsData.length>1)
        setDataLoadStatus((p)=>({...p, cell:p.cell+1, metadata:p.metadata+1})); 
    }

    if (chosenPuckid.cell === chosenCluster[0]){
      if (coordsData.length>1){
        fetchData();
        }
    }else{
      setChosenCluster([chosenPuckid.cell]); // update cell to match the cell set by SincleCell tab
    }    

  // }, [coordsData]);
  }, [curPuckMaxScores]);


  // loading new counts on new cell selection
  useEffect(()=>{

    if (cellOptions.includes(chosenCluster[0]) || cladeOptions.includes(chosenCluster[0]) || cellclassOptions.includes(chosenCluster[0])){

      // read cell data
      const fetchData = async () => {

        let zarrPathInBucket = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/`;
        let zloader = new ZarrLoader({zarrPathInBucket});
        let rowIdx = cellNameToIdx[chosenCluster[0]];
        console.log('rowIdx', rowIdx, 'cellNameToIdx', cellNameToIdx, 'chosenCluster', chosenCluster);
        const cellData = await zloader.getDataRow("cellxbead.zarr/X", rowIdx);

        let locMaxScoreThreshold = parseFloat(curPuckMaxScores[rowIdx]);
        locMaxScoreThreshold = locMaxScoreThreshold>0 ? locMaxScoreThreshold : 0.0011;
        console.log("locMaxScoreThreshold", locMaxScoreThreshold);
        setMaxScoreThreshold(locMaxScoreThreshold);
        setScoreUpperThreshold(locMaxScoreThreshold);
        setScoreLowerThreshold(0.3);

        // create unifiedData
        let readData = null;
        if (chosenCell2.length>0 && unifiedData.length!==coordsData.length){ // cell2 data is present but stale, need to be reloaded

          // read cell2 data
          let rowIdx2 = cellNameToIdx[chosenCell2[0]];
          const cellData2 = await zloader.getDataRow("cellxbead.zarr/X", rowIdx2);

          // read metadata for cell2
        let locMaxScoreThreshold2 = parseFloat(curPuckMaxScores[rowIdx2]);
        locMaxScoreThreshold2 = locMaxScoreThreshold2>0 ? locMaxScoreThreshold2 : 0.0011;

          // create unified data including cell2 data
          readData = coordsData.map((obj, index) => ({
            ...obj,
            count:  cellData[index], 
            count2: cellData2[index],
            logcnt1: Math.log(cellData[index] + 1)/Math.log(locMaxScoreThreshold+1),
            logcnt2: Math.log(cellData2[index] + 1)/Math.log(locMaxScoreThreshold2+1),
          }));


        }
        else if(chosenCell2.length>0){ // if a comparison cell is also selected
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

      // check if cellNameToIdx has more than 1 entry, if not, then halt
      // (data will be populated via initial load path after cellNameToIdx is populated)
      // useful check when jumping from single cell tab
      if (Object.keys(cellNameToIdx).length>1){
        fetchData();
      }

    }else{
      console.log("chosen cell not included", chosenCluster);
    }
      
  }, [chosenCluster]);


  // loading new scores on chosenCell2 selection
  useEffect(()=>{

    console.log('here');
    if (unifiedData.length>1)
    if (cellOptions.includes(chosenCell2[0])){

      // read cell data
      const fetchData = async () => {

        let zarrPathInBucket = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/`;
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

  // // recreate unifiedData on change of upperThreshold or lowerThreshold for matching the colormap to active range
  // useEffect(()=>{

  //   if (chosenCell2.length>0){
  //     let readData = unifiedData.map((obj, index) => ({
  //       ...obj,
  //       logcnt1: Math.log(unifiedData[index].count + 1 - scoreLowerThreshold)/Math.log(scoreUpperThreshold+1)
  //     }));
  //     setUnifiedData(readData);
  //   }    

  // }, [scoreLowerThreshold, scoreUpperThreshold]);

  // // recreate unifiedData on change of upperThreshold2 or lowerThreshold2 for matching the colormap to active range
  // useEffect(()=>{
  //   if (chosenCell2.length>0){
  //     let readData = unifiedData.map((obj, index) => ({
  //       ...obj,
  //       logcnt2: Math.log(unifiedData[index].count2 +1 - scoreLowerThreshold2)/Math.log(scoreUpperThreshold2+1)
  //     }));
  //     setUnifiedData(readData);
  //     console.log("set2 ", readData);
  //   }  

  // }, [scoreLowerThreshold2, scoreUpperThreshold2]);

  // loading frequency bar plot data on change of chosenCluster
  useEffect(()=>{
    
    const fetchData = async () => {
      let fbarsDataUrl = `${basePath}${dpathFreqBarsJsons}/${chosenPuckid.cell}.json`
      // let fbarsDataUrl = `${basePath}${dpathFreqBarsJsons}/Inh_Frmd7_Lamp5.json`
      const readData = await fetch(fbarsDataUrl)
       .then(response => response.json());
        // .then(data_str => JSON.parse(data_str));
      // console.log(readData);
      setFbarsData(readData);
    }
    fetchData();

  },[chosenPuckid.cell]);

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
    
    setChosenCell(cell);
  }
  useEffect(() => {

    if (aggregateBy==='none' && chosenPuckid.jumpFromSC!==true){
      if (chosenCell.length>0 && chosenCell[0]!==chosenPuckid.cell){ // check chosenCell condition to preven dataLoadStatus overshoot on jump from RegEnrich
        setChosenPuckid({...chosenPuckid, cell:chosenCell[0]}); // update celltype in chosenPuckid as well to prevent reset of celltype in useEffect hook
        setChosenCluster(chosenCell);
      }
    }

  }, [chosenCell])

  const handleCladeChange = (displayName) => {

    console.log('clade', displayName);
    if (displayName.length>0){

    // retrive cladeName from cladeDisplayName
      let cladeName = displayName[0].split(':')[1];
      // console.log('clade displayName', displayName, 'cladeName', cladeName);
      setChosenClade([cladeName]);
      // setCladeDisplayName(displayName);
      }
    else{
      setCladeDisplayName(displayName);
    }

  }
  useEffect(()=>{

      if (aggregateBy==='metacluster' && chosenPuckid.jumpFromSC!==true){
        if (chosenClade.length>0){
          setChosenPuckid({...chosenPuckid, cell:chosenClade[0]}); // update celltype in chosenPuckid as well to prevent reset of celltype in useEffect hook
        }
        setChosenCluster(chosenClade);
      }
    

  }, [chosenClade]);

  const handleCellclassChange = (cellclass) => {
    setChosenClass(cellclass);
  }

  useEffect(()=>{
    if (aggregateBy==='cellclass'){
      if (chosenClass.length>0 && chosenPuckid.jumpFromSC!==true){
        setChosenPuckid({...chosenPuckid, cell:chosenClass[0]}); // update celltype in chosenPuckid as well to prevent reset of celltype in useEffect hook
      }
      setChosenCluster(chosenClass);

    }

  }, [chosenClass]);


  // handling jump from single cell tab
  useEffect(()=>{

    if (chosenPuckid.jumpFromSC===true){
      if (aggregateBy==='none'){
        setChosenCell([chosenPuckid.cell]);
      }else if (aggregateBy==='metacluster'){
        setChosenClade([chosenPuckid.cell]);
      }else if (aggregateBy==='cellclass'){
        setChosenClass([chosenPuckid.cell]);
      }
      console.log('jumpFromSC ', chosenPuckid.jumpFromSC, 'chosenPuckid.cell ', chosenPuckid.cell);
      setChosenPuckid({...chosenPuckid, jumpFromSC:false});
    }else if (chosenPuckid.jumpFromRE===true){
      console.log('jumpFromSC ', chosenPuckid.jumpFromRE, 'chosenPuckid.cell ', chosenPuckid.cell);
      setChosenPuckid({...chosenPuckid, jumpFromRE:false});
      setChosenCell([chosenPuckid.cell]);
    }

  } , [chosenPuckid]);

  // let regEnrichZarrPath = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/s2d_region_enrich/`;

  const updateChosenItem = (newItem, newPid) => {
    console.log('chosenClustertype ', newItem, ' pid ', newPid);
    setDataLoadStatus({cell:0, puck:0, metadata:0});
    setChosenPuckid({pid:newPid, cell:newItem, gene:chosenPuckid.gene, jumpFromRE:true});
    carouselRef.current.goToSlide(parseInt(pidToSrno[newPid]-1));
  }

  const handleAggregateByChange = async (e) => {
    const newAggregateBy = e.target.value;
    setAggregateBy(newAggregateBy);
    if (newAggregateBy==='metacluster' && cladeOptions.length===1){
      let cladeOptionsUrl = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/cladeOptions.json`
      const cladeOptionsJson = await fetchJson(cladeOptionsUrl);
      // console.log('cladeOptions', cladeOptionsJson);
      setCladeOptions(cladeOptionsJson.cladeOptions);

      // create cladeDisplayOptions containing cladeOptionsJson.cladeOption:cladeOptionsJson.cladeAnnos
      let cladeDisplayOptionsTmp = [];
      cladeOptionsJson.cladeOptions.forEach((clade, idx)=>{
        cladeDisplayOptionsTmp.push(`${cladeOptionsJson.cladeAnnos[idx]}:${clade}`);
      });
      setCladeDisplayOptions(cladeDisplayOptionsTmp);

      // create cladeNameToAnno
      let cladeNameToAnnoTmp = {};
      cladeOptionsJson.cladeOptions.forEach((clade, idx)=>{
        cladeNameToAnnoTmp[clade] = cladeOptionsJson.cladeAnnos[idx];
      });
      setCladeNameToAnno(cladeNameToAnnoTmp);

    }else if (newAggregateBy==='cellclass' && cellclassOptions.length===1){
      let cellclassOptionsUrl = `${basePath}${dpathCellScores}/puck${chosenPuckid.pid}/cellclassOptions.json`
      const cellclassOptionsJson = await fetchJson(cellclassOptionsUrl);
      // console.log('cellclassOptions', cellclassOptionsJson);
      setCellclassOptions(cellclassOptionsJson.cellclassOptions);

    }else if (newAggregateBy==='none' && cellOptions.length===1){
      // already loaded earlier so no need to fetch cellOptions again
    }

  }

  // on aggregateBy change, ensure that chosenCluster also changes
  useEffect(()=>{

    if (chosenPuckid.jumpFromSC!==true){
      if (aggregateBy==='metacluster'){
        const curClade = [chosenClade[0]];
        setDataLoadStatus((p)=>({...p, cell:0, metadata:0}));
        setChosenCluster(curClade);
        setChosenPuckid({...chosenPuckid, cell:curClade[0]}); 
      }else if (aggregateBy==='cellclass'){
        const curClass = [chosenClass[0]];
        setDataLoadStatus((p)=>({...p, cell:0, metadata:0}));
        setChosenCluster(curClass);
        setChosenPuckid({...chosenPuckid, cell:curClass[0]});
      }else if (aggregateBy==='none'){
        const curCell = [chosenCell[0]];
        setDataLoadStatus((p)=>({...p, cell:0, metadata:0}));
        setChosenCluster(curCell);
        setChosenPuckid({...chosenPuckid, cell:curCell[0]});

      }
    }

  }, [aggregateBy]);


  useEffect(() => {
    
    // get display name using cladeNameToAnno

    const cladeDispName = [`${cladeNameToAnno[chosenClade[0]]}:${chosenClade[0]}`]
    // console.log('cladeDispName', cladeDispName, cladeNameToAnno, cladeDisplayOptions);

     setCladeDisplayName(cladeDispName);

  }, [chosenClade, cladeNameToAnno]);

  return(
    <div>
      <Breadcrumbs/>
      <Row>
        <Col xs="2">
          Select Puck &nbsp;
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.common.selpuck}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
        </Col>
        <Col xs="10">
          <BcdCarousel setPuckidAndLoadStatus={setPuckidAndLoadStatus} chosenPuckid={chosenPuckid.pid}></BcdCarousel>
        </Col>
      </Row>
      <Form>
        <FormGroup as={Row} className="mt-4">
          <Col xs="3" className="d-flex">
            <Form.Label>Select&nbsp;:&nbsp;</Form.Label>
            <Form.Select defaultValue={aggregateBy} onChange={handleAggregateByChange}>
              <option value="none">Celltype</option>
              <option value="metacluster" >Metacluster</option>
              <option value="cellclass" >Cell Class</option>
            </Form.Select>
          </Col>
            {aggregateBy==='none'?
            <Col xs="2">
            <Typeahead
              id="typeahead-cell"
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
            :aggregateBy==='metacluster'?
            <Col xs="4">
            <Typeahead
              id="typeahead-clades"
              labelKey="name"
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, cell:0, metadata:0}));handleCladeChange(x);}}
              options={cladeDisplayOptions}
              placeholder="Choose a metacluster..."
              // defaultInputValue={cell[0]}
              selected={cladeDisplayName}
              filterBy={(option, props) => {
                /* Own filtering code goes here. */
                return (option.toLowerCase().indexOf(props.text.toLowerCase()) === 0)
              }} 
            />
            </Col>
              :aggregateBy==='cellclass'?
            <Col xs="4">
            <Typeahead
              id="typeahead-cellclass"
              labelKey="name"
              onChange={(x)=>{setDataLoadStatus((p)=>({...p, cell:0, metadata:0}));handleCellclassChange(x);}}
              options={cellclassOptions}
              placeholder="Choose a cell class..."
              // defaultInputValue={cell[0]}
              selected={chosenClass}
              filterBy={(option, props) => {
                /* Own filtering code goes here. */
                return (option.toLowerCase().indexOf(props.text.toLowerCase()) === 0)
              }} 
            />
            </Col>:null
            }
            {aggregateBy==='none'?
          <Col xs="2">
            <Typeahead
              id="typeahead-cell2"
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
            :null}
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
            Score Threshold
          </Form.Label>
          <Col xs="1">
            <DualSlider maxThreshold={maxScoreThreshold}
                        upperThreshold={scoreUpperThreshold}
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
            <DualSlider maxThreshold={maxScoreThreshold2}
                        upperThreshold={scoreUpperThreshold2}
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
          <Col xs="4" className="align-items-center">
            {chosenCell2.length>0?<ColorSquare/>:<Colorbar max={maxScoreThreshold} cells={15} setCurrentColorMap={setCurrentColorMap}/>}
          </Col>
          <Form.Label column sm="1">
            Opacity proportion
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
              defaultChecked={nisslStatus}
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
              defaultChecked={wireframeStatus}
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
        {curNisslUrl!=='' && curAtlasUrl!==''?
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
        />:null}
      </div>
      <div className="floater">
            &nbsp;<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-top">{ttText.common.dendro}</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                </OverlayTrigger>
        <Dendrogram
          showDendrobar={false}
          divWidth="70%" divHeight="60%"
          sbarWidth={100} sbarHeight={100}
          mode="multiSelect"
        />
        {aggregateBy==='none'?
        <RegEnrich setDataLoadStatus={setDataLoadStatus}
                   regEnrichZarrPath={`${basePath}${regEnrichZarrPath}`}
                  updateChosenItem={updateChosenItem}
                  firstColHeader="Celltype"
                  nameInfoFilePath={`${basePath}${nameInfoFilePath}`}
        />:null}
      </div>
    </div>
  );
}

export default LoaderCellSpatial;   
