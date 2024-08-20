import React from "react";

function TableHeader({columns}){
    return(
        <thead>
            <tr>
                {
                    columns.map((column, index) => (
                        <th key={index}>{column}</th>
                    ))
                }
            </tr>
        </thead>
    );
}

export default TableHeader;