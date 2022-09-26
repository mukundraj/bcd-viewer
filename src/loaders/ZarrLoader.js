// Adapted from https://github.com/vitessce/vitessce/blob/b28ae1abbc5e08d296f979f0f3606c6e75365e47/src/loaders/data-sources/ZarrDataSource.js

import { HTTPStore, openArray, slice, KeyError } from 'zarr';
import range from 'lodash/range';

const readFloat32FromUint8 = (bytes) => {
  if (bytes.length !== 4) {
    throw new Error('readFloat32 only takes in length 4 byte buffers');
  }
  return new Int32Array(bytes.buffer)[0];
};

const HEADER_LENGTH = 4;

function dirname(path) {
  const arr = path.split('/');
  arr.pop();
  return arr.join('/');
}


function parseVlenUtf8(buffer) {
  const decoder = new TextDecoder();
  let data = 0;
  const dataEnd = data + buffer.length;
  const length = readFloat32FromUint8(buffer.slice(data, HEADER_LENGTH));
  if (buffer.length < HEADER_LENGTH) {
    throw new Error('corrupt buffer, missing or truncated header');
  }
  data += HEADER_LENGTH;
  const output = new Array(length);
  for (let i = 0; i < length; i += 1) {
    if (data + 4 > dataEnd) {
      throw new Error('corrupt buffer, data seem truncated');
    }
    const l = readFloat32FromUint8(buffer.slice(data, data + 4));
    data += 4;
    if (data + l > dataEnd) {
      throw new Error('corrupt buffer, data seem truncated');
    }
    output[i] = decoder.decode(buffer.slice(data, data + l));
    data += l;
  }
  return output;
}

export default class ZarrLoader {
  constructor({ zarrPathInBucket }) {
    this.zarrPathInBucket = zarrPathInBucket;
  }

  async getDataColumn(path, col_idx){
    const z = await openArray({
      store: this.zarrPathInBucket,
      path: path,
      mode: "r"
    });
    let data = await z.get([slice(null, null), col_idx]);

    // console.log(z,data);
    return data.data;
  }

  async getDataRow(path, row_idx){
    const z = await openArray({
      store: this.zarrPathInBucket,
      path: path,
      mode: "r",
    });
    let data = await z.get([row_idx, slice(null, null)]);

    // console.log(z,data);
    return data.data;
  }


 async getFlatArrDecompressed(path) {
     // const { store } = this;
    // console.log(path_in_bucket);
    return await openArray({
      store:this.zarrPathInBucket,
      path:path,
      mode: 'r',
    }).then(async (z) => {
      let data;
      const parseAndMergeTextBytes = (dbytes) => {
        const text = parseVlenUtf8(dbytes);
        if (!data) {
          data = text;
        } else {
          data = data.concat(text);
        }
      };
      const mergeBytes = (dbytes) => {
        if (!data) {
          data = dbytes;
        } else {
          const tmp = new Uint8Array(
            dbytes.buffer.byteLength + data.buffer.byteLength,
          );
          tmp.set(new Uint8Array(data.buffer), 0);
          tmp.set(dbytes, data.buffer.byteLength);
          data = tmp;
        }
      };
      const numRequests = Math.ceil(z.meta.shape[0] / z.meta.chunks[0]);
      // console.log(numRequests, z);
      const requests = range(numRequests).map(async item => z.store
        .getItem(`${z.keyPrefix}${String(item)}`)
        .then(buf => z.compressor.then(compressor => compressor.decode(buf))));
      const dbytesArr = await Promise.all(requests);
      dbytesArr.forEach((dbytes) => {
        // Use vlenutf-8 decoding if necessary and merge `data` as a normal array.
        if (
          Array.isArray(z.meta.filters)
          && z.meta.filters[0].id === 'vlen-utf8'
        ) {
          parseAndMergeTextBytes(dbytes);
          // Otherwise just merge the bytes as a typed array.
        } else {
          mergeBytes(dbytes);
        }
      });
      const {
        meta: {
          shape: [length],
        },
      } = z;
      // truncate the filled in values
      return data.slice(0, length);
    });
  }
}


