let seleniumTests = [
    { count: 0, time: 43.1225813999176 },
    { count: 1, time: 42.793354799985885 },
    { count: 2, time: 40.06684770011902 },
    { count: 3, time: 40.849150099992755 },
    { count: 4, time: 49.77693040013313 },
    { count: 5, time: 42.666863399982454 },
    { count: 6, time: 42.51376719999313 },
    { count: 7, time: 45.450700999975204 },
    { count: 8, time: 44.60179809999466 },
    { count: 9, time: 40.06505119991302 },
    { count: 10, time: 40.162518800020216 },
    { count: 11, time: 43.18807749986649 },
    { count: 12, time: 40.650534100055694 },
    { count: 13, time: 42.78592429995537 },
    { count: 14, time: 42.244001800060275 },
    { count: 15, time: 44.448541599988936 },
    { count: 16, time: 55.21219050002098 },
    { count: 17, time: 49.83195759987831 },
    { count: 18, time: 49.86101069998741 },
    { count: 19, time: 44.235968100070956 }
]

let puppeteerTests = 
[
    { count: 0, time: 46.97415089999999 },
    { count: 1, time: 47.1818799 },
    { count: 2, time: 49.79095560000002 },
    { count: 3, time: 41.33602809999999 },
    { count: 4, time: 45.74123739999998 },
    { count: 5, time: 47.023233999999995 },
    { count: 6, time: 47.081061600000076 },
    { count: 7, time: 58.59758349999995 },
    { count: 8, time: 44.053758199999926 },
    { count: 9, time: 46.90874309999997 },
    { count: 10, time: 47.71334309999994 },
    { count: 11, time: 50.04908309999993 },
    { count: 12, time: 52.877178599999986 },
    { count: 13, time: 45.46538369999989 },
    { count: 14, time: 45.85301560000004 },
    { count: 15, time: 46.18385679999995 },
    { count: 16, time: 48.062037599999925 },
    { count: 17, time: 52.07867510000011 },
    { count: 18, time: 52.30598909999989 },
    { count: 19, time: 42.60757529999991 }
]

let tests = [];
tests.push({
    library : "Selenium",
    values : seleniumTests
})

tests.push({
    library : "Puppeteer",
    values : puppeteerTests
})

for(test of tests){
    let sum = 0;

    for(info of test.values){
        sum+=info.time;
    }
    console.log("Library: ", test.library)
    console.log("mean", sum/(test.values.length));
    
}
