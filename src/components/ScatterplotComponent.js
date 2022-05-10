import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {COORDINATE_SYSTEM} from '@deck.gl/core'
import {PointCloudLayer} from '@deck.gl/layers'
import {OrthographicView} from '@deck.gl/core';
import {useCallback, useState} from 'react'

function Scatterplot({data}) {
  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */
  console.log(data);
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
    getFillColor: d => [255, 140, 0],
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

  return <DeckGL initialViewState={viewState}
    views={ortho_view}
    layers={[layer]}
    controller={true}
    onViewStateChange={onViewStateChange}
  />;
}

export default Scatterplot;
