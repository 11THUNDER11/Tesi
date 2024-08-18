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

class Application {
    #scraperController;
    #analyzer;
    #tickers;
    #baseUrl;
    
    constructor(url,tickers){
        this.#tickers = tickers;
        this.#baseUrl = url;
        
    }

    async init(){
        this.#scraperController = await new ScraperController(this.#baseUrl,this.#tickers,1);
        await this.#scraperController.init();
    }

    async startScrapers(){
        if (!this.#scraperController) {
            throw new Error("ScraperController non è stato inizializzato. Chiamare init() prima di startScrapers().");
        }
        let results = await this.#scraperController.runScrapers();
        
        console.log("RESULTS");
        console.log(results);

        /*
        let validResults = results.filter(element => {
            if(element[0] === 0){
                return element;
            }
        });

        console.log("Valid result ");
        console.log(validResults);
        */

        let json = await this.convertToJson(results);
        this.saveData(json);
        

    }

    convertToJson(results){
        
        let entryLenght = 0;
        let jsonResults = results.map(element => {
            let res = Object.fromEntries(element);
            entryLenght++;
            //console.log(res);
            return res;
        });

        return [entryLenght,jsonResults];
    }

    saveData(results){
        
        
        let dir = "./results/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Salva l'intero array di risultati in un unico file JSON
        let path = dir + "results.json";
        try {
            // Converte l'intero array di oggetti in una stringa JSON
            let json = JSON.stringify(results, null, 2); // Formattato con indentazione
            fs.writeFileSync(path, json, 'utf8');
        } catch (err) {
            console.error("Errore durante il salvataggio dei dati:", err);
        }
    }

    evaluateResults(results){

    }

    start(){
        setInterval(async () => {
            await this.startScrapers();
        }, 60000); // Esegui ogni 60 secondi 

        
    }
}

const baseUrl = "https://finance.yahoo.com/quote/"
const tickers = [
    "1INTC.MI",
    "UCG.MI",
    "TIT.MI",
    "ENEL.MI",
    "UNI.MI",
    "ISP.MI",
    "RACE.MI",
    "PYPL",
    "TSLA",
    "RGEN",
    "1NVDA.MI",
    "FBK.MI",
    "PIRC.MI",
    "ENI.MI",
    "AZM.MI",
    "STLAM.MI",
    "MB.MI",
    "IG.MI",
    "AMP.MI",
    "PST.MI",
    "MHVIY",
    "ALAB",
    "VLKAF",
    "ARM",
    "MU",
    "ASML",
    "CRWD",
    "TSM",
    "RDDT"
];



    
const timeWait = 60000;
(async ()=>{
    const myApp = new Application(baseUrl,tickers);
    await myApp.init();
    await myApp.startScrapers();
    //myApp.start();
    
    
    
})();


