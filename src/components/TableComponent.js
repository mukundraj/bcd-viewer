import {useEffect, useRef, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table'
import BTable from 'react-bootstrap/Table';
import {usePersistStore} from '../store/store'
import {useSCComponentStore} from '../store/SCComponentStore'
import {useFilters, useBlockLayout} from 'react-table/dist/react-table.development';
import {matchSorter} from 'match-sorter'
import GeneOverviewPlot from './singlecell/GeneOverviewPlotComponent.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../css/Tooltip.css'


function fuzzySearchMultipleWords(
  rows, // array of data [{a: "a", b: "b"}, {a: "c", b: "d"}]
  filterValue, // potentially multi-word search string "two words"
  keys, // keys to search ["a", "b"]
) {
  if (!filterValue || !filterValue.length) {
    return rows
  }

  const terms = filterValue.split(' ')
  if (!terms) {
    return rows
  }

  // reduceRight will mean sorting is done by score for the _first_ entered word.
  return terms.reduceRight(
    (results, term) => matchSorter(results, term, keys),
    rows,
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {

  let keys = [{threshold:matchSorter.rankings.WORD_STARTS_WITH, key:row => row.values[id].replace(/-/g,' ')}] // replacing - with space for cell cluster column

  return fuzzySearchMultipleWords(rows, filterValue, {keys:keys})
  // return matchSorter(rows, filterValue, { keys: [row=>row.values[id]})
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val


export default function Table({ columns, data, sortField, setSortField, sortOrder, setSortOrder, adaptNormalizerStatus, 
maxCellTypes, setMaxAvgVal, globalMaxAvgVal, downsampledTableData}) 
{

  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);
  const setMaxProportionalVal = useSCComponentStore(state => state.setMaxProportionalVal);
  const currentColorMap = useSCComponentStore(state => state.currentColorMap);
  const maxProportionalVal = useSCComponentStore(state => state.maxProportionalVal);


  let computedColor = (cFactor) => currentColorMap(cFactor); // cFactor = colorFactor

  const toCellSpatial = (inp_celltype, chosenPuckid, setChosenPuckid) => {

    const celltype = inp_celltype.replaceAll('-','_'); // replace all occurrences of - with _ in celltype
    // const celltype = inp_celltype.replace(/-/g,'_'); // also works 

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
          alert(`Could not find spatial data for this cell type ${celltype}`);
          console.log(error);
          return undefined;
        });

    }

      // get celltype freqbar data and set maxima pid
      fetchData(celltype);

  }


  let radius = 15;
// produces cell contents to render based on column and cell value
const renderCell = (cell, chosenPuckid, setChosenPuckid, maxProportionalVal) => {


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

  }else if (cell.column.id==='cld'){
          return <span style={{borderWidth:"0", fontSize:12}}>&nbsp;{cell.value}</span>
  }
  // populate dotplot columns
  else{

    const pct = cell.value[0];
    const avg = cell.value[1];
    const tData = Math.min(1,pct/maxProportionalVal); // min function to deal dom flicker fleetingly showing giant dots
    const rFactor = isNaN(tData)?0:tData;
    return (
      <span style={{width:`${rFactor*radius}px`, height:`${rFactor*radius}px`, backgroundColor:computedColor(avg)}} className="dot sctooltip">
        <span className="sctooltiptext">{Math.round(avg*100)/100}, {Math.round(pct*100)}%</span>
      </span>
    )

    // return cell.value?`${cell.value[0]}, ${cell.value[1]}`:null;

  }

}


  // Define a default UI for filtering
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length

    return (
      <input style={{width:'100%', height:'100%', fontSize:12}}
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    )
  }


    const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )


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
    defaultColumn, 
    filterTypes,
    initialState: { 
      // sortBy: [{id: 'gs', desc: false}],
      hiddenColumns: ['nt', 'np', 'npr', 'cld'],
    }, 
    disableSortRemove: true,
  }, 
  useFilters,
  useSortBy,
  useBlockLayout,
  )

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
      console.log('proportionVals', 1, globalMaxAvgVal);
      setMaxProportionalVal(1);
      setMaxAvgVal(globalMaxAvgVal);
    }
  },[sortBy, columns.length, maxCellTypes, adaptNormalizerStatus]);


  

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
              <th {...column.getHeaderProps(column.getSortByToggleProps())} title="" >
                {column.render('Header')}&nbsp;
                <OverlayTrigger overlay={<Tooltip id="tooltip-top">{column.helpText}</Tooltip>}>
                <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                  </OverlayTrigger>
                {(column.isDotplot && Array.isArray(downsampledTableData[column.id]))?<div><GeneOverviewPlot downsampledData={downsampledTableData[column.id]} numCols={0} /></div> : null}
                {/* Add a sort direction indicator */}
                <div title={column.canSort ? `Toggle sort by ${column.render('Header')}` : ""}>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                      : ''}
                </div>
                {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
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
                return <td {...cell.getCellProps()}>{renderCell(cell, chosenPuckid, setChosenPuckid, maxProportionalVal)}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </BTable>
    </>
  )
}
