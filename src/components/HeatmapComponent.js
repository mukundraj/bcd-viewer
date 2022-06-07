import Breadcrumb from 'react-bootstrap/Breadcrumb'
import heatmap from 'canvas-heatmap';
import {useEffect} from 'react';
import '../css/Heatmap.css';
// import ScriptTag from 'react-script-tag';

function Heatmap({data}){

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
      xLabel: "x-axis",
      yLabel: "y-axis",
      zLabel: "z-axis",
      fontSize: 15,
      zMin: 0,
    };
    console.log(data);
    if (data)
      heatmap("heatmap", data, options);

  }, [data]);

  return(
    <>
      <p>Heatmap here</p>
      <div id="heatmap" className="heatmap"></div>
    </>
  )


}

export default Heatmap;
