const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');

const baseUrl = "https://finance.yahoo.com/quote/";
const tickers = [
    "1INTC.MI", "UCG.MI", "TIT.MI", "ENEL.MI", "UNI.MI", "ISP.MI", "RACE.MI", "PYPL", "TSLA", "RGEN",
    "1NVDA.MI", "FBK.MI", "PIRC.MI", "ENI.MI", "AZM.MI", "STLAM.MI", "MB.MI", "IG.MI", "AMP.MI", "PST.MI",
    "MHVIY", "ALAB", "VLKAF", "ARM", "MU", "ASML", "CRWD", "TSM", "RDDT", "ASTS",
];

async function example() {
    const browser = await puppeteer.launch({ headless: true });
    const [page] = await browser.pages();
    const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});
    await page.goto('https://finance.yahoo.com/');
    await navigationPromise;

    try {

        
        // Attendi che il pulsante "Rifiuta" sia visibile e scorri fino ad esso
        await page.waitForSelector('button[name="reject"][value="reject"]', {timeout: 5000 });
        await page.click('button[name="reject"][value="reject"]');
        let title = await page.title();
        console.log("title " , title);
        //if ( title == "Yahoo fa parte della famiglia di brand Yahoo."){
        //    await browser.close();
        //    return -1;
        //}

        const startTime = performance.now();

        for (const ticker of tickers) {
            let url = baseUrl + ticker;
            await page.goto(url);

            // Attendi l'elemento del nome della compagnia
            await page.waitForSelector('.yf-3a2v0c', {timeout : 10000});

            // Estrai il testo del nome della compagnia
            let name = await page.$eval('.yf-3a2v0c', el => el.innerText);
            console.log("Nome azienda: ", name);
        }

        const endTime = performance.now();
        console.log(`Tempo di esecuzione: ${(endTime - startTime) / 1000} secondi`);
        let time = (endTime - startTime) / 1000;
        await browser.close();

        return time;
    } catch (err) {
        await browser.close();
        return -1;
    }
}

let loop = 20;
let results = [];

(async () => {
    for (let count = 0; count < loop; count++) {
        let time = await example();
        if (time > 0) {
            results.push({ count, time });
        } else {
            count--; // Ripeti il ciclo se c'è stato un errore
        }
    }

    console.log("Results:", results);
})();
