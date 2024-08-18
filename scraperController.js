const { ScraperFactory, SeleniumScraperFactory} = require("./ScraperFactory");
const scraperState = require("./State");
class ScraperController {
    #scrapers
    #factory;
    #tickers;
    #baseUrl;

    #numThread;

    constructor(url,tickers,numThread = 1){
        this.#factory = new ScraperFactory().getFactory(0);
        this.#tickers = tickers;
        this.#baseUrl = url;

        this.#scrapers = [];
        

        this.#numThread = numThread;

    }


    setThreads(num){
        this.#numThread = num;
    }

    async init(){

        //Dividiamo i tickers in base ai thread
        let tickersForThread = Math.ceil(this.#tickers.length / this.#numThread);
        console.log("Lunghezza : ", tickersForThread);
        let tickersThread = [];
        let allTickers = [];
        
        let count = 1;
       
        for(let index = 0;index<this.#tickers.length;index++){
            let ticker = this.#tickers[index];
            console.log("Ticker : ",ticker);
            tickersThread.push(ticker);
            if(count === tickersForThread){
                allTickers.push(tickersThread);
                tickersThread = [];
                count = 0;    
            }

            count ++;

        }

        if(tickersThread.length != 0){
            allTickers.push(tickersThread);
        }
        
        console.log(`All Tickers : `,allTickers);
        
        
        //Creazione degli scrapers
        allTickers.map(tickers => {
            let scraper = this.#factory.getYahooScraper(this.#baseUrl,tickers);
            this.#scrapers.push(scraper);
        });
        
        try {
            let initedScrapers = await this.initScrapers();
            console.log("Driver creati");
            //let readyScrapers = await this.openScrapersPage(initedScrapers);
            //Controllo che tutti gli scrapers siano attivi
            if(initedScrapers.length === this.#scrapers.length){
                console.log("Tutti gli scrapers pronti");
            }else{
                console.log(`Scrapers iniziali : ${this.#scrapers.length}, inizializzati : ${initedScrapers.length}, pronti : ${readyScrapers.length}`);
                console.log("Scraper rimossi : ");
                this.#scrapers.forEach(scraper =>{
                    if(! readyScrapers.includes(scraper)){
                        console.log(scraper.getInfo());
                    }
                });
            }
        }
        catch(error){
            console.error("Errore durante l'inizializzazione degli scrapers:", error);
        }

        
        
    }

    

    async runScrapers(){

        try{
            let promises = this.#scrapers.map(scraper => {
                
                return new Promise(async (resolve,reject) => {
                    try{
                        let data = await scraper.scrapeData(); 
                        resolve(data);
                    }
                    catch(error){
                        reject(error);
                    }
                })
                
            });

            const results = await Promise.all(promises);
            
            let resultsObjs = results.flat();
            
            return resultsObjs;

            
        }
        catch(err){
            console.error('Errore durante l\'esecuzione delle operazioni di scraping:', err);
        }
        
    }

    async initScrapers(){
        let scrapersInit = [];
        let promises = this.#scrapers.map(async scraper => {
            await scraper.initDriver();
            console.log(`Scraper ${scraper.getInfo()}, state ${scraper.getState()}`);
            if(scraper.getState() == scraperState.BUILD){
                scrapersInit.push(scraper);
            }
        });
        
        await Promise.all(promises);

        return scrapersInit;
    }
    /*
    async openScrapersPage(scrapersInit){
        let scrapersReady = []; 
        let promises = scrapersInit.map(async scraper => {
            await scraper.openPage();
            if(scraper.getState() == scraperState.READY){
                scrapersReady.push(scraper);
                console.log(`scraper ${scraper.getUrl()} aperto`);
            }
        });
        await Promise.all(promises);
        return scrapersReady;
    }
    */
    

    
}

module.exports = {ScraperController}