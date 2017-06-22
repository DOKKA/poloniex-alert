var zzz = require('poloniex.js');
var Promise = require("bluebird");
var moment = require('moment');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var db = require('./setup2.js');
//var _ = require('lodash');

var poloniex = new zzz();

function returnChartData(baseCurrency, tradeCurrency, period, start, end){
   return new Promise(function(resolve,reject){
      return poloniex.returnChartData(baseCurrency, tradeCurrency, period, start, end,function(err,data){
         if(err){
            reject(err)
         } else {
            resolve(data);
         }
      });
   });
}

function returnTicker(){
   return new Promise(function(resolve,reject){
      return poloniex.returnTicker(function(err,data){
         if(err){
            reject(err)
         } else {
            resolve(data);
         }
      });
   });
}



function getExtremes(currencyPair){
    var monthAgo = moment().subtract(1, 'month').unix();
    var cp = currencyPair.split('_');

        return returnChartData(cp[0],cp[1], 14400, monthAgo, moment().unix()).then(function(chartData){
        var high = 0;
        var highestDate = 0;
        var low = 1000000;
        var lowestDate = 0;
        var highestVolume = 0;
        var highestVolumeDate = 0;
        
        for(let tick of chartData){
            if(tick.high > high){
                high = tick.high;
                highestDate = tick.date;
            }

            if(tick.low < low){
                low = tick.low;
                lowestDate = tick.date;
            }

            if(tick.volume > highestVolume){
                highestVolume = tick.volume;
                highestVolumeDate = tick.date;
            }
        }

        return {
            currencyPair: currencyPair,
            high: high,
            highestDate: highestDate,
            low: low,
            lowestDate: lowestDate,
            highestVolume: highestVolume,
            highestVolumeDate: highestVolumeDate
        };
    });
    
}

// getExtremes('BTC_ETH').then(function(data){
//     console.log(data);
// })

db.sequelize.sync().then(function(){
returnTicker().then(function(ticker){
    var markets = Object.keys(ticker);
    var bitcoinMarkets = markets.filter(function(market){
        return /BTC\_\w+/.test(market);
    });

    return Promise.map(bitcoinMarkets,function(market){
        return getExtremes(market).then(function(values){
            console.log(values);
            return db.CoinValue.create({
                currencyPair: values.currencyPair,
                high: values.high,
                highestDate: moment(values.highestDate*1000).toDate(),
                low: values.low,
                lowestDate:  moment(values.lowestDate*1000).toDate(),
                highestVolume: values.highestVolume,
                highestVolumeDate:  moment(values.highestVolumeDate*1000).toDate(),
            });
            //return values;
        }).delay(10000);
    },{concurrency: 1});
}).then(function(values){
    //return fs.writeFileAsync('extreme-values.json',JSON.stringify(values, null, ' '));
    return values;
}).then(function(){
    console.log('done');
})


})


    // return fs.appendFileAsync('data.txt', JSON.stringify(bitcoinMarkets,null,' ')).then(function(){
    //     console.log('done')
    // })
    //console.log(bitcoinMarkets)