
const TableHead = ({columns}) => {

  let tableDataInner = null;
  if (columns.length > 1){
    tableDataInner = 
          columns.map(({ label, accessor }) => {
            return <th key={accessor}>{label}</th>;
          })
  }
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
