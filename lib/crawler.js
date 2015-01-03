/*
Crawled item has: 
    config (name of config - site)
    path (path from root to current page)
    url (url of current page)
    title (title from head)
    body (document body)
    category (normalized category id)
 */

(function(namespace) {

    var fs = require('fs');
    var log = require('log');
    var roboto = require('roboto');
    var storage = require('plentiful-files');


    var Crawler = function(driver) {  
        this.logger = new log('info', fs.createWriteStream('./logs/crawler.' + (new Date().getTime()) + '.log'));      
        this.crawler = undefined;
        this.config = driver;
        this.driver = require('../config/drivers/' + driver + '.js');
        this.skipIfNoCategory = this.driver.skipIfNoCategory || false;
        this.checkPath = this.driver.checkPath || false;
        this.storage = new storage({
            prefix: driver.prefix || '',
            dir: './storage/raw/'
        });
        this.driver.isCurrentCategory = this.driver.isCurrentCategory || function(id, url) {
            return url.indexOf(id) !== -1;
        };

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

            this.crawler.parseField('path', function(response) {
                return response.urlPath;
            });    

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
            var categories = this.driver.categoriesNormalized;

            this.logger.info(this.config + '; ' + item.url + '; ' + JSON.stringify(item.path));

            if(this.checkPath) {
                for(var id in categories) {
                    for(var i in item.path) {
                        if(this.driver.isCurrentCategory(id, item.path[i], item.url)) {
                            item.category = this.driver.categoriesNormalized[id];
                            this.logger.info('FOUND CATEGORY FROM PATH: ' + item.category);
                            break;
                        }
                    }
                    if(item.category) {
                        break;
                    }
                }
            }
            else {
                for(var id in categories) {
                    if(this.driver.isCurrentCategory(id, item.url)) {
                        item.category = this.driver.categoriesNormalized[id];                  
                        this.logger.info('FOUND CATEGORY: ' + item.category);
                        break;
                    }
                }
            }

            if(this.skipIfNoCategory && item.category == null) {
                return;
            }

            this.storage.write(item, function(success, err, fileinfo) {
                if (err) {
                    this.logger.warning('WRITE FAILED: ' + JSON.stringify(err));
                }
            }.bind(this));
        }
    };


    module.exports = Crawler;
})(this);
