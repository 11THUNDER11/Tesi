import React from 'react';
import TableRow from './TableRow';

function TableBody({columns,data}) {
  return (
    <tbody>
      {
        data.map((item,index) => (
            <TableRow key={index}  columns={columns} item={item} />
        ))
      }
    </tbody>
  );
};

export default TableBody;