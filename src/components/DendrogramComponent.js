import React from 'react'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import {getUrl} from "../shared/common"
import "../css/Dendrogram.css";
import useResizeObserver from '@react-hook/resize-observer'
import { Scrollbars } from 'react-custom-scrollbars-2';
import 'font-awesome/css/font-awesome.min.css';

const useSize = (target) => {
  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

function Dendrogram(props){

  const [data, setData] = useState({"label": "Root", "value":"root"})

  const target = React.useRef(null)
  const size = useSize(target)

  const onChange = (currentNode, selectedNodes) => {
    console.log('onChange::', currentNode, selectedNodes)
  }
  const onAction = (node, action) => {
    console.log('onAction::', action, node, action.maxval_pid)
    props.setPuckidAndLoadStatus(action.maxval_pid);
  }
  const onNodeToggle = currentNode => {
    console.log('onNodeToggle::', currentNode)
  }

  useEffect(()=>{
    console.log("sizes", size)

  }, [size])

  // loading frequency bar plot data
  useEffect(()=>{
    
    const fetchData = async () => {
      let regionTreeDataPath = `test_data2/s9f/regions.json`
      let regionTreeDataUrl = await getUrl(regionTreeDataPath);
      // let meta_data_path2 = 'https://storage.googleapis.com/ml_portal/test_data/gene_jsons/puck1/metadata_gene_Pcp4.json'
      // console.log('meta_data_path ', meta_data_path);
      // console.log('meta_data_path ', meta_data_path2);
      const readData = await fetch(regionTreeDataUrl)
       .then(response => response.json());
        // .then(data_str => JSON.parse(data_str));


      // console.log(readData);
      setData(readData["children"]);
      // setCoordsData(readData);
      // setMaxUmiThreshold(parseFloat(readData['maxCount']));
      // setMaxUmiThreshold(parseFloat(readData[maxCountMetadataKey]));
      // setDataLoadStatus((p)=>({...p, metadata:p.metadata+1}));
    }
    fetchData();
    
    console.log(data);

  }, []);
  

  return(
    <>
      <div>Barplot</div>
      <div className="tree-inner-wrap" style={{"width":"90%", "height":"90%"}} ref={target}>
        <Scrollbars style={{ width: size?size.width:100, height: size?size.height:100}}>
          <DropdownTreeSelect
            data={data} 
            onChange={onChange} onAction={onAction} 
            onNodeToggle={onNodeToggle} 
            keepTreeOnSearch={true}
            keepChildrenOnSearch={false}
            showDropdown="initial"
          />
        </Scrollbars>
      </div>
    </>
  );
}

export default React.memo(Dendrogram, (prevProps,nextProps)=>true);

// https://stackoverflow.com/questions/23116591/how-to-include-a-font-awesome-icon-in-reacts-render
// Actions example for Dropdown tree select - https://codesandbox.io/s/5vy246kzlk
// fa icon https://fontawesome.com/v4/icon/level-up
// Preventing rerendering https://stackoverflow.com/questions/59564601/how-to-avoid-rerendering-of-child-component
