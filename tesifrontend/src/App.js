import React, { useState } from 'react';
import './App.css';
import Table from './components/Table';

import { columns as initialColumns, data as initialData } from './mockData';

function App() {

  const [columns, setColumns] = useState(initialColumns);  // Colonne dinamiche
  const [data, setData] = useState(initialData);  // Dati dinamici
  
  return (
    <div className="App">
      
      <Table columns={columns} data={data} />


    </div>
  );
}

export default App;
