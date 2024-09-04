const {Browser ,Builder , By} = require('selenium-webdriver');
const { performance } = require('perf_hooks');
const Chrome = require('selenium-webdriver/chrome');
const options = new Chrome.Options();

const baseUrl = "https://finance.yahoo.com/quote/"
const tickers = [
    "1INTC.MI", "UCG.MI", "TIT.MI", "ENEL.MI", "UNI.MI", "ISP.MI", "RACE.MI", "PYPL", "TSLA", "RGEN", 
    "1NVDA.MI", "FBK.MI", "PIRC.MI", "ENI.MI", "AZM.MI", "STLAM.MI", "MB.MI", "IG.MI", "AMP.MI", "PST.MI",
    "MHVIY", "ALAB", "VLKAF", "ARM", "MU", "ASML", "CRWD", "TSM", "RDDT", "ASTS",
    
];


async function example() {
    
    

    options.addArguments("--disable-search-engine-choice-screen");
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options) .build();
    await driver.get("https://finance.yahoo.com/");
    
    try{
        let rejectCookieElement = await driver.findElement(By.name('reject'))
        await rejectCookieElement.click();

        const startTime = performance.now();
    
        for(ticker of tickers){
                let url = baseUrl + ticker;
                await driver.get(url);
                let companyName = await driver.findElement(By.className('yf-3a2v0c'));
                let name = await companyName.getText();
                
                console.log("Nome azienda : ",name);    
        }
        const endTime = performance.now();
        console.log(`Tempo di esecuzione: ${(endTime - startTime) / 1000} secondi`);
        let time = (endTime - startTime) / 1000;
        await driver.quit();

        return time;
    }
    catch(err){
        await driver.quit();
        return -1;
    }
    
    
}


let loop = 20;
let results = [];

(async () => {
    for(let count = 0;count < loop;count++){
        let time = await example();
        if(time > 0){
            results.push({count,time});
        }
        else{
            count --;
        }
    }
    
    console.log("Results : ", results);
})();




