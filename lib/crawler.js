(function(namespace) {

    var fs = require('fs');
    var md5 = require('md5');
    var roboto = require('roboto');
    var storage = require('plentiful-files');


    var Crawler = function(driver) {        
        this.crawler = undefined;
        this.config = driver;
        this.driver = require('../config/' + driver + '.js');
        this.storage = new storage({
            prefix: driver.prefix || '',
            dir: './storage/'
        });

        this.init();
    };
    Crawler.prototype = {
        init: function() {
            this.crawler = new roboto.Crawler(this.driver.config);
            this._parsers();
            this.crawler.on('item', function(item) {
                this._save(item);
            }.bind(this));
        },
        crawl: function() {
            this.crawler.crawl();
        },
        _parsers: function() {    
            this.crawler.parseField('config', function(response, $) {
                return this.config;
            }.bind(this));        
            this.crawler.parseField('url', function(response, $) {
                return response.url;
            });
            this.crawler.parseField('title', function(response, $) {
                return $('head title').text();
            });
            this.crawler.parseField('body', function(response, $) {
                return $('body').html();
            });
        },
        _save: function(item) {
            var categories = this.driver.categories;
            for(var id in categories) {
                if(item.url.indexOf('-' + id + '-') !== -1 || item.url.indexOf('=' + id) !== -1) {
                    item.category = id;
                    break;
                }
            }

            this.storage.write(item, function() {
                console.log('--------------------' + JSON.stringify(arguments));
            });
        }
    };


    module.exports = Crawler;
})(this);
