
import Table from 'react-bootstrap/Table'
import {useStore} from '../store/store'
import {useNavigate,Link} from 'react-router-dom'

function AnalysisIdx({}){

  // const setCurRoute = useStore(state => state.setCurRoute);
  // setCurRoute(route);

  let navigate = useNavigate();
  function handleClick(item){
    navigate("/heatmap", 
      {state:{title: item.name,
        desc: item.desc,
        filename: item.filename,
        filepath: `test_data2/qc_mats/processed/${item.filename}`}
      });
  }

  let init_rows = [{name:"Regionally Aggregated and Normalized", desc:"..", link:".."}]
  let rows = init_rows.map((item, index)=>
      <tr key={index}>
        <td>{item.name}</td>
        <td>{item.desc}</td>
        <td>
          {/* <button type="button" onClick={ () => {handleClick(item)}}>view</button> */}
          <Link to={"regag2"}>view</Link>
        </td>
      </tr>
    );

  return(
    <>
        <h3>Analysis Index</h3>
        <div id="scroller">
        <Table striped border="true" hover size="sm" className="table-responsive">
          <thead>
            <tr>
              <td>Name</td>
              <td>Description</td>
              <td>Link</td>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
        </div>
    </>
  );
}

export default AnalysisIdx;

