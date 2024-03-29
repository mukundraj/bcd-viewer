// create a new functional component

import { useSearchParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {srnoToPid} from "../shared/common"
import {useStore, usePersistStore} from '../store/store'
import GEComponentStore, {useGEComponentStore} from '../store/GEComponentStore'
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import {getPaths, markDendroDataNode} from "../shared/utils"
import {getUrl} from "../shared/common"
import {useSCComponentPersistStore} from '../store/SCComponentStore'
import {useCSComponentStore, useCSCPersistStore} from '../store/CSComponentStore'



const UrlGuardAndRedirect = ({dataConfig}) => {

  const [urlParamStatus, setUrlParamStatus] = useState({status: false, path: null});
  const [searchParams, setSearchParams] = useSearchParams();

  
  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenGene = usePersistStore(state => state.setChosenGene);
  const setChosenGene2 = useStore(state => state.setChosenGene2);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);
  const setFbarActiveDataName = useStore(state => state.setFbarActiveDataName);
  const setNisslStatus = useStore(state => state.setNisslStatus);
  const setWireframeStatus = useStore(state => state.setWireframeStatus);
  const setOpacityVal = useGEComponentStore(state => state.setOpacityVal);
  const setUrlUmiLowerThreshold = useGEComponentStore(state => state.setUrlUmiLowerThreshold);
  const setUrlUmiUpperThreshold = useGEComponentStore(state => state.setUrlUmiUpperThreshold);

  const setUrlUmiLowerThreshold2 = useGEComponentStore(state => state.setUrlUmiLowerThreshold2);
  const setUrlUmiUpperThreshold2 = useGEComponentStore(state => state.setUrlUmiUpperThreshold2);
  const setViaURL = useStore(state => state.setViaURL);

  const setMaxUmiThreshold = useStore(state => state.setMaxUmiThreshold);
  const setMaxUmiThreshold2 = useStore(state => state.setMaxUmiThreshold2);

  const setSelectedRegions = usePersistStore(state => state.setSelectedRegions);
  const setSelectedRegIds = usePersistStore(state => state.setSelectedRegIds);

  const dendroData = usePersistStore(state => state.dendroData);
  const setDendroData = usePersistStore(state => state.setDendroData);
  const regionTreeNodePaths = usePersistStore(state => state.regionTreeNodePaths);

  const setMinFrac = useStore(state => state.setMinFrac);
  const setMaxFrac = useStore(state => state.setMaxFrac);

  const selectedRegIds = usePersistStore(state => state.selectedRegIds);

  const setOpacityValCSC = useCSComponentStore(state => state.setOpacityVal);
  const setInitialHiddenCols = useSCComponentPersistStore(state => state.setInitialHiddenCols);
  const setInitPageSize = useSCComponentPersistStore(state => state.setInitPageSize);

  const {basePath, dpathScZarr, dpathMappedCellTypesToIdx, dpathRegionToCelltype, dpathIdAcroNameMap} = dataConfig;


  // SC component related
  const multiSelections = useSCComponentPersistStore(state => state.multiSelections);
  const setMultiSelections = useSCComponentPersistStore(state => state.setMultiSelections);
  const setOrder = useSCComponentPersistStore(state => state.setOrder);
  const setSortField = useSCComponentPersistStore(state => state.setSortField);
  const setSortByToggleVal = useSCComponentPersistStore(state => state.setSortByToggleVal);
  const setMinCompoPct = useSCComponentPersistStore(state => state.setMinCompoPct);
  const setCellClassSelection = useSCComponentPersistStore(state => state.setCellClassSelection);
  const setAdaptNormalizerStatus = useSCComponentPersistStore(state => state.setAdaptNormalizerStatus);
  const setAggregateBy = useSCComponentPersistStore(state => state.setAggregateBy);

  // CS component related
  // const setScoreLowerThreshold = useCSCPersistStore(state => state.setScoreLowerThreshold);
  // const setScoreUpperThreshold = useCSCPersistStore(state => state.setScoreUpperThreshold);
  // const setScoreLowerThreshold2 = useCSCPersistStore(state => state.setScoreLowerThreshold2);
  // const setScoreUpperThreshold2 = useCSCPersistStore(state => state.setScoreUpperThreshold2);
  const setMaxScoreThreshold = useCSComponentStore(state => state.setMaxScoreThreshold);
  const setMaxScoreThreshold2 = useCSComponentStore(state => state.setMaxScoreThreshold2);
  const setChosenCell = useCSCPersistStore(state => state.setChosenCell);
  const setChosenCell2 = useCSComponentStore(state => state.setChosenCell2);

  const setUrlScoreLowerThreshold = useCSComponentStore(state => state.setUrlScoreLowerThreshold);
  const setUrlScoreUpperThreshold = useCSComponentStore(state => state.setUrlScoreUpperThreshold);
  const setUrlScoreLowerThreshold2 = useCSComponentStore(state => state.setUrlScoreLowerThreshold2);
  const setUrlScoreUpperThreshold2 = useCSComponentStore(state => state.setUrlScoreUpperThreshold2);
  const setAggregateByCS = useCSCPersistStore(state => state.setAggregateBy);
  const setChosenCluster = useCSCPersistStore(state => state.setChosenCluster);
  const setChosenClade = useCSCPersistStore(state => state.setChosenClade);
  const setChosenClass = useCSCPersistStore(state => state.setChosenClass);

  const [regidToNameMap, setRegidToNameMap] = useState(null);

    const fetchData = async () => {
      let acroIdNameMapFile = `${basePath}${dpathIdAcroNameMap}`;
      const acroIdNameMap = await load(acroIdNameMapFile, [CSVLoader], {csv:{delimiter:"\t"}});

      console.log('acroId', acroIdNameMap);
      let regidToNameMapTmp = {};
      acroIdNameMap.forEach(x=>regidToNameMapTmp[x.column1] = x.column3);
      setRegidToNameMap(regidToNameMapTmp);
    }



  const extractAndSetParams = (searchParams) => {

    let regidsTmp = searchParams.get('regids')?searchParams.get('regids').split(','):[];
    if (regidsTmp.length>0){
      regidsTmp = regidsTmp.map(x=>parseInt(x));
    }

    setViaURL(true);

    console.log('searchParams', searchParams.get('path'))
    // check if all needed params present and if so update state and return status true
    if (searchParams.get('path')==='genex'){
      let urlParams = {
        path: searchParams.get('path'),
        pid: srnoToPid[parseInt(searchParams.get('srno'))],
        gene: searchParams.get('gene'),
        thl: parseFloat(searchParams.get('thl')),
        thh: parseFloat(searchParams.get('thh')),
        gene2: searchParams.get('gene2'),
        thl2: parseFloat(searchParams.get('thl2')),
        thh2: parseFloat(searchParams.get('thh2')),
        fbd: searchParams.get('fbd'),
        nisslStatus: searchParams.get('nisslStatus')==='true',
        wireframeStatus: searchParams.get('wireframeStatus')==='true',
        opacity: parseFloat(searchParams.get('opacityVal')),
        mth1: parseFloat(searchParams.get('mth1')),
        mth2: parseFloat(searchParams.get('mth2')),
        regids: regidsTmp,
        minfrac: parseFloat(searchParams.get('minfrac')),
        maxfrac: parseFloat(searchParams.get('maxfrac')),
      }
      urlParams.regnames = urlParams.regids.map((x)=>regidToNameMap[x]);

      console.log('urlParams', urlParams);

      setChosenGene([urlParams.gene]);
      if (urlParams.gene2!=="undefined"){
        setChosenGene2([urlParams.gene2]);
      }
      setFbarActiveDataName(urlParams.fbd);
      setNisslStatus(urlParams.nisslStatus);
      setWireframeStatus(urlParams.wireframeStatus);
      setOpacityVal(urlParams.opacity);
      setUrlUmiLowerThreshold(urlParams.thl);
      setUrlUmiUpperThreshold(urlParams.thh);
      setUrlUmiLowerThreshold2(urlParams.thl2);
      setUrlUmiUpperThreshold2(urlParams.thh2);
      setMaxUmiThreshold(urlParams.mth1);
      setMaxUmiThreshold2(urlParams.mth2);
      setMinFrac(urlParams.minfrac);
      setMaxFrac(urlParams.maxfrac);

      setSelectedRegions(urlParams.regnames);
      setSelectedRegIds(urlParams.regids);
      setChosenPuckid({...chosenPuckid, pid: urlParams.pid, gene: urlParams.gene, init: false});

      // return {status: true, path: '/genex'}
    }
    else if (searchParams.get('path')==='singlecell'){
      let urlParams = {
        path: searchParams.get('path'),
        regids: regidsTmp,
        genes: searchParams.get('genes').split(','),
        order: searchParams.get('order'),
        sortField: searchParams.get('sortField')===''?'':searchParams.get('sortField'),
        cellClassSelection: searchParams.get('cellClassSelection'),
        sortByToggleVal: parseInt(searchParams.get('sortByToggleVal')),
        minCompoPct: parseFloat(searchParams.get('minCompoPct')),
        adaptNormalizerStatus: searchParams.get('adaptNormalizerStatus')==='true',
        hiddenColsStr: searchParams.get('hiddenColsStr'),
        hiddenCols: searchParams.get('hiddenColsStr').split(','),
        initPageSize: parseInt(searchParams.get('initPageSize')),
        aggregateBy: searchParams.get('aggregateBy'),
      }
      urlParams.regnames = urlParams.regids.map((x)=>regidToNameMap[x]);
      console.log('urlParams', urlParams);

      if (urlParams.cellClassSelection===""){
        setCellClassSelection([]);
      }else{
        setCellClassSelection([urlParams.cellClassSelection]);
      }
      setSortByToggleVal(urlParams.sortByToggleVal);
      setMinCompoPct(urlParams.minCompoPct);
      setOrder(urlParams.order);
      setSortField(urlParams.sortField);
      setAdaptNormalizerStatus(urlParams.adaptNormalizerStatus);

      setSelectedRegions(urlParams.regnames);
      setSelectedRegIds(urlParams.regids);
      setInitialHiddenCols(urlParams.hiddenCols);
      setInitPageSize(urlParams.initPageSize);
      setAggregateBy(urlParams.aggregateBy);
      setMultiSelections(urlParams.genes);


      // return {status: true, path: '/singlecell'}

    }else if (searchParams.get('path')==='cellspatial'){

      let urlParams = {
        path: searchParams.get('path'),
        pid: srnoToPid[parseInt(searchParams.get('srno'))],
        cell: searchParams.get('cell'),
        thl: parseFloat(searchParams.get('thl')),
        thh: parseFloat(searchParams.get('thh')),
        cell2: searchParams.get('cell2'),
        thl2: parseFloat(searchParams.get('thl2')),
        thh2: parseFloat(searchParams.get('thh2')),
        fbd: searchParams.get('fbd'),
        nisslStatus: searchParams.get('nisslStatus')==='true',
        wireframeStatus: searchParams.get('wireframeStatus')==='true',
        opacity: parseFloat(searchParams.get('opacityVal')),
        mth1: parseFloat(searchParams.get('mth1')),
        mth2: parseFloat(searchParams.get('mth2')),
        regids: regidsTmp,
        minfrac: parseFloat(searchParams.get('minfrac')),
        maxfrac: parseFloat(searchParams.get('maxfrac')),
        aggregateBy: searchParams.get('aggregateBy'),
      }
      console.log('urlParams', urlParams, urlParams.cell2!=="undefined");
      urlParams.regnames = urlParams.regids.map((x)=>regidToNameMap[x]);
      
      setChosenCluster([urlParams.cell]);
      if (urlParams.aggregateBy==="none"){
        setChosenCell([urlParams.cell]);
      }else if(urlParams.aggregateBy==="metacluster"){
        setChosenClade([urlParams.cell]);
      }else if(urlParams.aggregateBy==="cellclass"){
        setChosenClass([urlParams.cell]);
      }


      if (urlParams.cell2!=="undefined"){
        setChosenCell2([urlParams.cell2]);
      }

      setFbarActiveDataName(urlParams.fbd);
      setNisslStatus(urlParams.nisslStatus);
      setWireframeStatus(urlParams.wireframeStatus);
      setOpacityValCSC(urlParams.opacity);
      setUrlScoreLowerThreshold(urlParams.thl);
      setUrlScoreUpperThreshold(urlParams.thh);
      setUrlScoreLowerThreshold2(urlParams.thl2);
      setUrlScoreUpperThreshold2(urlParams.thh2);
      setMaxScoreThreshold(urlParams.mth1);
      setMaxScoreThreshold2(urlParams.mth2);
      setMinFrac(urlParams.minfrac);
      setMaxFrac(urlParams.maxfrac);

      setSelectedRegions(urlParams.regnames);
      setSelectedRegIds(urlParams.regids);
      setAggregateByCS(urlParams.aggregateBy);
      setChosenPuckid({...chosenPuckid, pid: urlParams.pid, cell: urlParams.cell, init: false});

      // return {status: true, path: '/cellspatial'}
    } // end of if else chain of path checks



    // return {status: false, path: null};
  } // extractAndSetParams function ends


  useEffect(() => {
    if (searchParams) {
      fetchData(); // sets regidToNameMap
    }
  }, [searchParams]);

  // setparams
  useEffect(() => {
    if (regidToNameMap){
      console.log('regidToNameMap', regidToNameMap);
      extractAndSetParams(searchParams); // handles params for all tabs: genex, singlecell, cellspatial
    }

  }, [regidToNameMap]);
  

  // check if key param for genex/cellspatial is set and if so, set urlParamStatus
  useEffect(() => {

    if (chosenPuckid.init===false && searchParams.get('path')==='cellspatial'){
      setUrlParamStatus({status: true, path: '/cellspatial'});
    }else if (chosenPuckid.init===false && searchParams.get('path')==='genex'){
      setUrlParamStatus({status: true, path: '/genex'});
    }

  }, [chosenPuckid]);

  // check if (sortof) key param for singlecell is set and if so, set
  // urlParamStatus. In this case, multiSelections does not strictly have to
  // have been set but used since we need a trigger for singlecell path.
  useEffect(() => {
    if (searchParams.get('path')==='singlecell'){
      setUrlParamStatus({status: true, path: '/singlecell'});
    }
  }, [multiSelections]);

  useEffect(  () => {

    console.log('updated selectedRegIds', selectedRegIds, regionTreeNodePaths);
    if (Object.keys(regionTreeNodePaths).length>0){ // guard against delayed loading of regionTreeNodePaths
      selectedRegIds.forEach(regId=>{
        let dendroDataTmp = dendroData;
        dendroDataTmp = markDendroDataNode(dendroDataTmp, regionTreeNodePaths, regId, true);
        setDendroData(dendroDataTmp);
      });
   }   
    
  }, [selectedRegIds, regionTreeNodePaths]);

  return (
    <>
      {urlParamStatus.status&&dendroData.length>1?null:console.log('urlParamStatus', urlParamStatus, 'dendroDatalen', dendroData.length)}
      {urlParamStatus.status&&dendroData.length>1?<Navigate to={urlParamStatus.path}/>:
      <div>
      <h5>Reading URL parameters... </h5>
      <h6> In case URL is malformed, your target page will not load. You can still return to the home page or one of the analysis tabs using links on the navigation bar above.</h6>
      </div>}
    </>
  );

}

export default UrlGuardAndRedirect;

