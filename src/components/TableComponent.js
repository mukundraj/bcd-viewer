import {useEffect, useRef, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table'
import BTable from 'react-bootstrap/Table';
import {usePersistStore} from '../store/store'
import {useSCComponentStore} from '../store/SCComponentStore'

  const toCellSpatial = (celltype, chosenPuckid, setChosenPuckid) => {


      // get freqBar data for this celltype to derminne maxima puckid
    const fetchData = async (celltype) => {
      let fbarsDataUrl = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/freqbars/cell_jsons_s2c/${celltype}.json`
      const readData = await fetch(fbarsDataUrl)
        .then(response => response.json())
        .then(readData => {
          // find maxima pid
          const counts = readData.sorted_puckwise_cnts.map(o => o.cnt);
          const maxIdx = counts.indexOf(Math.max(...counts));
          const maximaPid = readData.sorted_puckwise_cnts[maxIdx].key[0];

          setChosenPuckid({...chosenPuckid, pid:maximaPid, cell:celltype});
          // navigate('/cellspatial');
          window.open('/cellspatial', '_blank'); // https://stackoverflow.com/questions/71793116/open-new-tab-with-usenavigate-hook-in-react
          return readData;
        } )
        .catch(error => {
          alert("Could not find spatial data for this cell type");
          console.log(error);
          return undefined;
        });

    }

      // get celltype freqbar data and set maxima pid
      fetchData(celltype);

  }

// produces cell contents to render based on column and cell value
const renderCell = (cell, chosenPuckid, setChosenPuckid) => {


  // populate celltype column
  if (cell.column.id==='ct'){
    if (cell.row.original.st==='Y'){
      return <button className="btn btn-light btn-sm py-0" style={{borderWidth:"0", fontSize:12}} onClick={()=>{toCellSpatial(cell.value, chosenPuckid, setChosenPuckid)}}>{cell.value}</button>
    }else{
      return <span style={{borderWidth:"0", fontSize:12, color:'#CCD1D1'}}>&nbsp;{cell.value}</span>
    }
  }
  // populate metadata columns
  else if (cell.column.id==='cc' || cell.column.id==='tr' || cell.column.id==='gs' || cell.column.id==='nt' || cell.column.id==='np' || cell.column.id==='npr'){
    return <span style={{borderWidth:"0", fontSize:12}}>{cell.value}</span>

  }
  // populate dotplot columns
  else{
    return cell.value?`${cell.value[0]}, ${cell.value[1]}`:null;

  }

}


export default function Table({ columns, data, sortField, setSortField, sortOrder, setSortOrder, adaptNormalizerStatus, 
maxCellTypes, setMaxAvgVal, globalMaxAvgVal, sortByToggleVal}) 
{

  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);
  const setMaxProportionalVal = useSCComponentStore(state => state.setMaxProportionalVal);




  // Use the state and functions returned from useTable to build UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    setSortBy,
    state: { sortBy },
  } = useTable({
    columns,
    data,
    initialState: { 
      // sortBy: [{id: 'gs', desc: false}],
      hiddenColumns: ['nt', 'np', 'npr'],
    }, 
    disableSortRemove: true,
  }, 
  useSortBy)

    useEffect(()=>{
      // set sortField
      console.log('sortBy', sortBy[0], 'sortField', sortField, 'sortOrder', sortOrder);
      if (sortBy[0]!==undefined){
        // setSortBy([{id: sortField, desc: sortOrder==='desc'?false:true}]);

        setSortField(sortBy[0].id);
        // setSortOrder(sortBy[0].desc?'asc':'desc');

      }else{ // if undefined
        console.log('entering undefined');
        setSortBy([{id: sortField, desc: sortOrder==='desc'?true:false}]);
      }

    },[sortBy]); // sortBy changes

    useEffect(()=>{
      // if(sortBy[0].id!==sortField && sortBy[0].id!=='gs'){
      console.log('sortField', sortField, 'sortBy', sortBy, 'sortOrder', sortOrder);
      setSortBy([{id: sortField, desc: sortOrder==='desc'?true:false}]);
      // }   
    },[sortField]); // sortField set on adding/removing new gene


  const firstPageRows = rows.slice(0, maxCellTypes);

    useEffect(()=>{
    let proportionVals = [], avgVals = [];
    if (adaptNormalizerStatus){
      firstPageRows.forEach(row=>{

        // console.log('row', row.values)
        for (let key in row.values){
          if (Array.isArray(row.values[key])){
          // console.log('key', row.values[key])
            proportionVals.push(row.values[key][0]);
            avgVals.push(row.values[key][1]);
          }
        }


      });
      console.log('proportionVals',Math.max(...proportionVals), Math.max(...avgVals));
      setMaxProportionalVal(Math.max(...proportionVals)||Number.MIN_VALUE);
      setMaxAvgVal(Math.max(...avgVals));

    }else{
      setMaxProportionalVal(1);
      setMaxAvgVal(globalMaxAvgVal);
    }
  },[sortBy, columns.length, maxCellTypes]);


  

  // Render the UI for table
  return (
    <>
    <div>
        <div>
        </div>
        {allColumns.map(column => {
          if (!column.isDotplot) // only show checkboxes for non dotplot columns
          return (
          <span key={column.id} style={{padding:'0px 10px'}}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
              {column.render('Header')}
            </label>
          </span>
        )
          else return null;
      })}
        <br />
      </div>
    <BTable striped bordered hover size="sm" {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())} title={column.canSort ? `Toggle sort by ${column.render('Header')}` : ""}>{column.render('Header')}
                {/* Add a sort direction indicator */}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                      : ''}
                  </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {firstPageRows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{renderCell(cell, chosenPuckid, setChosenPuckid)}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </BTable>
    </>
  )
}
