import Breadcrumbs from './BreadcrumbsComponent'
import {useEffect } from 'react';
import {getUrl} from "../shared/common"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ZarrLoader from "../loaders/ZarrLoader"

function SingleCell(props){

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log(user)
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  
  // get zarr store connection
  useEffect(()=>{
    
    const fetchData = async () => {
      let zarrPathInBucket = `https://storage.googleapis.com/ml_portal/test_data/`
      let zloader = new ZarrLoader({zarrPathInBucket});
      let data = await zloader.getFlatArrDecompressed("z1.zarr/var/_index");
      let dataX = await zloader.getDataColumn("z1.zarr/X", 0);
      console.log(data);
      console.log(dataX);

    }
    fetchData();

  }, []);

  return(
    <>
      <Breadcrumbs/>
    </>
  );
}

export default SingleCell;

// https://stackoverflow.com/questions/40589499/what-do-the-signs-in-numpy-dtype-mean
