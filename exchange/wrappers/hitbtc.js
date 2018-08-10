/*
docs: 
https://github.com/hitbtc-com/hitbtc-api/blob/master/APIv2.md
*/

'use strict'

const requestPromise = require('request-promise');
const crypto = require('crypto');
const querystring = require('querystring');

const Trader = function(config) {
    _.bindAll(this, [
      'roundAmount',
      'roundPrice',
      'isValidPrice',
      'isValidLot'
    ]);
  
    if (_.isObject(config)) {
      this.key = config.key;
      this.secret = config.secret;
      this.currency = config.currency.toUpperCase();
      this.asset = config.asset.toUpperCase();
    }
  
    let recvWindow = 6000;
    if(config.optimizedConnection) {
      recvWindow = 500;
    }
}  

function Hitbtc(accessKey, secretKey) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.apiBase = "https://api.hitbtc.com/api/2";
    this.timeout =  6000;
    this.keepalive = false;
}

Hitbtc.prototype = {
    makeHeader: function () {
        return {
            "Authorization" : "Basic " + new Buffer(this.accessKey + ':' + this.secretKey).toString("base64")
          };
    },
    request: function(uri, data) {
        const req = requestPromise({
            uri: uri,
            method: "GET",
            timeout: this.timeout,
            forever: this.keepalive,
            headers: this.makeHeader()
        })

        return req.then(function(res) {
            return JSON.parse(res);
        }).catch(function(err) {
            console.log(err);
            throw new Error(err.statusCode);
        })
    },
    getCurrencies: function(currency) {
        var path = "/public/currency/" + currency;
        return this.request(this.apiBase + path);
    },
    getSymbols: function(symbol) {
        var path = "/public/symbol/" + symbol;
        return this.request(this.apiBase + path);
    },
    getTickers: function(symbol) {
        var path = "/public/ticker/" + symbol;
        return this.request(this.apiBase + path);
    },
    getTrades: function(symbol) {
        var path = "/public/trades/" + symbol;
        return this.request(this.apiBase + path);
    },
    getOrderBook: function(symbol) {
        var path = "/public/orderbook/" + symbol;
        return this.request(this.apiBase + path);
    },
    getCandles: function(symbol) {
        var path = "/public/candles/" + symbol;
        return this.request(this.apiBase + path);
    },

    // -------- private --------
    getBalance: function() {
        var path = "/trading/balance";
        return this.request(this.apiBase + path);
    },
    
    /*
     "id": 840450210,
    "clientOrderId": "c1837634ef81472a9cd13c81e7b91401",
    "symbol": "ETHBTC",
    "side": "buy",
    "status": "partiallyFilled",
    "type": "limit",
    "timeInForce": "GTC",
    "quantity": "0.020",
    "price": "0.046001",
    "cumQuantity": "0.005",
    "createdAt": "2017-05-12T17:17:57.437Z",
    "updatedAt": "2017-05-12T17:18:08.610Z"
    */
    getOrders: function() {
        var path = "/order";
        return this.request(this.apiBase + path);
    }
};



Trader.getCapabilities = function() {
  return {
    name: 'Hitbtc',
    slug: 'hitbtc',
    currencies: marketData.currencies,
    assets: marketData.assets,
    markets: marketData.markets,
    requires: ['key', 'secret'],
    providesHistory: 'date',
    providesFullHistory: true,
    tid: 'tid',
    tradable: true,
    gekkoBroker: 0.6
  };
};



exports.Hitbtc = Hitbtc;

