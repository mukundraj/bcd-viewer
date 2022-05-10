import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {COORDINATE_SYSTEM} from '@deck.gl/core'
import {PointCloudLayer} from '@deck.gl/layers'
import {OrthographicView} from '@deck.gl/core';
import {useCallback, useState, useEffect} from 'react'
import {interpolateViridis} from 'd3-scale-chromatic'
import {legendLinear, legendColor} from 'd3-svg-legend'

function Scatterplot({data, id}) {
  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */

  const toRGBArray = rgbStr => rgbStr.match(/\d+/g).map(Number);
  const hexToRGBArray = hex =>  hex.match(/[a-f0-9]{2}/gi).map(v => parseInt(v,16));
  console.log(interpolateViridis(0.5));
  console.log(hexToRGBArray(interpolateViridis(0.5)));
  const layer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    // getPosition: d => d.coordinates,
    getPosition: d => [d.y,d.z],
    getRadius: d => 0.2,
    getFillColor: d => hexToRGBArray(interpolateViridis(1.0)),
    getLineColor: d => [0, 0, 0],
    lineWidthScale : 0.001
  });


  const pc_layer = new PointCloudLayer({
    id: 'pc-layer',
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    coordinateOrigin : [0, 0, 0],
    data:[
      {position: [0,0,0]},
      {position: [50,50,0]},
      {position: [100,100,0]},
      {position: [150,150,0]},
    ],
    pointSize:10,
    sizeUnits: 'pixels'
  });

  const ortho_view = new OrthographicView({
    id:"ortho_view",
    controller:true
  });

   const [viewState, setViewState] = useState({
    target: [100, 100, 0],
    zoom: 0
  });

  const onViewStateChange = useCallback(({viewState}) => {
    // Manipulate view state
    // viewState.target[0] = Math.min(viewState.target[0], 10);
    // Save the view state and trigger rerender
    setViewState(viewState);
  }, []);


  useEffect(()=>{
    async function drawColorbar(){
      const d3 = await import("d3");
      let svg = d3.select(`#${id}`).append("svg");

                
      // // var linear = d3.scaleLinear()
      // //   .domain([0,10])
      // //   .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);
      let linear = d3.scaleLinear()
        .domain([0,0.01, 1])
        .range([d3.color("#aaaaaa40").formatRgb(), d3.color(interpolateViridis(1)).formatRgb(), d3.color(interpolateViridis(0.0)).formatRgb()]);


      // // var svg = d3.select("svg");

      svg
      .style("position", "absolute")
        .style("left", "2%")
        .style("top", "2%");
      svg.append("g")
        .attr("class", "legendLinear")
        // .attr("transform", "translate(90,20)");

      var legendLinear = legendColor()
        .shapeWidth(20)
        .cells(10)
        .orient('horizontal')
        .scale(linear);

      svg.select(".legendLinear")
        .call(legendLinear);

      svg.selectAll(".cell .label").attr("font-size", "10");


    }
    drawColorbar();

  }, []);

  return (
    <div className="splot" id={id}>
      <DeckGL initialViewState={viewState}
        views={ortho_view}
        layers={[layer]}
        controller={true}
        onViewStateChange={onViewStateChange}
      />
    </div>)
}

export default Scatterplot;

// References: 
// https://www.30secondsofcode.org/js/s/to-rgb-array
// https://stackoverflow.com/questions/25831276/turn-array-hex-colors-into-array-rgb-colors
// https://github.com/d3/d3-color
// https://d3-legend.susielu.com/#color-linear
// https://github.com/d3/d3-scale-chromatic
// https://css-tricks.com/how-to-stack-elements-in-css/
