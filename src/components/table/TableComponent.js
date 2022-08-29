import React from 'react'
import { useState } from "react";
import TableBody from "./TableBodyComponent";
import TableHead from "./TableHeadComponent";
import useResizeObserver from '@react-hook/resize-observer'
import { Scrollbars } from 'react-custom-scrollbars-2';
import './Table.css'

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

  const target = React.useRef(null)
  const size = useSize(target)

  let tableStyle = (width)=>{return {width:`${width}%`, height:"100%"}}
 return (
  <>
    <div className="add-border floater" style={tableStyle(width)} ref={target}>
      <Scrollbars style={{ width: size?size.width:300, height: size?size.height:100}}>
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
