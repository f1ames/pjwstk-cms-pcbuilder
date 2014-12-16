/*
Crawled item has: 
    config (name of config - site)
    path (path from root to reach page)
    url (url of current page)
    title (title from head)
    body (document body)
    category (category id)
 */

(function(namespace) {

    var $ = require('cheerio');
    var storage = require('plentiful-files'); 
    var he = require('he');   
    var configs = {};


    var Parser = function(driver) {
        this.storageFrom = new storage({
            dir: './storage/raw/'
        });
        this.storageTo = new storage({
            dir: './storage/parsed/'
        });
    };
    Parser.prototype = {
        parse: function() {
            this.storageFrom.list(storage.CHANGED, function(success, error, list) {
                var length = list.length;
                for(var i = 0; i < length; i++) {
                    this._parseFile(list[i]);
                }
            }.bind(this));
        },
        _parseFile: function(filedata) {
            this.storageFrom.read(filedata.file, function(err, data) {
                if(!err) {
                    // console.log(he.decode(data.body));
                    var item = {};
                    var config = this._loadConfig(data.config);                    
                    var $body = $(he.decode(data.body));
                    console.log($body.text());
                    for(var i in config.parsers) {
                        item[i] = this._execParser(config.parsers[i], $body, data);                        
                    }
                    this.storageTo.write(item, function() {});
                }
            }.bind(this), false);
        },
        _loadConfig: function(config) {
            if(!configs[config]) {
                configs[config] = require('../config/' + config + '.js');
            }
            return configs[config];
        },
        _execParser: function(parser, $body, item) {
            return parser.call(item, $body, $);
        }
    };


    module.exports = Parser;
})(this);
