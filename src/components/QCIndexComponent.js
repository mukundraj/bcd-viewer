import {useStore, useAuthStore} from '../store/store'
import Home from './HomeComponent';
import Heatmap from './HeatmapComponent'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {useEffect, useState} from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {getUrl, fetchJsonAuth} from "../shared/common"
import Table from 'react-bootstrap/Table'
import {Link, Navigate, useNavigate} from 'react-router-dom'


function QCIndex({route}){
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setCurRoute = useStore(state => state.setCurRoute);

  const [data,setData]=useState(null);
  const [metadata,setMetadata]=useState(null);
  
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  
  useEffect(()=>{

    let pathInBucket = `test_data2/qc_mats/sample1.json`
    fetchJsonAuth(pathInBucket, setData);

    let metadata_path = `test_data2/qc_mats/metadata.json`
    fetchJsonAuth(metadata_path, setMetadata);

    console.log(metadata);

  }, []);


  setCurRoute(route);

  let navigate = useNavigate();
  function handleClick(item){
    navigate("/heatmap", 
      {state:{title: item.name,
        desc: item.filename,
        filename: item.filename,
        filepath: `test_data2/qc_mats/${item.filename}`}
      });
  }
  let rows = null;
    
  if (metadata)
    rows = metadata['analysis_metadata'].map((item, index)=>
      <tr key={index}>
        <td>{item.name}</td>
        <td>{item.filename}</td>
        <td>
          <button type="button" onClick={ () => {handleClick(item)}}>view</button>
        </td>
      </tr>
    );
    

  if(isLoggedIn){
    return(
      <>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>QC Index</Breadcrumb.Item>
        </Breadcrumb>
        <h3>QC Index</h3>
        <Table striped border="true" hover size="sm">
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
        {/*<Heatmap title="title" desc="desc" data={data}/> */}
      </>
    )
  }else{
    return <Home/>
  }
}

export default QCIndex;

// References
// https://stackoverflow.com/questions/64566405/react-router-dom-v6-usenavigate-passing-value-to-another-component
