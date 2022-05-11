
import React, { useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';

function Loader(props) {

  const [filename, setFilename] = useState('https://storage.googleapis.com/ml_portal/test_data/test.json')

  let init_data = [
    {"name":"Lafayette (LAFY)","code":"LF","address":"3601 Deer Hill Road, Lafayette CA 94549","entries":"3481","exits":"3616","coordinates":[-122.123801,37.893394]},
    {"name":"12th St. Oakland City Center (12TH)","code":"12","address":"1245 Broadway, Oakland CA 94612","entries":"13418","exits":"13547","coordinates":[-122.271604,37.803664]}, 
    {"name": "abc", "code":"12", "address":"test", "entries":"2345",  "exits": "43239", "coordinates":[-122.3,37.9]}]

  const [data, setData] = useState(init_data);
  const [gene_data, setGenedata] = useState(init_data);
  const [uni_data, setUnidata] = useState(0);

  useEffect(() => {

    // console.log("in loaderr component", count);
    // setCount(0)
    // declare the data fetching function
    const fetchData = async () => {
      const data = await fetch(filename)
        .then(response => response.text())
        .then(data_str => JSON.parse(data_str));

      console.log("in loader", data);
      let data2 = await load('https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1/coords.csv', [CSVLoader]);
      let gene_data2 = await load('https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1/gene_Pcp4.csv', [CSVLoader]);
      // set state here - not outside the {}
      setData(data2);
      setGenedata(gene_data2);

      let uni_data2 = data2.map((obj, index) => ({
        ...obj,
        ...gene_data2[index]
      }));

      setUnidata(uni_data2);

    }

    fetchData();

    console.log("inside");
  }, [filename]);

  return(
    <div>
      <h4>Loader Component</h4>
      <div className="add-border" style={{ height: '60vh', width: '48vw', position: 'relative', float:'left' }}>
        <Scatterplot data={data} id={'left_splot'} unidata={uni_data}/>
      </div>
      <div className="add-border" style={{ height: '60vh', width: '48vw', position: 'relative', float:'left' }}>
        <Scatterplot data={data} id={'right_splot'} unidata={uni_data}/>
      </div>
    </div>
  );
}

export default Loader;   

// Reference
// https://devtrium.com/posts/async-functions-useeffect
// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
// https://stackoverflow.com/questions/50919164/how-to-merge-each-object-within-arrays-by-index


