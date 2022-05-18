import DeckGL from '@deck.gl/react';
import {ScatterplotLayer, BitmapLayer} from '@deck.gl/layers';
import {COORDINATE_SYSTEM} from '@deck.gl/core'
import {PointCloudLayer} from '@deck.gl/layers'
import {OrthographicView} from '@deck.gl/core';
import {useCallback, useState, useEffect} from 'react'
import {interpolateViridis} from 'd3-scale-chromatic'
import {legendLinear, legendColor} from 'd3-svg-legend'

function Scatterplot({id, unidata, threshold, maxUmiThreshold, opacityVal, viewState, onViewStateChange, hoverInfo, setHoverInfo}) {
  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */


  const toRGBArray = rgbStr => rgbStr.match(/\d+/g).map(Number);
  const hexToRGBArray = hex =>  hex.match(/[a-f0-9]{2}/gi).map(v => parseInt(v,16));
  // console.log(interpolateViridis(0.5));
  // console.log(hexToRGBArray(interpolateViridis(0.5)));

  const [currentColorMap, setCurrentColorMap] = useState(() => interpolateViridis); 
  const [data, setData] = useState(() => unidata);
  // console.log("heref ",currentColorMap(0.5));
  // const [hoverInfo, setHoverInfo] = useState(0);
  // const [opacityNissl, setOpacityNissl] = useState(0);
  // const [opacitySS, setOpacitySS] = useState(1);
  // const [opacityAtlas, setOpacityAtlas] = useState(0);


  // console.log(unidata);
  const layer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: data,
    pickable: true,
    opacity: opacityVal,
    stroked: false,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    // getPosition: d => d.coordinates,
    getPosition: d => [d.z,d.y],
    getRadius: d => 0.1,
    getFillColor: (d,i) => toRGBArray(currentColorMap(d.count)),
    getLineColor: d => [0, 0, 0],
    lineWidthScale : 0.001,
    onHover: info => setHoverInfo(info)
  });

  const ortho_view = new OrthographicView({
    id:"ortho_view",
    controller:true
  });

  // const [viewState, setViewState] = useState({
  //   target: [228, 160, 0],
  //   zoom: 0
  // });


  // const onViewStateChange = useCallback(({viewState}) => {
  //   // Manipulate view state
  //   // viewState.target[0] = Math.min(viewState.target[0], 10);
  //   // Save the view state and trigger rerender
  //   setViewState(viewState);
  // }, []);

  // useEffect(()=>{

  //   if (opacityVal>=0 && opacityVal<1){
  //     setOpacityAtlas(0);
  //     setOpacitySS(opacityVal);
  //     setOpacityNissl(1-opacityVal);
  //   }else if(opacityVal>=1 && opacityVal<2){
  //     setOpacityNissl(0);
  //     setOpacitySS(2-opacityVal);
  //     setOpacityAtlas(opacityVal-1);
  //   }else if(opacityVal>=2 && opacityVal<3){
  //     setOpacityNissl(opacityVal-2);
  //     setOpacitySS(0);
  //     setOpacityAtlas(3-opacityVal);
  //   }

  // },[opacityVal]);

  useEffect(()=>{

    // console.log(unidata);
    let data = unidata.filter(bead => bead['count']>=threshold)
    // console.log(data);
    setData(data);

  }, [threshold, unidata]);

  useEffect(()=>{
    async function drawColorbar(){
      const d3 = await import("d3");
      d3.selectAll("svg > *").remove();
      let svg = d3.select(`#${id}`).append("svg");


      console.log("maxUmiThreshold ", maxUmiThreshold, {maxUmiThreshold});
      // // var linear = d3.scaleLinear()
      // //   .domain([0,10])
      // //   .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);
      let linear = d3.scaleLinear()
        .domain([0, 0.01, maxUmiThreshold])
        .range([d3.color("#aaaaaa40").formatRgb(), d3.color(interpolateViridis(1)).formatRgb(), d3.color(interpolateViridis(0.0)).formatRgb()]);

      setCurrentColorMap(() => linear);

      // // var svg = d3.select("svg");

      svg
        .style("position", "absolute")
        .style("left", "2%")
        .style("top", "2%");
      svg.append("g")
        .attr("class", "legendLinear")
      // .attr("transform", "translate(90,20)");

      var legendLinear = legendColor()
        .shapeWidth(25)
        .cells(10)
        .orient('horizontal')
        .scale(linear);

      svg.select(".legendLinear")
        .call(legendLinear);

      svg.selectAll(".cell .label").attr("font-size", "10");

    }
    drawColorbar();

  }, [maxUmiThreshold]);

  let bitmap_layer=null;
  console.log(id==='left_spot')

  if (id==='left_splot'){
    bitmap_layer = new BitmapLayer({
      id: 'bitmap-layer',
      bounds: [0, 320, 456, 0],
      image: 'https://storage.googleapis.com/ml_portal/test_data/nis_001.png',
      // image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
      opacity: 1-opacityVal
    });
  }else if (id==='right_splot'){
    bitmap_layer = new BitmapLayer({
      id: 'bitmap-layer',
      bounds: [0, 320, 456, 0],
      image: 'https://storage.googleapis.com/ml_portal/test_data/chuck_sp_labelmap_001.png',
      // image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
      opacity: 1-opacityVal
    });
  }

  return (
    <div className="splot" id={id}>
      <DeckGL initialViewState={viewState}
        views={ortho_view}
        controller={true}
        onViewStateChange={onViewStateChange}
        layers={[layer, bitmap_layer]} >
        {hoverInfo.object && (
        <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y}}>
          { hoverInfo.object.count }
        </div>
      )}
      </DeckGL>
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
// https://stackoverflow.com/questions/50919164/how-to-merge-each-object-within-arrays-by-index
