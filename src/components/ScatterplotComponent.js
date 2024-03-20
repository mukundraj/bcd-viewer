import DeckGL from '@deck.gl/react';
import {ScatterplotLayer, BitmapLayer} from '@deck.gl/layers';
import {COORDINATE_SYSTEM} from '@deck.gl/core'
import {PointCloudLayer} from '@deck.gl/layers'
import {OrthographicView} from '@deck.gl/core';
import {useCallback, useState, useEffect} from 'react'
import {interpolateViridis} from 'd3-scale-chromatic'
import {legendLinear, legendColor} from 'd3-svg-legend'
import {useStore, usePersistStore} from '../store/store'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {getUrl} from "../shared/common"
import * as d3 from 'd3';

function Scatterplot({id, unidata, 
  lowerThreshold, upperThreshold, maxThreshold,
  lowerThreshold2, upperThreshold2, maxThreshold2,
  opacityVal, viewState, onViewStateChange, curNisslUrl, curAtlasUrl, chosenItem2, hoverKey}) {
  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */

  const hoverInfo = useStore(state => state.hoverInfo);
  const setHoverInfo = useStore(state => state.setHoverInfo);
  // const maxUmiThreshold = useStore(state => state.maxUmiThreshold);
  // const maxUmiThreshold2 = useStore(state => state.maxUmiThreshold2);
  const selectedRegions = usePersistStore(state => state.selectedRegions);

  const currentColorMap = useStore(state => state.currentColorMap);
  const wireframeStatus = useStore(state => state.wireframeStatus);
  const nisslStatus = useStore(state => state.nisslStatus);

  // seHoverInfo(5);
  const toRGBArray = rgbStr => rgbStr.match(/\d+/g).map(Number);
  const hexToRGBArray = hex =>  hex.match(/[a-f0-9]{2}/gi).map(v => parseInt(v,16));
  // console.log(interpolateViridis(0.5));
  // console.log(hexToRGBArray(interpolateViridis(0.5)));

  const [data, setData] = useState(() => unidata);
  const [regionTree, setRegionTree] = useState(null);
  const regionTreeJson = usePersistStore(state => state.regionTreeJson);
  const setRegionTreeJson = usePersistStore(state => state.setRegionTreeJson);
  const accessToken = useStore(state => state.accessToken);
  const isLoggedIn = useStore(state => state.isLoggedIn);
  // const [hoverInfo, setHoverInfo] = useState(0);
  // const [opacityNissl, setOpacityNissl] = useState(0);
  // const [opacitySS, setOpacitySS] = useState(1);
  // const [opacityAtlas, setOpacityAtlas] = useState(0);
  // const chosenGene = useStore(state => state.chosenGene);
  // const chosenGene2 = useStore(state => state.chosenGene2);
  const generalColormap = useStore(state => state.generalColormap);
  const setGeneralColormap = useStore(state => state.setGeneralColormap);


  let coeff = 2;
  const logScale = d3.scaleLog().base(10).domain([1, 1+coeff*1]);
  // console.log('logScale', logScale(1)/logScale(coeff*1 + 1), logScale(coeff*0.5+1)/logScale(coeff*1+1), logScale(coeff*1+1)/logScale(coeff*1+1));
  // a closure for generating a general colormap based on whether a chosenItem2 is present
  useEffect(()=>{
    function getGeneralColormap(chosenItem2){ 

      function getRGB1(count){ // initially
        // return toRGBArray(currentColorMap(count));
        return toRGBArray(currentColorMap(count));
      }

      function getRGB2(logcnt1, logcnt2){ // after
        
        // compute fractions for gene1 and gene2
        // let p_x = logScale(coeff*count/maxUmiThreshold+1)/logScale(coeff*1+1);
        // let p_y = logScale(coeff*count2/maxUmiThreshold2+1)/logScale(coeff*1+1);
        let p_x = logcnt1;
        let p_y = logcnt2;
        // let p_x = count/77;
        // let p_y = count2/4;
        let rgbColor = null;

        let c1=null, c2=null, c3=null;
        
        let x_v1 = 1, y_v1 = 0;
        let x_v2 = 0, y_v2 = 1;
        let x_v3 = null, y_v3 = null; 

        // if (p_x+p_y<0.001){
        //   rgbColor = [127, 127, 127, 255] // #aaaaaa

        // } else
        if (p_x + p_y - 1 > 0){ // when both genes have higher expression 

          // specify top right vertex
          x_v3 = 1; y_v3 = 1;

          // if (0<=w_v1 && w_v1<=1 && 0 <= w_v2 && w_v2<=1 && 0 <=w_v3 && w_v3<=1){
            c1 = [255, 0, 0, 255]; // red
            c2 = [0, 255, 0, 255]; // green
            c3 = [255, 255, 0, 255]; // yellow


        }else{ // when both genes have lower expression

          // specify bottom left vertex
          x_v3 = 0; y_v3 = 0;

           c1 = [255, 0, 0, 255]; // red 
           c2 = [0, 255, 0, 255]; // green
           c3 = [127, 127, 127, 127]; // gray

        }
          // compute barycentric weights
          let w_v1 = ((y_v2 - y_v3)*(p_x - x_v3) + (x_v3-x_v2)*(p_y - y_v3))/((y_v2 - y_v3)*(x_v1 - x_v3)+(x_v3-x_v2)*(y_v1-y_v3));
          let w_v2 = ((y_v3 - y_v1)*(p_x - x_v3) + (x_v1-x_v3)*(p_y - y_v3))/((y_v2 - y_v3)*(x_v1 - x_v3)+(x_v3-x_v2)*(y_v1-y_v3));
          let w_v3 = 1 - w_v1 - w_v2;

            // compute final rgb color using weights
            c1 = c1.map((x)=> parseInt(x*w_v1));
            c2 = c2.map((x)=> parseInt(x*w_v2));
            c3 = c3.map((x)=> parseInt(x*w_v3));

            rgbColor = [
              c1[0]+c2[0]+c3[0], 
              c1[1]+c2[1]+c3[1],
              c1[2]+c2[2]+c3[2],
              c1[3]+c2[3]+c3[3]
            ];

        // console.log('maxUmiThreshold2 ', maxUmiThreshold2);
        return rgbColor;
      }

      if (chosenItem2.length > 0){
        return getRGB2;
      }else{
        return getRGB1;
      }
    }

    let colormap = getGeneralColormap(chosenItem2, currentColorMap);
    setGeneralColormap(colormap);

  }, [chosenItem2.length, data, maxThreshold, maxThreshold2, currentColorMap]);

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
    getFillColor: d => chosenItem2.length>0?generalColormap(d.logcnt1, d.logcnt2):generalColormap(d.count),
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
    const fetchData = async () => {
      let regionArrayDataPath = `test_data2/s9f/regions_array.json`
      let regionArrayDataUrl = await getUrl(regionArrayDataPath);
      const readData = await fetch(regionArrayDataUrl)
       .then(response => response.json());

      setRegionTreeJson(readData);
      var tree_util = require('tree-util')
      var standardConfig =  { id : 'id', parentid : 'parentid'};
      var trees = tree_util.buildTrees(readData, standardConfig);
      setRegionTree(trees[0]);

    }
    if (regionTreeJson === null){ 
      fetchData();
    }else{
      var tree_util = require('tree-util')
      var standardConfig =  { id : 'id', parentid : 'parentid'};
      var trees = tree_util.buildTrees(regionTreeJson, standardConfig);
      setRegionTree(trees[0]);
    }


  },[]);

  useEffect(()=>{
    console.log('selectedRegions ', selectedRegions, regionTree);

    let data_tmp = null;
    if (chosenItem2.length>0){
      data_tmp = unidata.filter(bead => bead['count']>=lowerThreshold && bead['count']<=upperThreshold && bead['count2']>=lowerThreshold2 && bead['count2']<=upperThreshold2);
    }else{
      data_tmp = unidata.filter(bead => bead['count']>=lowerThreshold && bead['count']<=upperThreshold);
    }

    if(regionTree && selectedRegions.length>0){
      let data_tmp2 = data_tmp.filter(bead => {
        for (let i=0;i<selectedRegions.length; i++){
          let parent = regionTree.getNodeById(selectedRegions[i]);
          let child = regionTree.getNodeById(bead.rname);
          if (parent.isAncestorOf(child) || parent===child) return true;
        }
        return false;
      });
      let data = data_tmp2.sort((a,b) => (a.logcnt1+a.logcnt2 > b.logcnt1+b.logcnt2)?1:-1);
      // let data = data_tmp2.sort((a,b) => (a.count>b.count)?1:-1);
      setData(data);
    }else{
      let data = data_tmp.sort((a,b) => (a.logcnt1+a.logcnt2 > b.logcnt1+b.logcnt2)?1:-1);
      // let data = data_tmp.sort((a,b) => (a.count>b.count)?1:-1);
      // console.log(data);
      setData(data);
     }

  }, [maxThreshold, lowerThreshold, upperThreshold, lowerThreshold2, upperThreshold2, unidata, selectedRegions, regionTree]);

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
  
  // prepares tooltip based on whether chosenItem2 is present
  const prepareTooltip = (info) => {
    // check if chosenItem2 is present
    if (chosenItem2.length>0){
      return `${hoverKey}:${Math.round(info.object.count*1000)/1000}, ${hoverKey}2:${Math.round(info.object.count2*1000)/1000}, region:${info.object.rname}`;
    }else{
      return `${hoverKey}:${Math.round(info.object.count*1000)/1000}, region:${info.object.rname}`;
    } 
  }

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
            {prepareTooltip(hoverInfo)}
            {/* {hoverKey}:{Math.round(hoverInfo.object.count*1000)/1000}, {hoverKey}2:{Math.round(hoverInfo.object.count2*1000)/1000}, region:{hoverInfo.object.rname} */}
            {/* , {hoverInfo.object.x}, {hoverInfo.object.y} */}
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
