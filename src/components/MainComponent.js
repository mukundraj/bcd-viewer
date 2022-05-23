import {DATACONFIGS} from '../shared/dataConfigs'
import MainViewer from './MainViewerComponent'
import {Container} from 'react-bootstrap'
import Header from './HeaderComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from './TestComponent'

function Main(props){

  return(
    <>
      <Header />
      <BrowserRouter>
        <Container>
          <Routes>
            <Route path="/" element={<Test/>} />
            <Route path="/genex" element={<MainViewer dataConfig={DATACONFIGS[0]}/> } />
            <Route path="/regag" element={<MainViewer dataConfig={DATACONFIGS[1]}/> } />
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default Main;
