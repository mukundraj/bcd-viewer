// create a new functional component

import { useSearchParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {srnoToPid} from "../shared/common"
import {useStore, usePersistStore} from '../store/store'
import GEComponentStore, {useGEComponentStore} from '../store/GEComponentStore'



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


  const checkParams = (searchParams) => {
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
    }
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

      return {status: true, path: '/genex'}
    }
    else if (urlParams.path==='singlecell'){


    }else if (urlParams.path==='cellspatial'){

    }



      return {status: false, path: null};
  }


  useEffect(() => {
    if (searchParams) {
      const urlParamStatusTmp = checkParams(searchParams);
      console.log('urlParamStatusTmp', urlParamStatusTmp)
      setUrlParamStatus(urlParamStatusTmp);
      
   }
  }, [searchParams]);


  return (
    <>
      {urlParamStatus.status?<Navigate to={urlParamStatus.path}/>:
      <div>
      <h5>Invalid URL parameters</h5>
      <h6> You can return to the home page or one of the analysis tabs using links on the navigation bar above.</h6>
      </div>}
    </>
  );

}

export default UrlGuardAndRedirect;

// localhost:3000/genex?paramgene=Pcp4
