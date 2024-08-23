import React from 'react';

const DetailView = ({ item, onBackClick }) => {
  return (
    <div className="detail-view">
      <button onClick={onBackClick} style={{ marginBottom: '20px' }}>Back</button>
      <h2>Dettagli per {item.ticker}</h2>
      <p><strong>Nome :</strong> {item["Company name"]}</p>
      <p><strong>Prezzo :</strong> {item.price}</p>
      <p><strong>Valutazione :</strong> {item.valuation}</p>
      <p><strong>Chiusura precedente :</strong> {item["Previous Close"]}</p>
      <p><strong>Apertura :</strong> {item["Open"]}</p>
      <p><strong>Prezzo bid :</strong> {item["Bid"]}</p>
      <p><strong>Prezzo ask :</strong> {item["Ask"]}</p>
      <p><strong>Variazione giornaliera :</strong> {item["Day's Range"]}</p>
      <p><strong>Variazione 52 settimane :</strong> {item["52 Week Range"]}</p>
      <p><strong>Volume :</strong> {item["Volume"]}</p>
      <p><strong>Volume medio :</strong> {item["Avg. Volume"]}</p>
      <p><strong>Utile per azione :</strong> {item["EPS (TTM)"]}</p>
      <p><strong>Pubblicazione risultati bilancio:</strong> {item["Earnings Date"]}</p>
      
    </div>
  );
};

export default DetailView;
