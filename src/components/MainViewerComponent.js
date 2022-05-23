import Loader from './LoaderComponent';

function MainViewer({dataConfig}) {

  return(
    <Loader 
    basePath={dataConfig.basePath} 
    geneOptions={dataConfig.geneOptions}
    prefix={dataConfig.prefix}
    />
  );
}

export default MainViewer;

