import Loader from './LoaderComponent';
import Home from './HomeComponent';
import {useStore,useAuthStore} from '../store/store'

function MainViewer({dataConfig}) {

  // const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  // const setCurRoute = useStore(state => state.setCurRoute);

  // setCurRoute(route);

  // if (isLoggedIn)
  // {
  //   console.log(String(isLoggedIn));
    return(
        <Loader 
          prefix={dataConfig.prefix}
          maxCountMetadataKey={dataConfig.maxCountMetadataKey}
          title={dataConfig.title}
          relativePath={dataConfig.relativePath}
          freqBarsDataPath={dataConfig.freqBarsDataPath}
        />
    )
  // }
  // else{
  //   return(
  //     <Home/> 
  //   )
  // }
}

export default MainViewer;

