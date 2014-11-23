(function(namespace) {

    var fs = require('fs');
    var md5 = require('md5');
    var roboto = require('roboto');


    var Crawler = function(driver) {
        this.crawler = undefined;
        this.driver = require('./crawler/' + driver + '.js');
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
            var path = '../_Storage/';
            var filename = false;
            var categoryId = false;
            var categories = this.driver.categories;

            for(var id in categories) {
                if(item.url.indexOf('-' + id + '-') !== -1 || item.url.indexOf('=' + id) !== -1) {
                    categoryId = id;
                    break;
                }
            }

            if(categoryId) {
                item.category = categoryId;
                filename = this._getDir(item);
                path = path + filename.substr(0,3) + '/';
                fs.exists(path, function(exists) {
                    if(!exists) {
                        fs.mkdirSync(path);
                    }
                    fs.writeFile(path + filename + '.json', JSON.stringify(item));
                });
            }
        },
        _getDir: function(item) {
            return md5.digest_s(item.url.split('/').pop().replace('.html', ''));
        }
    };


    module.exports = Crawler;
})(this);
