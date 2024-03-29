import stanleylogo from '../../images/nph/stanleylogo.gif';
import mlablogo from '../../images/nph/mlab2.JPG';
import nphflow from '../../images/nph/nph_flowchart.png';
import { Scrollbars } from 'react-custom-scrollbars-2';

function NphHome(props){

  return(
    <div style={{backgroundColor:'white', background:'white', scrollBehavior:'smooth', overflow:'auto'}}>
      <div className='d-flex' style={{paddingRight:"25px", background:'white', backgroundColor: 'white', flexDirection:'row', justifyContent:'space-between'}}>
        <img className="item" src={stanleylogo} style={{width:'20em', height:"13.24em", alignSelf:'flex-end'}} alt="Stanley Logo" /> 
        <img src={mlablogo} style={{maxWidth:'8em', height:'8em', alignSelf:'center'}} alt="Macosko Lab Logo"/>
      </div>
      
      {/* <Scrollbars style={{height:600}}> */}
      <div style={{paddingRight:"25px"}}>
      <h4>NPH Integrative Analysis</h4>

      <p style={{textAlign:"justify"}}>
        We have performed single-nuclei RNA-sequencing on 52 high-quality frontal cortex 
        biopsies (Brodmann Area 8 or 9) from individuals with suspected normal pressure 
        hydrocephalus (NPH) who have variable degrees of local amyloid and tau 
        histopathology. Using our optimized protocol for nuclei extraction, we sampled 
        about 900k high quality nuclei from the human brain identifying 82 cell types, 
        unperturbed by death or agonal state. This empowered us to unbiasedly assess the 
        molecular changes associated with amyloid-beta and hyperphosphorylated tau across 
        all cell types in the neocortex. We further used this unique dataset as an anchor to 
        computationally integrate 27 existing postmortem (including individuals with AD, 
        Parkinson’s disease, Multiple sclerosis, and Autism spectrum disorder) and mouse 
        model single cell datasets of AD, Amyotrophic lateral sclerosis (ALS), aging, myelination,
        and other conditions. The integrated data includes over 2.4M high quality cell profiles 
        that are uniformly annotated across 36 datasets from 28 studies (some studies contain
        more than one dataset).
      </p>
      <img src={nphflow} style={{width:'100%'}} alt="NPH flowchart" />
      <h4>Data access</h4>
      <p style={{textAlign:"justify"}}>


        All generated single cell data and the results of our integrative
        analysis of 28 single cell studies are currently available as a Terra
        workbook. This includes sample annotations, cell identifiers (e.g.,
        cell barcodes), quality metrics, and cell type annotations from
        integrative analysis.

To access data, you need first to register an account at <a href="https://terra.bio/" target="_blank" rel="noreferrer">Terra</a>. Once registered
        and logged in, you can access the data and utilize the developed
        pipelines <a href="https://app.terra.bio/#workspaces/fbrihuman/sconline_integrative_analysis" target="_blank" rel="noreferrer">here</a>.
      </p>

        <p>
Furthermore, we have created a notebook that showcases the routine analyses and
        exploration of the data in a fast and efficient way, including:
        examination of the integration solutions, performing marker analysis
        across all of the datasets, and exploring differentially expressed
        genes, accessible <a href="https://app.terra.bio/#workspaces/help-terra/International_Neuroimmune_Consortium_Workshop_2022/analysis/launch/integrative_analysis.ipynb" target="_blank" rel="noreferrer">here</a>.
        </p>

        <p>
        Note that the links may not work properly if you have not logged in Terra.
        </p>

        <h5>Quick Data Downloads</h5>

        <p> The datasets can be directly downloaded  <i>without</i> any login requirement <a href="https://zenodo.org/record/8319719" target="_blank" rel="noreferrer">here</a>. </p>

      <h4>Contact</h4>
      <p style={{textAlign:"justify"}}>
        For questions and comments, please contact Evan Macosko [emacosko at broadinstitute org]
      </p>
      </div>
    {/* </Scrollbars> */}
      </div>
  );
}

export default NphHome;
