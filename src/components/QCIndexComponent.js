import {useStore,useAuthStore} from '../store/store'
import Home from './HomeComponent';
import Heatmap from './HeatmapComponent'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

function QCIndex({route}){
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setCurRoute = useStore(state => state.setCurRoute);

  setCurRoute(route);
  if(isLoggedIn){
    return(
      <>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>QC Index</Breadcrumb.Item>
        </Breadcrumb>
        <p>QC Index</p>
        <Heatmap/>
      </>
    )
  }else{
    return <Home/>
  }
}

export default QCIndex;
