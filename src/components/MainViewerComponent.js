import Loader from './LoaderComponent';
import Home from './HomeComponent'
import {useStore,useAuthStore} from '../store/store'


function MainViewer({dataConfig}) {

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);


  if (isLoggedIn)
  {
    console.log(String(isLoggedIn));
    return(
      <Loader 
        basePath={dataConfig.basePath} 
        geneOptions={dataConfig.geneOptions}
        prefix={dataConfig.prefix}
        maxCountMetadataKey={dataConfig.maxCountMetadataKey}
        title={dataConfig.title}
      />
    )
  }
  else{
    return(
      <Home/> 
    )
  }
}

export default MainViewer;

