import {useStore, useAuthStore} from '../store/store'
import Home from './HomeComponent';
import Heatmap from './HeatmapComponent'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {useEffect, useState} from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {getUrl} from "../shared/common"

function QCIndex({route}){
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setCurRoute = useStore(state => state.setCurRoute);

  const [data,setData]=useState(null);
  
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

  // async function getUrl(pathInBucket){
  //   console.log(pathInBucket);
  //     const storage = getStorage();
  //     const gsReference = ref(storage, pathInBucket);
  //     let url = await getDownloadURL(ref(storage, gsReference))
  //       .then((url) => url);
  //   console.log(url);
  //   return url;
  // }
  
  useEffect(()=>{

    // read coords data
    const fetchData = async () => {
      let pathInBucket = `test_data2/qc_mats/sample1.json`
      let secretUrl = await getUrl(pathInBucket);
      // const readData = await load(coordsUrl, [CSVLoader], {csv:{delimiter:":"}});
      console.log(secretUrl);

      fetch(secretUrl
        ,{
          // headers : { 
          //   'Content-Type': 'application/json',
          //   'Accept': 'application/json'
          // }
        }
      )
        .then(function(response){
          // console.log(response)
          return response.json();
        })
        .then(function(myJson) {
          console.log(myJson);
          setData(myJson)
        });
    }
    fetchData();
  },[]);

  setCurRoute(route);
  if(isLoggedIn){
    return(
      <>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>QC Index</Breadcrumb.Item>
        </Breadcrumb>
        <p>QC Index</p>
        <Heatmap data={data}/>
      </>
    )
  }else{
    return <Home/>
  }
}

export default QCIndex;
