
import React, { useState, useEffect } from 'react';
import Scatterplot from './ScatterplotComponent';

function Loader(props) {

  const [filename, setFilename] = useState('https://storage.googleapis.com/ml_portal/test_data/test.json')

  let init_data = [
    {"name":"Lafayette (LAFY)","code":"LF","address":"3601 Deer Hill Road, Lafayette CA 94549","entries":"3481","exits":"3616","coordinates":[-122.123801,37.893394]},
    {"name":"12th St. Oakland City Center (12TH)","code":"12","address":"1245 Broadway, Oakland CA 94612","entries":"13418","exits":"13547","coordinates":[-122.271604,37.803664]}, 
    {"name": "abc", "code":"12", "address":"test", "entries":"2345",  "exits": "43239", "coordinates":[-122.3,37.9]}]

  const [data, setData] = useState(init_data);

  useEffect(() => {

    // console.log("in loaderr component", count);
    // setCount(0)
    // declare the data fetching function
    const fetchData = async () => {
      const data = await fetch(filename)
        .then(response => response.text())
        .then(data_str => JSON.parse(data_str));

    console.log("in loader", data);

      // set state here - not outside the {}
      setData(data);

    }

    fetchData();

    console.log("inside");
  }, [filename]);

  return(
    <div>
      <h4>Loader Component</h4>
      <div className="App add-border" style={{ height: '60vh', width: '48vw', position: 'relative', float:'left' }}>
        <Scatterplot data={data}  />
      </div>
      <div className="App add-border" style={{ height: '60vh', width: '48vw', position: 'relative', float:'left' }}>
        <Scatterplot data={data}  />
      </div>
    </div>
  );
}

export default Loader;   

// Reference
// https://devtrium.com/posts/async-functions-useeffect
// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5


