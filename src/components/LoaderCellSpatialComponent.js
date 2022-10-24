import React, { useCallback, useState, useEffect } from 'react';
import {useStore,useAuthStore} from '../store/store'
import Breadcrumbs from './BreadcrumbsComponent'
import {Form, FormGroup, Col, Row, ProgressBar} from 'react-bootstrap'
import BcdCarousel from "./BcdCarouselComponent"
import {getUrl, pidToSrno} from "../shared/common"

function LoaderCellSpatial({dataConfig}){

  const {prefix, maxCountMetadataKey, title, relativePath, freqBarsDataPath} = dataConfig;
  const carouselRef = useStore(state => state.carouselRef);
  const chosenPuckid = useStore(state => state.chosenPuckid);
  const setChosenPuckid = useStore(state => state.setChosenPuckid);
  const [dataLoadStatus, setDataLoadStatus] = useState({puck:0, gene:0, metadata:0});

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
    </div>
  );
}

export default LoaderCellSpatial;   
