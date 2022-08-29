import React from 'react'
import { useState, useRef, useEffect } from "react";
import TableBody from "./TableBodyComponent";
import TableHead from "./TableHeadComponent";
import useResizeObserver from '@react-hook/resize-observer'
import { Scrollbars } from 'react-custom-scrollbars-2';
import './Table.css'
import {useStore} from '../../store/store'

const useSize = (target) => {
  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size;
}
const Table = ({columns, tableData, maxCellTypes, width}) => {

 // const columns = [
 //  { label: "Full Name", accessor: "full_name" },
 //  { label: "Email", accessor: "email" },
 //  { label: "Gender", accessor: "gender" },
 //  { label: "Age", accessor: "age" },
 //  { label: "Start date", accessor: "start_date" },
 // ];
  
  const scTableScrollTop = useStore(state => state.scTableScrollTop);
  const setScTableScrollTop = useStore(state => state.setScTableScrollTop);

  const target = React.useRef(null)
  const size = useSize(target)

  let tableStyle = (width)=>{return {width:`${width}%`, height:"100%"}}

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
        <table className="table">
          <caption>
            Todo: make columns sortable, extract useSize to global scope, sync scroll, fill remaing space in viewport
          </caption>
          <TableHead columns={columns} />
          <TableBody columns={columns} tableData={tableData.slice(0, maxCellTypes)} maxCellTypes={maxCellTypes}/>
        </table>
      </Scrollbars>
    </div>
  </>
 );
};

export default Table;

// https://stackoverflow.com/questions/44752138/in-react-how-to-pass-a-dynamic-variable-to-a-const-css-style-list
