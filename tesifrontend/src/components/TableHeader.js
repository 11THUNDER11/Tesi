import React from "react";

function TableHeader({columns,sortData,sortConfig}){
    
    const handleSort = (key) => {
        sortData(key);
    };
    
    return(
        <thead>
            <tr>
                {
                    columns.map((column, index) => (
                        <th 
                            key={column}
                            onClick={() => handleSort(column)}
                            style={{ cursor: 'pointer' }}
                            className={sortConfig && sortConfig.key === column
                                ? sortConfig.direction === 'ascending'
                                  ? 'sorted-ascending'
                                  : 'sorted-descending'
                                : ''}
                        >
                            {column}
                            {sortConfig && sortConfig.key === column ? (
                                sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'
                            ) : null}
                        </th>
                    ))
                }
            </tr>
        </thead>
    );
}

export default TableHeader;