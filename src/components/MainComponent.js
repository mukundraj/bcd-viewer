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
        <Container>
          <Routes>
            <Route path="/" element={<AuthHeader/>}>
              <Route index path="/" element={<Home/>}/>
              <Route index path="anaindex" element={<AnalysisIdx route="anaindex"/>}/>
              <Route path="genex" element={<MainViewer dataConfig={DATACONFIGS[0]} route="genex"/> } />
              <Route path="regag" element={<MainViewer dataConfig={DATACONFIGS[1]} route="regag"/> } />
              <Route path="regag2" element={<MainViewer dataConfig={DATACONFIGS[3]} route="regag2"/> } />
              <Route path="normalized" element={<MainViewer dataConfig={DATACONFIGS[2]} route="normalized"/> } />
              <Route path="qcindex" element={<QCIndex route="qcindex"/>} />
              <Route path="heatmap" element={<Heatmap route="heatmap"/>} />
            </Route>
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default Main;
