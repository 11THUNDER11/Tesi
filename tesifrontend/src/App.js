import React, { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';

import { columns as initialColumns} from './mockData';

/**
 * TODO : 
 * inserire criteri di ordinamento nella tabella 
 * - ordinamento per nome
 * - ordinamento per prezzo
 * - ordinamento ascendente / discentente
 * 
 * 
 */


function App() {

  const [columns, setColumns] = useState(initialColumns);  // Colonne dinamiche
  const [data, setData] = useState([]);  // Dati dinamici
  const [connected, setConnected] = useState(false); // Stato per tracciare la connessione WebSocket
  
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('Connesso al server WebSocket');
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'results') {
        console.log('Risultati scraping ricevuti:', data.data);
        setData(data.data); // Aggiorna i dati
      }
    };

    socket.onclose = () => {
      console.log('Connessione WebSocket chiusa');
      setConnected(false);
    };

    return () => socket.close(); // Chiude la connessione WebSocket quando il componente si smonta
  }, []);


  if(data.length === 0){
    return (
      <div className="App">
        <div className="loading-message">
          <div className="spinner"></div>
          <h2>In attesa di dati...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Table columns={columns} data={data} />
    </div>
  );
}

export default App;
