import Breadcrumb from 'react-bootstrap/Breadcrumb'
import heatmap from 'canvas-heatmap';
import '../css/Heatmap.css';
// import ScriptTag from 'react-script-tag';
import {useLocation} from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {useEffect, useState} from 'react'
import {getUrl, fetchJsonAuth} from "../shared/common"


function Heatmap({location}){

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const [data,setData]=useState(null);
  const params = useLocation();
  console.log(params);

  // const {title} = location.state;
  // const {desc} = location.state;
  // const {data} = location.state;
  // const { title = 'defaultValue' } = location.state || {}
  useEffect(()=>{

    let pathInBucket = params.state.filepath;
    fetchJsonAuth(pathInBucket, setData);

  }, [params]);

  useEffect(() => {

    var colors = [
      { color: "#000080", point: 0 },
      { color: "#3366FF", point: 0.142857142857143 },
      { color: "#00B0DC", point: 0.285714285714286 },
      { color: "#009933", point: 0.428571428571429 },
      { color: "#FFFF5B", point: 0.571428571428571 },
      { color: "#E63300", point: 0.714285714285714 },
      { color: "#CC0000", point: 0.857142857142857 },
      { color: "#800000", point: 1 },
    ];
    // var n = 20;
    // var m = 20;
    // var z = [];
    // for (var j = 1; j < m + 1; ++j) {
    //   let zz = [];
    //   for (var i = 1; i < n + 1; ++i) {
    //     zz.push(i);
    //   }
    //   z.push(zz);
    // }
    // var x = [...Array(n).keys()];
    // var y = [...Array(m).keys()];
    // var data = { x, y, z };
    var options = {
      colors,
      thresholdStep: 19,
      xLabel: "puckid",
      yLabel: "regions",
      zLabel: "z-axis",
      fontSize: 15,
      zMin: 0,
    };
    // console.log(data);
    // console.log(title);
    if (data)
      heatmap("heatmap", data, options);

  }, [data]);

  return(
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/qcindex">QC Index</Breadcrumb.Item>
        <Breadcrumb.Item active>{params.state.title}</Breadcrumb.Item>
      </Breadcrumb>
      <h3>{params.state.title}</h3>
      <h5>{params.state.desc}</h5>
      <div id="heatmap" className="heatmap"></div>
    </>
  )

}

export default Heatmap;

