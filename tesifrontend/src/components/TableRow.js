import React from 'react';
import TableCell from './TableCell';

function TableRow({columns,item}){
    
    return (
        <tr>
            {
                columns.map((column , index )=>{
                    //const key = column.toLowerCase();
                    return (
                        <TableCell key={index} content={item[column]}/>
                    );
                })
            }
        </tr>
    );
}

export default TableRow;