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
  const setUmiLowerThreshold = useGEComponentStore(state => state.setUmiLowerThreshold);
  const setUmiUpperThreshold = useGEComponentStore(state => state.setUmiUpperThreshold);

  const setUmiLowerThreshold2 = useGEComponentStore(state => state.setUmiLowerThreshold2);
  const setUmiUpperThreshold2 = useGEComponentStore(state => state.setUmiUpperThreshold2);

  const setMaxUmiThreshold = useStore(state => state.setMaxUmiThreshold);
  const setMaxUmiThreshold2 = useStore(state => state.setMaxUmiThreshold2);

  const setSelectedRegions = usePersistStore(state => state.setSelectedRegions);
  const setSelectedRegIds = usePersistStore(state => state.setSelectedRegIds);

  const dendroData = usePersistStore(state => state.dendroData);
  const setDendroData = usePersistStore(state => state.setDendroData);
  const regionTreeNodePaths = usePersistStore(state => state.regionTreeNodePaths);
  const setRegionTreeNodePaths = usePersistStore(state => state.setRegionTreeNodePaths);

  const setMinFrac = useStore(state => state.setMinFrac);
  const setMaxFrac = useStore(state => state.setMaxFrac);

  const selectedRegIds = usePersistStore(state => state.selectedRegIds);

  const {basePath, dpathScZarr, dpathMappedCellTypesToIdx, dpathRegionToCelltype, dpathIdAcroNameMap} = dataConfig;

  const [regidToNameMap, setRegidToNameMap] = useState(null);

    const fetchData = async () => {
      let acroIdNameMapFile = `${basePath}${dpathIdAcroNameMap}`;
      const acroIdNameMap = await load(acroIdNameMapFile, [CSVLoader], {csv:{delimiter:"\t"}});

      console.log('acroId', acroIdNameMap);
      let regidToNameMapTmp = {};
      acroIdNameMap.forEach(x=>regidToNameMapTmp[x.column1] = x.column3);
      setRegidToNameMap(regidToNameMapTmp);
    }



  const checkParams = (searchParams) => {

    let regidsTmp = searchParams.get('regids')?searchParams.get('regids').split(','):[];
    if (regidsTmp.length>0){
      regidsTmp = regidsTmp.map(x=>parseInt(x));
    }

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
      opacity: searchParams.get('opacityVal'),
      mth1: parseInt(searchParams.get('mth1')),
      mth2: parseInt(searchParams.get('mth2')),
      regids: regidsTmp,
      minfrac: parseFloat(searchParams.get('minfrac')),
      maxfrac: parseFloat(searchParams.get('maxfrac')),
    }
      urlParams.regnames = urlParams.regids.map((x)=>regidToNameMap[x]);

    console.log('urlParams', urlParams);

    // check if all needed params present and if so update state and return status true
    if (urlParams.path==='genex'){

      setChosenGene([urlParams.gene]);
      if (urlParams.gene2!=="undefined"){
        setChosenGene2([urlParams.gene2]);
      }
      setChosenPuckid({...chosenPuckid, pid: urlParams.pid, gene: urlParams.gene});
      setFbarActiveDataName(urlParams.fbd);
      setNisslStatus(urlParams.nisslStatus);
      setWireframeStatus(urlParams.wireframeStatus);
      setOpacityVal(urlParams.opacity);
      setUmiLowerThreshold(urlParams.thl);
      setUmiUpperThreshold(urlParams.thh);
      setUmiLowerThreshold2(urlParams.thl2);
      setUmiUpperThreshold2(urlParams.thh2);
      setMaxUmiThreshold(urlParams.mth1);
      setMaxUmiThreshold2(urlParams.mth2);
      setMinFrac(urlParams.minfrac);
      setMaxFrac(urlParams.maxfrac);
      
      setSelectedRegions(urlParams.regnames);
      setSelectedRegIds(urlParams.regids);

      return {status: true, path: '/genex'}
    }
    else if (urlParams.path==='singlecell'){


    }else if (urlParams.path==='cellspatial'){

    }



      return {status: false, path: null};
  }


  useEffect(() => {
    if (searchParams) {
      fetchData();
   }
  }, [searchParams]);

  useEffect(() => {
    if (regidToNameMap){
      const urlParamStatusTmp = checkParams(searchParams);
      console.log('urlParamStatusTmp', urlParamStatusTmp)
      setUrlParamStatus(urlParamStatusTmp);
    }

  }, [regidToNameMap]);

  useEffect(  () => {

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
      {urlParamStatus.status?<Navigate to={urlParamStatus.path}/>:
      <div>
      <h5>Reading URL parameters... </h5>
      <h6> In case URL is malformed, your target page will not load. You can still return to the home page or one of the analysis tabs using links on the navigation bar above.</h6>
      </div>}
    </>
  );

}

export default UrlGuardAndRedirect;

