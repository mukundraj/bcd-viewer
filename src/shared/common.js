
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const fetchJson = async (filepath) => {
  return await fetch(filepath)
    .then(function(response){
      return response.json();
    });
}

export function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

export  async function getUrl(pathInBucket){
    // console.log('pathInBucket', pathInBucket);
      const storage = getStorage();
      const gsReference = ref(storage, pathInBucket);
      let url = await getDownloadURL(ref(storage, gsReference))
        .then((url) => url);
    // console.log('encodedPath', url);
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

export const pidToSrno = {
  1:'001', 3:'002', 7:'003', 9:'004', 11:'005', 13:'006', 15:'007', 17:'008', 19:'009',
  21:'010', 23:'011', 25:'012', 27:'013', 29:'014', 31:'015', 33:'016', 35:'017', 37:'018', 39:'019',
  41:'020', 43:'021', 45:'022', 47:'023', 49:'024', 51:'025', 53:'026', 55:'027', 57:'028', 59:'029',
  61:'030', 63:'031', 65:'032', 67:'033', 69:'034', 71:'035', 73:'036', 75:'037', 79:'038',
  81:'039', 83:'040', 85:'041', 87:'042', 89:'043', 91:'044', 93:'045', 95:'046', 97:'047', 99:'048',
  101:'049', 103:'050', 105:'051', 107:'052', 109:'053', 111:'054', 113:'055', 115:'056', 117:'057', 119:'058',
  121:'059', 123:'060', 125:'061', 127:'062', 129:'063', 131:'064', 133:'065', 135:'066', 137:'067', 139:'068',
  141:'069', 143:'070', 145:'071', 147:'072', 149:'073', 151:'074', 153:'075', 155:'076', 157:'077', 159:'078',
  161:'079', 163:'080', 165:'081', 169:'082', 171:'083', 173:'084', 175:'085', 177:'086', 179:'087',
  181:'088', 183:'089', 185:'090', 187:'091', 189:'092', 191:'093', 193:'094', 195:'095', 197:'096', 199:'097',
  201:'098', 203:'099', 205:'100', 207:'101',
}

// https://stackoverflow.com/questions/23013573/swap-key-with-value-in-object
const f = obj => Object.fromEntries(Object.entries(obj).map(a => a.reverse().map(x=>parseInt(x))))


export const srnoToPid = f(pidToSrno);
