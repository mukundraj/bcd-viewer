import {DATACONFIGS} from '../shared/dataConfigs'
import MainViewer from './MainViewerComponent'
function Main(props){

  return(
    <>
      <MainViewer dataConfig={DATACONFIGS[1]}/>
    </>
  )
}

export default Main;
