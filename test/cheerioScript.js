const axios = require('axios');
const cheerio = require('cheerio');
const { performance } = require('perf_hooks');
const { hasUncaughtExceptionCaptureCallback } = require('process');

const baseUrl = "https://finance.yahoo.com/quote/";
const tickers = [
    "1INTC.MI", "UCG.MI", "TIT.MI", "ENEL.MI", "UNI.MI", "ISP.MI", "RACE.MI", "PYPL", "TSLA", "RGEN", 
    "1NVDA.MI", "FBK.MI", "PIRC.MI", "ENI.MI", "AZM.MI", "STLAM.MI", "MB.MI", "IG.MI", "AMP.MI", "PST.MI",
    "MHVIY", "ALAB", "VLKAF", "ARM", "MU", "ASML", "CRWD", "TSM", "RDDT", "ASTS",
];

async function getCompanyName(ticker) {
    try {
        const url = baseUrl + ticker;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const companyNameElement = $('.yf-3a2v0c'); // Assicurati che il selettore sia corretto
        return companyNameElement.text();
    } catch (error) {
        console.error(`Errore per ${ticker}:`, error.message);
        return null;
    }
}

async function example() {
    const startTime = performance.now();
    
    try{
        
        for(ticker of tickers){
            let url = baseUrl + ticker;
            console.log("url: ",url)
            let response = await fetch(url);
            
            console.log(response);

            if(response.ok){
                const body = await response.text();
                const $ = cheerio.load(body);
                const companyNameElement = $('.yf-3a2v0c'); // Assicurati che il selettore sia corretto
                let name = await companyNameElement.text();
                console.log("Nome azienda : ",name);
                
            }else{
                console.log("Risposta non ok");
                return -1;
            }

            //const $ = cheerio.load(response.data);
            
        }
    }
    catch(error){
        console.error(`Errore per ${ticker}:`, error.message);
        return -1;
    }

        
    const endTime = performance.now();
    const time = (endTime - startTime) / 1000;
    console.log(`Tempo di esecuzione: ${time} secondi`);
    return time;
}

let loop = 20;
let results = [];

(async () => {
    for (let count = 0; count < loop; count++) {
        let time = await example();
        if (time > 0) {
            results.push({ count, time });
        } else {
            count--;
        }
    }

    console.log("Results:", results);
})();
