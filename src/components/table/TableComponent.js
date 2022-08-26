import React from 'react'
import { useState } from "react";
import TableBody from "./TableBodyComponent";
import TableHead from "./TableHeadComponent";
import useResizeObserver from '@react-hook/resize-observer'
import { Scrollbars } from 'react-custom-scrollbars-2';

const useSize = (target) => {
  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size;
}
const Table = ({columns, tableData, maxCellTypes}) => {

 // const columns = [
 //  { label: "Full Name", accessor: "full_name" },
 //  { label: "Email", accessor: "email" },
 //  { label: "Gender", accessor: "gender" },
 //  { label: "Age", accessor: "age" },
 //  { label: "Start date", accessor: "start_date" },
 // ];

  const target = React.useRef(null)
  const size = useSize(target)

 return (
  <>
    <div className="add-border floater" style={{"width":"66%", "height":"100%"}} ref={target}>
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

