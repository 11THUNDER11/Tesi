const scraperState = require("./State");
const {IScraper} = require("./IScraper");
// Importazione delle librerie necessarie
const { Browser , Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const options = new Chrome.Options();

class YahooSeleniumScraper extends IScraper {
    #state;
    #url;
    #ticker;
    #seleniumChromeDriver;

    constructor(url){
        super();
        if(this.constructor === IScraper){
            throw new Error("IScraper : Non si può istanziare una classe astratta");
        }

        this.#url = url;
        
        let parts = url.split("/");
        this.#ticker = parts[parts.length - 1];
        
        this.#seleniumChromeDriver = null;
        this.#state = scraperState.EMPTY;
    }

    getUrl(){
        return this.#url;
    }

    getTicker(){
        return this.#ticker;
    }

    getInfo(){
        return `Url : ${this.#url} , Ticker : ${this.#ticker}`;
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
            options.addArguments('--log-level=1')

            // Creazione di una nuova istanza del driver di Chrome
            this.#seleniumChromeDriver = await new Builder().forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();

            this.#state = scraperState.BUILD;
        }
    }

    // Metodo per aprire la pagina web
    async openPage() {
        try {

            await this.#seleniumChromeDriver.get(this.#url);
            await this.#seleniumChromeDriver.manage().setTimeouts({implicit: 2000});
            //Rimozione banner cookie 
            let rejectCookieElement = await this.#seleniumChromeDriver.findElement(By.name('reject'))
            await this.#seleniumChromeDriver.wait(until.elementIsVisible(rejectCookieElement),100);
            await rejectCookieElement.click();
            let title = await this.#seleniumChromeDriver.getTitle();
            //console.log("Titolo pagina : ", title);

            this.#state = scraperState.READY;
            
        } catch (error) {
            console.error(`Errore durante l'apertura della pagina: ${error}`);
        }
    }

    // Metodo per eseguire il web scraping
    async scrapeData() {

        if(this.#state != scraperState.READY){
            return new Error("Scraper is not in READY state");
        }

        try {
            let priceElement = await this.#seleniumChromeDriver.findElement(By.className('livePrice')); 
            
            let priceValue = await priceElement.getText();  // Ottiene il testo dell'elemento
            
            let stockIndicatorsElement = await this.#seleniumChromeDriver.findElement(By.className('yf-tx3nkj')); 
            let rawValues = await stockIndicatorsElement.getText();
            

            let lines = rawValues.split('\n');
            let values = new Map();

            values.set("time",new Date());
            values.set("ticker",this.#ticker);
            values.set("price",priceValue);
            
            for(let i = 0; i < lines.length; i+=2){
                //console.log(`Indicatore : ${lines[i]} , Valore : ${lines[i+1]}`);
                values.set(lines[i],lines[i+1]);
            }

            return values;

           
            
        } catch (error) {
            console.error(`Errore ${this.#ticker} durante il web scraping: ${error}`);
        }
    }

    // Metodo per chiudere il driver del browser
    async closeDriver() {
        if (this.#seleniumChromeDriver) {
            await this.#seleniumChromeDriver.quit();
            this.#state = scraperState.EMPTY;
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
            console.error(`Errore nel processo di scraping per il ticker ${this.#ticker}: ${error}`);
        } finally {
            await this.closeDriver(); // Chiude il driver del browser
        }

    }
}



module.exports = {YahooSeleniumScraper};