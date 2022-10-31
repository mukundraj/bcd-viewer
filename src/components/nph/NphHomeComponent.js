import stanleylogo from '../../images/nph/stanleylogo.png';
import mlablogo from '../../images/nph/mlab2.JPG';
import nphflow from '../../images/nph/nph_flowchart.png';

function NphHome(props){

  return(
    <>
      <div className='d-flex' style={{flexDirection:'row', justifyContent:'space-between'}}>
        <div><img src={stanleylogo} style={{width:'25vw', alignSelf:'center'}} alt="Stanley Logo" /> </div>
        <div style={{ alignSelf:'center'}}><img src={mlablogo} style={{width:'10vw'}} alt="Macosko Lab Logo"/></div>
      </div>
      
      <h4>NPH Integrative Analysis</h4>

      <p style={{textAlign:"justify"}}>
We have performed single-nuclei RNA-sequencing on 52 high-quality frontal cortex 
biopsies (Brodmann Area 8 or 9) from individuals with suspected normal pressure 
hydrocephalus (NPH) who have variable degrees of local amyloid and tau 
histopathology. Using our optimized protocol for nuclei extraction, we sampled over 
about 900k high quality nuclei from the human brain identifying 82 cell types, 
unperturbed by death or agonal state. This empowered us to unbiasedly assess the 
molecular changes associated with amyloid-beta and hyperphosphorylated tau across 
all cell types in the neocortex. We further used this unique dataset as an anchor to 
computationally integrate 27 existing postmortem (including individuals with AD, 
Parkinson’s disease, Multiple sclerosis, and Autism spectrum disorder) and mouse 
model single cell datasets of AD, Amyotrophic lateral sclerosis (ALS), aging, myelination,
and other conditions. The integrated data includes over 4.2M high quality cell profiles 
that are uniformly annotated across 36 datasets from 28 studies (some studies have 
more than one dataset).
Data access
All generated single cell data and the results of our integrative analysis of 28 single cell 
studies are currently available as a Terra workbook. This includes sample annotations, 
cell identifiers (e.g., cell barcodes), quality metrics, and cell type annotations from 
integrative analysis. We have also included functionality to perform several analyses in 
a fast and efficient way, including: examination of the integration solutions, performing 
marker analysis across all of the datasets, and exploring differentially expressed genes.
To access data, you need to register an account at www.Terra.bio. Once registered and 
        logged in, you can access the workbook <a href="https://app.terra.bio/#workspaces/help-
terra/International_Neuroimmune_Consortium_Workshop_2022/analysis/launch/
integrative_analysis.ipynb">here</a>. Note that the link may not work properly if you have not 
logged in Terra.
Contact
For questions and comments, please contact Vahid H Gazestani 
      </p>
      <img src={nphflow} style={{width:'100%'}} alt="NPH flowchart" />
    </>
  );
}

export default NphHome;
