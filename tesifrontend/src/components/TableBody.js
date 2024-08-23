import React from 'react';
import TableRow from './TableRow';

function TableBody({columns,data,onRowClick}) {
  return (
    <tbody>
      {
        data.map((item,index) => (
            <TableRow 
              key={item.ticker}  
              columns={columns} 
              item={item} 
              onClick={()=> onRowClick(item)}
            />
        ))
      }
    </tbody>
  );
};

export default TableBody;