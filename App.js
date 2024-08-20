/*
    let factory = new ScraperFactory();
let seleniumFactory = factory.getFactory(0);

let scraper = seleniumFactory.getYahooScraper("https://finance.yahoo.com/quote/INTC");

console.log(scraper.getInfo());
*/

const { promise } = require("selenium-webdriver");
const { ScraperController } = require("./scraperController");

const fs = require("fs");
const { elementIsDisabled } = require("selenium-webdriver/lib/until");
const { SimpleAnalyzer } = require("./SimpleAnalyzer");

/**
 * TODO : 
 * inserire criteri di ordinamento nella tabella 
 * - ordinamento per nome
 * - ordinamento per prezzo
 * - ordinamento ascendente / discentente
 * 
 * 
 */

class Application {
    #scraperController;
    #analyzer;
    #tickers;
    #baseUrl;

    #isScraping;
    #numThead;
    
    constructor(url,tickers){
        this.#tickers = tickers;
        this.#baseUrl = url;
        this.#analyzer = new SimpleAnalyzer();

        this.#isScraping = false;

        this.#numThead = 1;
        
    }

    async init(){
        this.#scraperController = await new ScraperController(this.#baseUrl,this.#tickers,this.#numThead);
        await this.#scraperController.init();
    }

    setThreadNum(num){
        if(num > 0){
            this.#numThead = num;
        }
    }

    async startScrapers(){
        
        //Controllo che l'applicazione non stia ancora scaricando i dati
        if (this.#isScraping) {
            console.log("Scraping in corso, attendo il completamento...");
            return;
        }

        //Ogni volta occorre reinizializzare i vari scrapers
        await this.init();
        if (!this.#scraperController) {
            throw new Error("ScraperController non è stato inizializzato. Chiamare init() prima di startScrapers().");
        }

        this.#isScraping = true;  // Imposta il flag

        try{
            let startTime = new Date();
            let results = await this.#scraperController.runScrapers();
            let endTime = new Date();
            let execTime = endTime - startTime;
            console.log("Tempo di esecuzione : " , execTime);

            //console.log("RESULTS");
            //console.log(results);
            
            let [objResults,jsonResults] = await this.convert(results);
            this.evaluateResults(objResults);
            this.saveData(jsonResults);

            /** TODO : inserire le valutazioni nei dati e inviare tutto al frontend mediante una Websocket */


        }
        catch(error) {
            console.error("Errore durante lo scraping:", error);
        }
        finally {
            this.#isScraping = false;
        }

    }

    convert(results){
        
        let objResults = results.map(element => {
            let res = Object.fromEntries(element);
            return res;
        });

        let json = JSON.stringify(objResults, null, 2); // Formattato con indentazione

        return [objResults,json];
    }

    saveData(resultsInJson){
        
        
        let dir = "./results/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Salva l'intero array di risultati in un unico file JSON
        let path = dir + "results.json";
        try {
            // Converte l'intero array di oggetti in una stringa JSON
            
            fs.writeFileSync(path, resultsInJson, 'utf8');
        } catch (err) {
            console.error("Errore durante il salvataggio dei dati:", err);
        }
    }


    //TODO
    evaluateResults(results){
        let ratings = this.#analyzer.evaluate(results); 
        console.log("---------------RATINGS--------------------");
        console.log(ratings);        
        console.log("---------------END RATINGS--------------------");

    }

    async start(){
        while (true) {
            await this.startScrapers();
            await new Promise(resolve => setTimeout(resolve, timeWait)); 
        } 

    }
}

const baseUrl = "https://finance.yahoo.com/quote/"
const tickers = [
    "1INTC.MI", "UCG.MI", "TIT.MI", "ENEL.MI", "UNI.MI", "ISP.MI", "RACE.MI", "PYPL", "TSLA", "RGEN", 
    "1NVDA.MI", "FBK.MI", "PIRC.MI", "ENI.MI", "AZM.MI", "STLAM.MI", "MB.MI", "IG.MI", "AMP.MI", "PST.MI",
    "MHVIY", "ALAB", "VLKAF", "ARM", "MU", "ASML", "CRWD", "TSM", "RDDT", "ASTS",
    
    
];

/* 

"1INTC.MI", "UCG.MI", "TIT.MI", "ENEL.MI", "UNI.MI", "ISP.MI", "RACE.MI", "PYPL", "TSLA", "RGEN", 
    "1NVDA.MI", "FBK.MI", "PIRC.MI", "ENI.MI", "AZM.MI", "STLAM.MI", "MB.MI", "IG.MI", "AMP.MI", "PST.MI",
    "MHVIY", "ALAB", "VLKAF", "ARM", "MU", "ASML", "CRWD", "TSM", "RDDT", "ASTS",
    
    "1INTC.MI", "UCG.MI", "TIT.MI", "ENEL.MI", "UNI.MI", "ISP.MI", "RACE.MI", "PYPL", "TSLA", "RGEN", 
    "1NVDA.MI", "FBK.MI", "PIRC.MI", "ENI.MI", "AZM.MI", "STLAM.MI", "MB.MI", "IG.MI", "AMP.MI", "PST.MI",
    "MHVIY", "ALAB", "VLKAF", "ARM", "MU", "ASML", "CRWD", "TSM", "RDDT", "ASTS"
*/


const debugTicker = [ "1INTC.MI" ];
const timeWait = 60000;
const numThread = 3;

(async ()=>{
    const myApp = new Application(baseUrl,tickers);
    myApp.setThreadNum(numThread);
    //await myApp.startScrapers();
    await myApp.start();
})();


