const { IAnalyzer } = require("./IAnalyzer");

class SimpleAnalyzer extends IAnalyzer {
    
    #resultsToAnalyze;

    constructor(){
        super();
        if(this.constructor === IAnalyzer){
            throw new Error("IAnalyzer : Non si può istanziare una classe astratta");
        }
    }

    getResults(){
        return this.#resultsToAnalyze;
    }

    setResults(res){
        this.#resultsToAnalyze = res;
    }

    evaluate(){
        //let evaluations = this.#resultsToAnalyze
    }
    

}