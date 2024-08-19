const { IAnalyzer } = require("./IAnalyzer");
const rating = require('./Rating');

class SimpleAnalyzer extends IAnalyzer {
    
    constructor(){
        super();
        if(this.constructor === IAnalyzer){
            throw new Error("IAnalyzer : Non si può istanziare una classe astratta");
        }

        
    }

    evaluate(results){
        let evaluations = [];

        results.map(result => {
            let entry = {};
            entry.ticker = result["ticker"];
            let currentPE = result["PE Ratio (TTM)"];
            
            if(currentPE === "--"){
                entry.valuation = rating.DEFAULT;
            }
            else if(currentPE < 20 ){
                entry.valuation = rating.CHEAP;
            }
            else if(currentPE > 25){
                entry.valuation = rating.EXPENSIVE;
            }
            else{
                entry.valuation = rating.NORMAL;
            }

            evaluations.push(entry);
        });

        return evaluations;
        
    }
    

}

module.exports = {SimpleAnalyzer};