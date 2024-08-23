import React, { useState,useMemo } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import DetailView from './DetailView';

const Table = ({ columns, data }) => {

  const [sortConfig, setSortConfig] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // Stato per la riga selezionata
  const sortedData = useMemo(() => {
    if (sortConfig === null) return data;

    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);


  const sortData = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

  }

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    setSelectedItem(null); // Deseleziona l'elemento
  };

  return (

    <div>
      {selectedItem ? (
        <DetailView item={selectedItem} onBackClick={handleBackClick} />
      ) : (

        <table>
        <TableHeader columns={columns} sortData={sortData} sortConfig={sortConfig}/>
        <TableBody columns={columns} data={sortedData} onRowClick={handleRowClick} />
      </table>

      )}
    </div>

    
  );
};

export default Table;