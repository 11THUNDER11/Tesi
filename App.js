const { promise } = require("selenium-webdriver");
const { ScraperController } = require("./scraperController");

const fs = require("fs");
const { elementIsDisabled } = require("selenium-webdriver/lib/until");
const { SimpleAnalyzer } = require("./SimpleAnalyzer");

const WebSocket = require('ws');
const http = require('http');

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
        this.#scraperController = null;

        this.#numThead = 1;
        
        
        
    }

    async init(){
        if(this.#scraperController === null)
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

            let objResults = await this.convert(results);
            let ratings = await this.evaluateResults(objResults);
            
            //console.log("objects : ");
            //console.log(objResults);
            
            //console.log("RATING : ");
            //console.log(ratings);

            let mergedData = await objResults.map(obj =>{
                const res = ratings.find(rating => rating.ticker === obj.ticker);
                if(res){
                    return {...obj,...res};
                }
            })

            //console.log("merge");
            //console.log(mergedData);
            
            let json = JSON.stringify(mergedData, null, 2); // Formattato con indentazione
            this.saveData(json);
            this.broadcastToWebSocketClients({type : 'results', data : mergedData});

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

        return objResults;
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

    broadcastToWebSocketClients(message){
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }


    //Valutazione dei risultati
    evaluateResults(results){
        let ratings = this.#analyzer.evaluate(results); 
        
       return ratings;
    }

    async start(){
        while (true) {
            await this.startScrapers();
            await new Promise(resolve => setTimeout(resolve, timeWait)); 
        } 

    }
}


//--------------------------------------------------------------------------
// Configura il server WebSocket e HTTP
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Nuovo client connesso');

    ws.on('message', (message) => {
        console.log('Messaggio dal client:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnesso');
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server in ascolto su ws://localhost:${PORT}`);
});

const baseUrl = "https://finance.yahoo.com/quote/"
const tickers = [
    "1INTC.MI", "UCG.MI", "TIT.MI", "ENEL.MI", "UNI.MI", "ISP.MI", "RACE.MI", "PYPL", "TSLA", "RGEN", 
    "1NVDA.MI", "FBK.MI", "PIRC.MI", "ENI.MI", "AZM.MI", "STLAM.MI", "MB.MI", "IG.MI", "AMP.MI", "PST.MI",
    "MHVIY", "ALAB", "VLKAF", "ARM", "MU", "ASML", "CRWD", "TSM", "RDDT", "ASTS",
    
];

const debugTicker = [ "1INTC.MI" ];
const timeWait = 60000;
const numThread = 3;



(async ()=>{
    const myApp = new Application(baseUrl,tickers);
    myApp.setThreadNum(numThread);
    //await myApp.startScrapers();
    await myApp.start();
})();


