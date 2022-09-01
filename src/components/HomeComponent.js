import { useEffect, useState} from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {useStore, useAuthStore} from '../store/store'
import Test from './TestComponent'
import Breadcrumbs from './BreadcrumbsComponent'

function Home(props){

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const [content, setContent] = useState(null);
  useEffect(()=>{
    console.log(String(isLoggedIn));
    if (!isLoggedIn){

      setContent(
        <div>
          <h1>Welcome</h1>
          <p>You are <strong>not</strong> logged in. Please log in using your Broad email to access data.</p>
        </div>
      )
    }else{
      setContent(
        <div>
          <h1>Welcome</h1>
          <p>You can explore the data using tabs on navigation bar.</p>
        </div>

      )
    }
  },[isLoggedIn]);

  return(
    <>
      <Breadcrumbs/>
      {content}
    </>
  );
}

export default Home;
