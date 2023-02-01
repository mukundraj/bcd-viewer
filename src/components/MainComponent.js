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
import Loader from './LoaderComponent';
import NphHome from './nph/NphHomeComponent'

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

  return(
    <>
      {/* <Header /> */}
      <BrowserRouter>
        <Container className="d-flex" style={{height:"100vh", flexDirection:"column"}}>
          <Routes>
            <Route path="/" element={<AuthHeader/>}>
              <Route index path="/" element={<Home/>}/>
              <Route path="genex" element={ <RequireAuth><Loader dataConfig={DATACONFIGS[0]}/> </RequireAuth>} />
              <Route path="singlecell" element={ <RequireAuth><SingleCell dataConfig={DATACONFIGS[1]}/></RequireAuth>} />
              <Route path="cellspatial" element={ <RequireAuth><LoaderCellSpatial dataConfig={DATACONFIGS[1]}/></RequireAuth>} />
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
