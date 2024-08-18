
const { YahooSeleniumScraper } = require("./YahooSeleniumScraper")
class ScraperFactory {
    
    getFactory(whichFactory){
        switch(whichFactory){
            default : return new SeleniumScraperFactory();
        }
    }

    getYahooScraper() {
        throw new Error("Method 'getYahooScraper' must be implemented.");
    }


}

class SeleniumScraperFactory extends ScraperFactory {
    constructor() {
        super();
    }

    getYahooScraper(url,tickers) {
        return new YahooSeleniumScraper(url,tickers);
    }
}

module.exports = {ScraperFactory, SeleniumScraperFactory,YahooSeleniumScraper}