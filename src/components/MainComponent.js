import {DATACONFIGS} from '../shared/dataConfigs'
import MainViewer from './MainViewerComponent'
import {Container} from 'react-bootstrap'
import Header from './HeaderComponent'
import Home from './HomeComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from './TestComponent'

function Main(props){

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
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default Main;
