import Loader from './LoaderComponent';

function MainViewer({dataConfig}) {

  return(
    <Loader 
      basePath={dataConfig.basePath} 
      geneOptions={dataConfig.geneOptions}
      prefix={dataConfig.prefix}
      maxCountMetadataKey={dataConfig.maxCountMetadataKey}
      title={dataConfig.title}
    />
  );
}

export default MainViewer;

