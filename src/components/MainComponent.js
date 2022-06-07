import {DATACONFIGS} from '../shared/dataConfigs'
import MainViewer from './MainViewerComponent'
import QCIndex from './QCIndexComponent'
import {Container} from 'react-bootstrap'
import Header from './HeaderComponent'
import Home from './HomeComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from './TestComponent'
import { useState, useEffect} from 'react'

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
      <Header />
      <BrowserRouter>
        <Container>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/genex" element={<MainViewer dataConfig={DATACONFIGS[0]} route="genex"/> } />
            <Route path="/regag" element={<MainViewer dataConfig={DATACONFIGS[1]} route="regag"/> } />
            <Route path="/normalized" element={<MainViewer dataConfig={DATACONFIGS[2]} route="normalized"/> } />
            <Route path="/qcindex" element={<QCIndex route="qcindex"/>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default Main;
