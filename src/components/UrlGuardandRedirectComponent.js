// create a new functional component

import { useSearchParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {srnoToPid} from "../shared/common"
import {useStore, usePersistStore} from '../store/store'



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

  const checkParams = (searchParams) => {
    let urlParams = {
      path: searchParams.get('path'),
      pid: srnoToPid[parseInt(searchParams.get('srno'))],
      gene: searchParams.get('gene'),
      th: searchParams.get('th'),
      gene2: searchParams.get('gene2'),
      th2: searchParams.get('th2'),
      fbd: searchParams.get('fbd'),
      nisslStatus: searchParams.get('nisslStatus')==='true',
      wireframeStatus: searchParams.get('wireframeStatus')==='true',
    }
    console.log('urlParams', urlParams);

    // check if all needed params present and if so update state and return status true
    if (urlParams.path==='genex'){

      setChosenGene([urlParams.gene]);
      setChosenGene2([urlParams.gene2]);
      setChosenPuckid({...chosenPuckid, pid: urlParams.pid, gene: urlParams.gene});
      setFbarActiveDataName(urlParams.fbd);
      setNisslStatus(urlParams.nisslStatus);
      setWireframeStatus(urlParams.wireframeStatus);

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