import React from 'react'
import { useState, useRef, useEffect } from "react";
import TableBodyGeneric from "./TableBodyGenericComponent";
import TableHeadGeneric from "./TableHeadGenericComponent";
import useResizeObserver from '@react-hook/resize-observer'
import { Scrollbars } from 'react-custom-scrollbars-2';
import './Table.css'
import {useStore} from '../../store/store'
import { useSortableTable } from "./hooks";
import useSize from '../../hooks/useSize'

const TableGeneric = ({columns, tableDataSorted, maxRows, width, handleSorting, setDataLoadStatus}) => {

  const target = React.useRef(null)
  const size = useSize(target)

  let tableStyle = (width)=>{return {width:`${width}%`, height:"90%"}}

 return (
  <>
    <div className="add-border floater" style={tableStyle(width)} ref={target}>
      <Scrollbars style={{ width: size?size.width:300, height: size?size.height:100}}
        // Runs inside the animation frame. Passes some handy values about the current scroll position
      >
        <table className="sctable">
          {/* <caption> */}
          {/* </caption> */}
          <TableHeadGeneric columns={columns} handleSorting={handleSorting}/>
          <TableBodyGeneric columns={columns} tableDataSorted={tableDataSorted.slice(0, maxRows)} setDataLoadStatus={setDataLoadStatus} />
        </table>
      </Scrollbars>
    </div>
  </>
 );
};

export default TableGeneric;
