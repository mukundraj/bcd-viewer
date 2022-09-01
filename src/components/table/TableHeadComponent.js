import { useState } from 'react';
import {useStore} from '../../store/store'

const TableHead = ({columns, handleSorting}) => {

  // const [sortField, setSortField] = useState("");
  // const [order, setOrder] = useState("asc");

  const sortField = useStore(state => state.sortField);
  const setSortField = useStore(state => state.setSortField);
  const order = useStore(state => state.order);
  const setOrder = useStore(state => state.setOrder);

  const handleSortingChange = (accessor) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  let tableDataInner = null;
    tableDataInner = 
          columns.map(({ label, accessor, sortable }) => {
            const cl = sortable
     ? sortField === accessor && order === "asc"
      ? "up"
      : sortField === accessor && order === "desc"
      ? "down"
      : "default"
     : "";
            return <th key={accessor} 
              onClick={() => handleSortingChange(accessor)}
              className={cl} >
              <pre>{label}</pre>
            </th>;
          })
  return(
    <>
      <thead>
        <tr>
          {tableDataInner}
        </tr>
      </thead>
    </>
  )
};

export default TableHead;
