
import {useCallback, useState, useEffect} from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {useStore, useAuthStore} from '../store/store'

function Test(props){

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  useEffect(()=>{
    if (isLoggedIn){
      const storage = getStorage();
      const gsReference = ref(storage, '/1.png');
      getDownloadURL(ref(storage, gsReference))
        .then((url) => {
          // `url` is the download URL for 'images/stars.jpg'

          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();

          // Or inserted into an <img> element
          const img = document.getElementById('myimg');
          img.setAttribute('src', url);
          console.log(url);
        })
        .catch((error) => {
          // Handle any errors
        });
    }

  }, [isLoggedIn]);

  return(
    <>
      <h1>Test component</h1>
      <img id="myimg" alt="testimg"></img>
    </>
  );
}

export default Test;
