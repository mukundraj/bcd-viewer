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
import {useStore} from '../store/store'
import DendroBars from "./DendroBarsComponent"

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

  const setTogglePid = useStore(state => state.setTogglePid);
  const toggleGeneralToggleFlag = useStore(state => state.toggleGeneralToggleFlag);

  const [data, setData] = useState({"label": "Root", "value":"root"})
  const chosenGene = useStore(state => state.chosenGene);
  
  // const dendroBarData = useStore(state => state.dendroBarData);
  const setSelectedRegions = useStore(state => state.setSelectedRegions);
  const setDendroBarData = useStore(state => state.setDendroBarData);

  const target = React.useRef(null)
  const size = useSize(target)



  const onChange = (currentNode, selectedNodes) => {

    const fetchAndSetBarData = async (currentRegId, selectedRegIds) => {
      let regionTreeDataPath = `test_data2/s9f/gene_jsons_s9f/${chosenGene}.json`
      let regionTreeDataUrl = await getUrl(regionTreeDataPath);
      const readData = await fetch(regionTreeDataUrl)
       .then(response => response.json());
      console.log(selectedRegIds);

      let curDendroBarData = [...Array(101).keys()].map(x=>0);

      selectedRegIds.map(regId =>{
        
        let readDataArray = readData[parseInt(regId)].puck_dist;
        for (let i=0; i<curDendroBarData.length;i++){
          curDendroBarData[i] += readDataArray[i];
        }
      });
      // console.log(curDendroBarData);
      setDendroBarData(curDendroBarData);

    }
    let selectedRegIds = selectedNodes.map(x => x.value);
    let selectedRegNames = selectedNodes.map(x => x.label);
    if (selectedRegNames.length>0)
      setSelectedRegions(selectedRegNames);
    else
      setSelectedRegions([]);
    // console.log(selectedRegIds, currentNode.value, selectedRegIds.includes(currentNode.value));
      // console.log('onChange::', currentNode, selectedNodes)
    fetchAndSetBarData(currentNode.value, selectedRegIds);
  }
  const onAction = (node, action) => {
    console.log('onAction::', action, node, action.maxval_pid)
    setTogglePid(action.maxval_pid);
    toggleGeneralToggleFlag();
  }
  const onNodeToggle = currentNode => {
    console.log('onNodeToggle::', currentNode)
  }



  // loading dendro data
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
      // setDendroData(readData["children"]);


      // setCoordsData(readData);
      // setMaxUmiThreshold(parseFloat(readData['maxCount']));
      // setMaxUmiThreshold(parseFloat(readData[maxCountMetadataKey]));
      // setDataLoadStatus((p)=>({...p, metadata:p.metadata+1}));
    }
    fetchData();
    
    // console.log(data);

  }, []);
  

  return(
    <>
      <DendroBars/>
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
