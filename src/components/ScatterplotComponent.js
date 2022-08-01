import DeckGL from '@deck.gl/react';
import {ScatterplotLayer, BitmapLayer} from '@deck.gl/layers';
import {COORDINATE_SYSTEM} from '@deck.gl/core'
import {PointCloudLayer} from '@deck.gl/layers'
import {OrthographicView} from '@deck.gl/core';
import {useCallback, useState, useEffect} from 'react'
import {interpolateViridis} from 'd3-scale-chromatic'
import {legendLinear, legendColor} from 'd3-svg-legend'
import useStore from '../store/store'
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function Scatterplot({id, unidata, threshold, opacityVal, viewState, onViewStateChange, curNisslUrl, curAtlasUrl}) {
  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */

  const hoverInfo = useStore(state => state.hoverInfo);
  const setHoverInfo = useStore(state => state.setHoverInfo);
  const maxUmiThreshold = useStore(state => state.maxUmiThreshold);

  const currentColorMap = useStore(state => state.currentColorMap);
  // const setCurrentColorMap = useStore(state => state.setCurrentColorMap);
  const wireframeStatus = useStore(state => state.wireframeStatus);
  const nisslStatus = useStore(state => state.nisslStatus);

  // seHoverInfo(5);
  const toRGBArray = rgbStr => rgbStr.match(/\d+/g).map(Number);
  const hexToRGBArray = hex =>  hex.match(/[a-f0-9]{2}/gi).map(v => parseInt(v,16));
  // console.log(interpolateViridis(0.5));
  // console.log(hexToRGBArray(interpolateViridis(0.5)));
  // const [currentColorMap, setCurrentColorMap] = useState(() => interpolateViridis); 

  const [data, setData] = useState(() => unidata);
  const accessToken = useStore(state => state.accessToken);
  const isLoggedIn = useStore(state => state.isLoggedIn);
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
    radiusScale: 10,
    radiusMinPixels: 2,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    // getPosition: d => d.coordinates,
    getPosition: d => [d.x,d.y],
    getRadius: d => 0.15,
    getFillColor: d => toRGBArray(currentColorMap(d.count)),
    getLineColor: d => [0, 0, 0],
    lineWidthScale : 0.001,
    onHover: info => setHoverInfo(info),
    // autoHighlight: true,
    highlightColor: [0, 255, 0],
    highlightedObjectIndex: hoverInfo.index
  });

  const ortho_view = new OrthographicView({
    id:"ortho_view",
    controller:true
  });

  useEffect(()=>{

    // console.log(unidata);
    let data_tmp = unidata.filter(bead => bead['count']>=threshold)
    let data = data_tmp.sort((a,b) => (a.count > b.count)?1:-1);
    // console.log(data);
    setData(data);

  }, [threshold, unidata]);

  let bitmap_layer=null;
  let wireframe_bitmap_layer = null;

  if (id==='left_splot'){
    bitmap_layer = new BitmapLayer({
      id: 'bitmap-layer',
      bounds: [0, 3605, 4096, 0],
      image: curNisslUrl,
      // image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
      opacity: nisslStatus?1.0:0
    });
    wireframe_bitmap_layer = new BitmapLayer({
      id: 'wire-bitmap',
      bounds: [0, 3605, 4096, 0],
      image: curAtlasUrl,
      // image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
      opacity: wireframeStatus?1.0:0
    });
  }
  // else if (id==='right_splot'){
  //   bitmap_layer = new BitmapLayer({
  //     id: 'bitmap-layer',
  //     bounds: [0, 3605, 4096, 0],
  //     image: curAtlasUrl,
  //     // image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
  //     opacity: opacityVal
  //   });
  // }

  return (
    <div className="splot" id={id}>
      <DeckGL initialViewState={viewState}
        views={ortho_view}
        controller={true}
        onViewStateChange={onViewStateChange}
        layers={[bitmap_layer, layer, wireframe_bitmap_layer]} 
        getCursor={() => "crosshair"}
      >
        {hoverInfo.object && (
          <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y}}>
            count:{hoverInfo.object.count}, region:{hoverInfo.object.rname}, {hoverInfo.object.x}, {hoverInfo.object.y}
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
// deck gl autohighlight - https://github.com/visgl/deck.gl/discussions/5634
// changing cursor style - https://github.com/visgl/deck.gl/issues/2220
