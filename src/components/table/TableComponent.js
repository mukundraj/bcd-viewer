import React from 'react'
import { useState, useRef, useEffect } from "react";
import TableBody from "./TableBodyComponent";
import TableHead from "./TableHeadComponent";
import useResizeObserver from '@react-hook/resize-observer'
import { Scrollbars } from 'react-custom-scrollbars-2';
import './Table.css'
import {useStore} from '../../store/store'
import { useSortableTable } from "./hooks";
import useSize from '../../hooks/useSize'

const Table = ({columns, tableDataSorted, maxCellTypes, width, handleSorting}) => {

  const scTableScrollTop = useStore(state => state.scTableScrollTop);
  const setScTableScrollTop = useStore(state => state.setScTableScrollTop);

  const target = React.useRef(null)
  const size = useSize(target)

  let tableStyle = (width)=>{return {width:`${width}%`, height:"90%"}}

  const scrollbarElement = useRef();
  let handleScrollFrame = function(...args){
    // scrollbarElement.current.scrollTop(0);
    // scrollbarElement.current.scrollToTop();
    // console.log(args[0].top, args[0].scrollTop);
    setScTableScrollTop(args[0].scrollTop);
  }

  useEffect(()=>{
    console.log(scrollbarElement.current.getScrollTop(), scTableScrollTop);

    // if (scrollbarElement.current.getScrollTop()!== scTableScrollTop){
      scrollbarElement.current.scrollTop(scTableScrollTop);
        // scrollbarElement.current.scrollToTop();
    // }
  }, [scTableScrollTop]);


 return (
  <>
    <div className="add-border floater" style={tableStyle(width)} ref={target}>
      <Scrollbars style={{ width: size?size.width:300, height: size?size.height:100}}
        // Runs inside the animation frame. Passes some handy values about the current scroll position
        onScrollFrame={handleScrollFrame}
        ref={scrollbarElement}
      >
        <table className="sctable">
          {/* <caption> */}
          {/* </caption> */}
          <TableHead columns={columns} handleSorting={handleSorting}/>
          <TableBody columns={columns} tableDataSorted={tableDataSorted.slice(0, maxCellTypes)} maxCellTypes={maxCellTypes}/>
        </table>
      </Scrollbars>
    </div>
  </>
 );
};

export default Table;

// https://stackoverflow.com/questions/44752138/in-react-how-to-pass-a-dynamic-variable-to-a-const-css-style-list
