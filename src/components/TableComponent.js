import {useEffect, useRef, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table'
import BTable from 'react-bootstrap/Table';
import {usePersistStore} from '../store/store'
import {useSCComponentStore} from '../store/SCComponentStore'
import {useCSCPersistStore} from '../store/CSComponentStore' // needed to set CSaggregateBy on jump
import {useSCComponentPersistStore} from '../store/SCComponentStore'
import {useFilters, useBlockLayout} from 'react-table/dist/react-table.development';
import {matchSorter} from 'match-sorter'
import GeneOverviewPlot from './singlecell/GeneOverviewPlotComponent.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../css/Tooltip.css'
import {debounce} from 'lodash';
import {Button} from 'react-bootstrap'
// import {saveAs} from 'file-saver';
// import { CSVDownload } from "react-csv";
import { mkConfig, generateCsv, download } from "export-to-csv";



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
setMaxAvgVal, globalMaxAvgVal, downsampledTableData, initialHiddenCols, setHiddenCols, initPageSize, setCurPageSize, dataConfigCS, SCaggregateBy}) 
{

  const setCSAggregateBy = useCSCPersistStore(state => state.setAggregateBy);

  const {basePath, dpathFreqBarsJsons} = dataConfigCS;

  const chosenPuckid = usePersistStore(state => state.chosenPuckid);
  const setChosenPuckid = usePersistStore(state => state.setChosenPuckid);
  const setMaxProportionalVal = useSCComponentStore(state => state.setMaxProportionalVal);
  const currentColorMap = useSCComponentStore(state => state.currentColorMap);
  const maxProportionalVal = useSCComponentStore(state => state.maxProportionalVal);

  const hiddenCols = useSCComponentPersistStore(state => state.hiddenCols);

  let computedColor = (cFactor) => currentColorMap(cFactor); // cFactor = colorFactor

  const toCellSpatial = (inp_celltype, chosenPuckid, setChosenPuckid) => {

    const celltype = inp_celltype.replaceAll('-','_'); // replace all occurrences of - with _ in celltype
    // const celltype = inp_celltype.replace(/-/g,'_'); // also works 

      // get freqBar data for this celltype to derminne maxima puckid
    const fetchData = async (celltype) => {
      // let fbarsDataUrl = `https://storage.googleapis.com/bcdportaldata/cellspatial_data/freqbars/cell_jsons_s2c/${celltype}.json`
      let fbarsDataUrl = `${basePath}${dpathFreqBarsJsons}/${celltype}.json`
      const readData = await fetch(fbarsDataUrl)
        .then(response => response.json())
        .then(readData => {
          // find maxima pid
          const counts = readData.sorted_puckwise_cnts.map(o => o.cnt);
          const maxIdx = counts.indexOf(Math.max(...counts));
          const maximaPid = readData.sorted_puckwise_cnts[maxIdx].key[0];

          setChosenPuckid({...chosenPuckid, pid:maximaPid, cell:celltype, jumpFromSC:true});
          setCSAggregateBy(SCaggregateBy);
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
    const amd = cell.row.allCells[8].value; // retrive additionalMetadata value for this cluster
    if (cell.row.original.st==='Y'){
      return <><button className="btn btn-light btn-sm py-0" style={{borderWidth:"0", fontSize:12}} onClick={()=>{toCellSpatial(cell.value, chosenPuckid, setChosenPuckid)}}>{cell.value}</button> &nbsp;
        {amd!==""? <OverlayTrigger overlay={<Tooltip id="tooltip-top">{amd}</Tooltip>}>
                <FontAwesomeIcon icon={faCircleInfo} size="sm" color="#aaaaaa"/>
        </OverlayTrigger>:null} </>
    }else{
      return <><span style={{borderWidth:"0", fontSize:12, color:'#CCD1D1'}}>&nbsp;{cell.value}</span>&nbsp;
        {amd!==""? <OverlayTrigger overlay={<Tooltip id="tooltip-top">{amd}</Tooltip>}>
                <FontAwesomeIcon icon={faCircleInfo} size="sm" color="#aaaaaa"/>
        </OverlayTrigger>:null} </>
    }
  }
  // populate metadata columns
  else if (cell.column.id==='tr' || cell.column.id==='gs' || cell.column.id==='nt' || cell.column.id==='np' || cell.column.id==='npr'){
    return <span style={{borderWidth:"0", fontSize:12}}>{cell.value}</span>

  }else if (cell.column.id==='cld' || cell.column.id==='cc'){
    if (SCaggregateBy!=='none'){
      // console.log('cell.value', cell.value);
      const cld_name = cell.value.split(':')[0];
      return <button className="btn btn-light btn-sm py-0" style={{borderWidth:"0", fontSize:12}} onClick={()=>{toCellSpatial(cld_name, chosenPuckid, setChosenPuckid)}}>{cell.value}</button>
    }else{
      return <span style={{borderWidth:"0", fontSize:12}}>&nbsp;{cell.value}</span>
    }
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
    // rows,
    prepareRow,
    allColumns,
    setSortBy,
    pageOptions,
    pageCount,
    page,
    state: { sortBy, pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = useTable({
    columns,
    data,
    defaultColumn, 
    filterTypes,
    initialState: { 
      // sortBy: [{id: 'gs', desc: false}],
      hiddenColumns: initialHiddenCols,
      pageSize: initPageSize
    }, 
    disableSortRemove: true,
  }, 
  useFilters,
  useSortBy,
  usePagination,
  useBlockLayout,
  )

const debouncedSetSortBy = debounce(setSortBy, 600); // debounce setSortBy to prevent infinite loop

    useEffect(()=>{
      // set sortField
      console.log('sortBy', sortBy[0], 'sortField', sortField, 'sortOrder', sortOrder);
      if (sortBy[0]!==undefined){
        // setSortBy([{id: sortField, desc: sortOrder==='desc'?false:true}]);

        setSortField(sortBy[0].id);
        // setSortOrder(sortBy[0].desc?'asc':'desc');

      }else{ // if undefined
        console.log('entering undefined');
        // setSortBy([{id: sortField, desc: sortOrder==='desc'?true:false}]);
        debouncedSetSortBy([{id: sortField, desc: sortOrder==='desc'?true:false}]);
      }

    },[sortBy]); // sortBy changes

    useEffect(()=>{
      // if(sortBy[0].id!==sortField && sortBy[0].id!=='gs'){
      console.log('sortField', sortField, 'sortBy', sortBy, 'sortOrder', sortOrder);
      setSortBy([{id: sortField, desc: sortOrder==='desc'?true:false}]);
      // }   
    },[sortField]); // sortField set on adding/removing new gene


  // const firstPageRows = rows.slice(0, maxCellTypes);
  const firstPageRows = page.slice(0, pageSize);

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
  },[sortBy, columns.length, pageSize, adaptNormalizerStatus]);


  // // get all ids in allColumns
  // let allIds = allColumns.map(column=>column.id);

let hiddenIds = allColumns.filter(column=>column.isVisible===false).map(column=>column.id);

useEffect(()=>{

  // if hiddenCols not same as hiddenIds, set hiddenCols to hiddenIds
  // important check to prevent infinite loop
  if (hiddenCols.length!==hiddenIds.length || !hiddenCols.every((value, index) => value === hiddenIds[index])){  

    setHiddenCols(hiddenIds);
  }

},[JSON.stringify(hiddenIds)]) // hiddenCols changes
  
const handleDownloadMetadata = () => {

    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: "metadata" });

    // use allColumns to determine which keys to keep from data
    const selectedCols = allColumns.map(column => {
        // console.log('column', column.id, column.isVisible, column.Header, column.disableSelector, column.isDotplot);
      if (!column.isDotplot && !column.disableSelector && column.isVisible) 
      {
        // select these columns from data
        return [column.id, column.Header]; // need to keep track of both id and corresponding header


      }else if (SCaggregateBy==='metacluster' && column.id==='cld'){
        return [column.id, column.Header]; // need to keep track of both id and corresponding header
      }else if (SCaggregateBy==='cellclass' && column.id==='cc'){
        return [column.id, column.Header]; // need to keep track of both id and corresponding header
      }

    }).filter(function (el) {
      return el != null;
    });

    // get selected columns from data

    const selectedData = data.map(row => {
      const newRow = {};
      selectedCols.forEach(col => {
          newRow[col[1]] = row[col[0]]; // col[1] is header, col[0] is id
      });
      return newRow;
    });
    

    const dataCsv = generateCsv(csvConfig)(selectedData);
    download(csvConfig)(dataCsv);

    // console.log('selectedCols', selectedCols, selectedData);

  }

const handleDownloadAvgExpression = () => {
    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: "avgExpression" });

    // use allColumns to determine which keys to keep from data
    const selectedCols = allColumns.map(column => {
        // console.log('column', column.id, column.isVisible, column.Header, column);
      if ((column.isDotplot && !column.disableSelector && column.isVisible)) 
      {
        // select these columns from data
        return [column.id, column.Header]; // need to keep track of both id and corresponding header

      }else if (SCaggregateBy==='none' && column.id==='ct'){
        return [column.id, column.Header]; // need to keep track of both id and corresponding header
      }
      else if (SCaggregateBy==='metacluster' && column.id==='cld'){
        return [column.id, column.Header]; // need to keep track of both id and corresponding header
      }else if (SCaggregateBy==='cellclass' && column.id==='cc'){
        return [column.id, column.Header]; // need to keep track of both id and corresponding header
      }


    }).filter(function (el) {
      return el != null;
    });

  let firstCol = 'ct';
  if (SCaggregateBy==='metacluster')
    firstCol = 'cld';
  else if (SCaggregateBy==='cellclass')
    firstCol = 'cc';

  console.log('selectedCols', selectedCols, data);
    // get selected columns from data

    const selectedData = data.map(row => {
      const newRow = {};
      selectedCols.forEach(col => {
        if (col[0]===firstCol){
          newRow[col[1]] = row[col[0]]; // col[1] is header, col[0] is id, case of celltype
        }else{
          newRow[col[1]] = Math.round(row[col[0]][1]*10000)/10000; // col[1] is header, col[0] is id
        }
      });
      return newRow;
    });
    

    const dataCsv = generateCsv(csvConfig)(selectedData);
    download(csvConfig)(dataCsv);

    // console.log('selectedCols', selectedCols, selectedData);


}


const handleDownloadPctExpression = () => {

    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: "percentExpression" });

    // use allColumns to determine which keys to keep from data
    const selectedCols = allColumns.map(column => {
      if ((column.isDotplot && !column.disableSelector && column.isVisible) || column.id==='ct') 
      {
        console.log('column', column.id, column.isVisible, column.Header, column);
        // select these columns from data
        return [column.id, column.Header]; // need to keep track of both id and corresponding header


      }

    }).filter(function (el) {
      return el != null;
    });

  let firstCol = 'ct';
  if (SCaggregateBy==='metacluster')
    firstCol = 'cld';
  else if (SCaggregateBy==='cellclass')
    firstCol = 'cc';


    // get selected columns from data

    const selectedData = data.map(row => {
      const newRow = {};
      selectedCols.forEach(col => {
        if (col[0]===firstCol){
          newRow[col[1]] = row[col[0]]; // col[1] is header, col[0] is id, case of celltype
        }else{
          newRow[col[1]] = Math.round(row[col[0]][0]*10000)/100; // col[1] is header, col[0] is id
        }
      });
      return newRow;
    });
    
    const dataCsv = generateCsv(csvConfig)(selectedData);
    download(csvConfig)(dataCsv);

}

  // Render the UI for table
  return (
    <>
    <div>
        <div>
        </div>
        {allColumns.map(column => {
          if (!column.isDotplot && !column.disableSelector) // only show checkboxes for non dotplot columns and not disabled
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
      <div className="pt-2">
        Export to CSV:&nbsp;
                    <OverlayTrigger overlay={<Tooltip id="tooltip-top">Export currently selected data in CSV format. Metadata, AvgExpression, and PercentExpression matrices can be downloaded using the buttons on right.</Tooltip>}>
                      <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#aaaaaa"/>
                    </OverlayTrigger>
        <Button className="mx-2" variant="outline-secondary" size="sm" onClick={handleDownloadMetadata}>Metadata</Button>
        <Button className="mx-2" variant="outline-secondary" size="sm" onClick={handleDownloadAvgExpression}>AvgExpression</Button>
        <Button className="mx-2" variant="outline-secondary" size="sm" onClick={handleDownloadPctExpression}>PercentExpression</Button>
      </div>
      <div className="pt-2">
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
          <tbody {...getTableBodyProps()} style={{borderTop:"none", borderColor:"#dee2f4"}}>
            {
              page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}   >
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{renderCell(cell, chosenPuckid, setChosenPuckid, maxProportionalVal)}</td>
                    })}
                  </tr>
                )
              })}
          </tbody>
        </BTable>
      </div>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
            setCurPageSize(Number(e.target.value)) // set curPageSize in persist store for GetLink
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
