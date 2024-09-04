const fetch = require('node-fetch');
const { performance } = require('perf_hooks');

const baseUrl = "https://finance.yahoo.com/quote/";
const tickers = [
    "TSLA", "AAPL", "GOOGL"
];

async function fetchWithHeaders(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive'
            }
        });
        const text = await response.text();
        console.log(text);
    } catch (error) {
        console.error(`Errore durante la richiesta: ${error.message}`);
    }
}

(async () => {
    const startTime = performance.now();
    
    for (const ticker of tickers) {
        await fetchWithHeaders(`${baseUrl}${ticker}`);
    }

    const endTime = performance.now();
    console.log(`Tempo di esecuzione: ${(endTime - startTime) / 1000} secondi`);
})();
