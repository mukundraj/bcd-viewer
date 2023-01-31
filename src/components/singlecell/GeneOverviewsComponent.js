
import GeneOverviewPlot from './GeneOverviewPlotComponent.js';

function GeneOverviews({columns, downsampledTableData}){

  // reversing plot order at end to deal with issue of plot not updating after flexbox resize - rereversing in flexbox container property to preserve the order of plots
  let avgVsPctPlots = columns.map((col, i) => downsampledTableData.hasOwnProperty(col.accessor)?
    <GeneOverviewPlot 
      downsampledData={downsampledTableData[col.accessor]}
      numCols={columns.length} 
    />:null).reverse()

  return (
  <>
    <div style={{display:"flex", flexDirection:"row-reverse", gap:"5px"}}>
      {avgVsPctPlots}
    </div>
  </>
  );


}

export default GeneOverviews;
