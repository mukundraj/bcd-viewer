
// import { useState } from "react";
import {useStore} from '../../store/store'
export const useSortableTable = (data) => {
 // const [tableData, setTableData] = useState(data);

  // const tableDataSorted = useStore(state => state.tableDataSorted);
  const setTableDataSorted = useStore(state => state.setTableDataSorted);

 const handleSorting = (sortField, sortOrder) => {
   // console.log("sortField", sortField, data);
  console.log("sortfield", sortField);
  if (sortField) {
   const sorted = [...data].sort((a, b) => {
    if (a[sortField] === null) return 1;
    if (b[sortField] === null) return 0;
    if (a[sortField] === null && b[sortField] === null) return 0;
    return (
     a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
      numeric: true,
     }) * (sortOrder === "asc" ? 1 : -1)
    );
   });
   // setTableData(sorted);
    setTableDataSorted(sorted);
   // console.log("sorted", sorted);
  }
 };

 return [handleSorting];
};
