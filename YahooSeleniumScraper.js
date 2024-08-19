const scraperState = require("./State");
const {IScraper} = require("./IScraper");
// Importazione delle librerie necessarie
const { Browser , Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const options = new Chrome.Options();
const fs = require("fs");
const { resolve } = require("path");
const { rejects } = require("assert");


class YahooSeleniumScraper extends IScraper {
    #state;
    #url;
    #tickers;
    #seleniumChromeDriver;
    #removed;

    constructor(url,tickers = undefined){
        super();
        if(this.constructor === IScraper){
            throw new Error("IScraper : Non si può istanziare una classe astratta");
        }

        this.#url = url;
        this.#tickers = tickers;
        this.#seleniumChromeDriver = null;
        this.#state = scraperState.EMPTY;
        this.#removed = false;
    }

    setTickers(tickers){
        this.#tickers = tickers
    }

    getUrl(){
        return this.#url;
    }

    getTickers(){
        return this.#tickers;
    }

    getInfo(){
        return `Url : ${this.#url} , Tickers : ${this.#tickers}`;
    }

    getState(){
        return this.#state;
    }
    
    // Metodo per inizializzare il driver del browser
    async initDriver() {
        if(this.#seleniumChromeDriver == null){
            
            //Impostiamo le varie opzioni 
            options.addArguments("--disable-search-engine-choice-screen");
            //options.addArguments("--headless=new");
            options.addArguments('--log-level=2');
            options.addArguments('--ignore-certificate-errors');
            options.addArguments('--ignore-ssl-errors');
            options.addArguments('--ignore-certificate-errors-spki-list');

            // Creazione di una nuova istanza del driver di Chrome
            this.#seleniumChromeDriver = await new Builder().forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();

            this.#state = scraperState.BUILD;
        }
    }
    
    // Metodo per aprire la pagina web
    async openPage(url) {

        return new Promise(async (resolve,reject) => {
            try {

                //console.log(`${url} apro la pagina`);
                await this.#seleniumChromeDriver.get(url);
                await this.#seleniumChromeDriver.manage().setTimeouts({implicit: 5000});
                //Rimozione banner cookie 
                
                if(!this.#removed){
                    let rejectCookieElement = await this.#seleniumChromeDriver.findElement(By.name('reject'))
                    await this.#seleniumChromeDriver.wait(until.elementIsVisible(rejectCookieElement),1000);
                    await rejectCookieElement.click();
                    
                    this.#removed = true;
                }

                let companyName = await this.#seleniumChromeDriver.findElement(By.className('yf-3a2v0c'));
                await this.#seleniumChromeDriver.wait(until.elementIsVisible(companyName),200);
                let name = await companyName.getText();
                
                let priceElement = await this.#seleniumChromeDriver.findElement(By.className('livePrice')); 
                await this.#seleniumChromeDriver.wait(until.elementIsVisible(priceElement),200);
                
                let priceValue = await priceElement.getText();  // Ottiene il testo dell'elemento
                
                let stockIndicatorsElement = await this.#seleniumChromeDriver.findElement(By.className('yf-tx3nkj')); 
                let rawValues = await stockIndicatorsElement.getText();
                

                let lines = rawValues.split('\n');
                let values = new Map();

                let date = new Date();
                
                values.set("Company name",name);
                values.set("date", date.toLocaleDateString());
                values.set("time", date.toLocaleTimeString());

                let tokernsUrl = url.split('/');
                let ticker = tokernsUrl[tokernsUrl.length -1];
                values.set("ticker",ticker);
                values.set("price",priceValue);
                
                for(let i = 0; i < lines.length; i+=2){
                    //console.log(`Indicatore : ${lines[i]} , Valore : ${lines[i+1]}`);
                    values.set(lines[i],lines[i+1]);
                }


                resolve(values);
    
                

                /*
                const pageSource = await this.#seleniumChromeDriver.findElement(By.id('atomic'));
                let html = await pageSource.getAttribute("innerHTML");
                */
    
    
                /*
                //TRY: Save source page
                let dir = "./sourcePages/";
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                try {
                    // Converte l'intero array di oggetti in una stringa JSON
                    fs.writeFileSync(dir+this.#ticker, html, 'utf8');
                } catch (err) {
                    console.error("Errore durante il salvataggio dei dati:", err);
                }
                */
                
    
            } catch (error) {
                console.error(`Errore ${url} durante l'apertura della pagina: ${error}`);
                reject(error);
            }
        });

        
    }
    
    // Metodo per eseguire il web scraping
    async scrapeData() {

        if(this.#state != scraperState.BUILD){
            return new Error(`Scraper ${this.#url} is not in BUILD state`);
        }

        let results = [];
        for (const ticker of this.#tickers) {
            try {
                let data = await this.openPage(this.#url + ticker);
                results.push(data);

                console.log(`Ticker ${ticker}, dati scaricati`);

            } catch (err) {
                console.error(`Errore durante l'apertura della pagina per ${ticker}: ${err}`);
            }
        }

        this.closeDriver();

        return results;
        
    }



    
    // Metodo per chiudere il driver del browser
    async closeDriver() {
        if (this.#seleniumChromeDriver) {
            await this.#seleniumChromeDriver.quit();
            this.#state = scraperState.EMPTY;
            this.#seleniumChromeDriver = null;
        }
    }

    // Metodo principale per eseguire l'intero processo di scraping
    async run() {

        try{
            await this.initDriver();  // Inizializza il driver del browser
            await this.openPage();    // Apre la pagina web
            const data = await this.scrapeData();  // Esegue il web scraping
            return data;
        }
        catch (error) {
            console.error(`Errore nel processo di scraping per ${this.#url}: ${error}`);
        } finally {
            await this.closeDriver(); // Chiude il driver del browser
        }

    }
    
}



module.exports = {YahooSeleniumScraper};