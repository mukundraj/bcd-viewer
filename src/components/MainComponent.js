import {DATACONFIGS} from '../shared/dataConfigs'
import MainViewer from './MainViewerComponent'
import QCIndex from './QCIndexComponent'
import {Container} from 'react-bootstrap'
import AuthHeader from './AuthHeaderComponent'
import Home from './HomeComponent'
import AnalysisIdx from './AnalysisIdxComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from './TestComponent'
import { useState, useEffect} from 'react'
import Heatmap from './HeatmapComponent'
import RequireAuth from './RequireAuthComponent'
import SingleCell from './SingleCellComponent'
import LoaderCellSpatial from './LoaderCellSpatialComponent';
import NphHome from './nph/NphHomeComponent'
import UrlGuardAndRedirect from './UrlGuardandRedirectComponent'
import Loader from './LoaderComponent';
import {usePersistStore} from '../store/store'
import {getPaths} from "../shared/utils"
import {getUrl} from "../shared/common"

function Main(props){

  const [data,setData]=useState([]);

  const getData=()=>{
    fetch('data.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setData(myJson)
      });
  }

const dendroData = usePersistStore(state => state.dendroData);
const setDendroData = usePersistStore(state => state.setDendroData);
const regionTreeNodePaths = usePersistStore(state => state.regionTreeNodePaths);
const setRegionTreeNodePaths = usePersistStore(state => state.setRegionTreeNodePaths);

  // loading dendro data
  useEffect(()=>{
    
    const fetchData = async () => {
      let regionTreeDataPath = `test_data2/s9f/regions.json`
      let regionTreeDataUrl = await getUrl(regionTreeDataPath);
      const readData = await fetch(regionTreeDataUrl)
       .then(response => response.json());

      // console.log(readData);
      setDendroData(readData["children"]);
      // setDendroData(readData["children"]);
      let regionTreeNodePaths = getPaths(readData["children"]);
      setRegionTreeNodePaths(regionTreeNodePaths);
      console.log('regionTreeNodePaths', regionTreeNodePaths);

    }
    console.log('dendroData length', dendroData.length, dendroData);
    if (dendroData.length === 1){ // load dendroData and populate regionTreeNodePaths
      fetchData(); 
    }else{
      console.log('dendroData already loaded', dendroData);
    }
    
    // console.log(data);

  }, []);


  return(
    <>
      {/* <Header /> */}
      <BrowserRouter>
        <Container className="d-flex" style={{height:"100vh", flexDirection:"column"}}>
          <Routes>
            <Route path="/" element={<AuthHeader/>}>
              <Route index path="/" element={<Home/>}/>
              <Route path="redir" element={<UrlGuardAndRedirect dataConfig={DATACONFIGS[1]}/>}/>
              <Route path="genex" element={ <Loader dataConfig={DATACONFIGS[0]}/> } />
              <Route path="singlecell" element={ <SingleCell dataConfig={DATACONFIGS[1]} dataConfigCS={DATACONFIGS[2]}/>} />
              <Route path="cellspatial" element={ <LoaderCellSpatial dataConfig={DATACONFIGS[2]}/>} />
              {/* <Route path="anaindex"> */}
              {/*   <Route index element={<RequireAuth><AnalysisIdx /></RequireAuth>}/> */}
              {/*   <Route path="regag2" element={<RequireAuth><MainViewer dataConfig={DATACONFIGS[4]}/> </RequireAuth>} /> */}
              {/* </Route> */}
              {/* <Route path="qcindex"> */}
              {/*   <Route index element={<RequireAuth><QCIndex /></RequireAuth>} /> */}
              {/*   <Route path="heatmap" element={<Heatmap />} /> */}
              {/* </Route> */}
            </Route>
            <Route path="/nph" element={<NphHome/>} />
            <Route path="/resource" element={<NphHome/>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default Main;
