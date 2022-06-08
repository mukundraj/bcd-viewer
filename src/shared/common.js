
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export  async function getUrl(pathInBucket){
    console.log(pathInBucket);
      const storage = getStorage();
      const gsReference = ref(storage, pathInBucket);
      let url = await getDownloadURL(ref(storage, gsReference))
        .then((url) => url);
    console.log(url);
    return url;
  }


// read json data after authentication and pass to setData
 export const fetchJsonAuth = async (pathInBucket, setData) => {
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
          setData(myJson);
        });
    }

