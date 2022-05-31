import { useEffect} from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import useStore from '../store/store'

function Home(props){

  const isLoggedIn = useStore(state => state.isLoggedIn);

  let content = null;
  if (!isLoggedIn){

    content = (
      <div>
        <h1>Welcome</h1>
        <p>You are <strong>not</strong> logged in. Please log in using your Broad email to access data.</p>
      </div>
    )
  }else{
    content=    (
      <div>
        <h1>Welcome</h1>
        <p>You are logged in. You can now explore data using tabs on navigation bar.</p>
      </div>

    )

  }


  return(
    <>
      {content}
    </>
  );
}

export default Home;
