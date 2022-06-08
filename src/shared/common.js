
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

