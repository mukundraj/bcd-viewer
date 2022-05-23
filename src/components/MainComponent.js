import {DATACONFIGS} from '../shared/dataConfigs'
import MainViewer from './MainViewerComponent'
import {Container} from 'react-bootstrap'
import Header from './HeaderComponent'

function Main(props){

  return(
    <>
      <Header />
      <Container>
        <MainViewer dataConfig={DATACONFIGS[1]}/>
      </Container>
    </>
  )
}

export default Main;
