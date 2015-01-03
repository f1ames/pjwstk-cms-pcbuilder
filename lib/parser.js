/*
Parsed item has: 
    config (name of config - site)
    url (url of current page)
    title (title from head)
    category (normalized category id)
    ... (fields defined at config.parsers)
 */

(function(namespace) {
    
    var he = require('he'); 
    var fs = require('fs');
    var log = require('log');
    var $ = require('cheerio');
    var storage = require('plentiful-files');     
    var filters = require('../config/filters.js');

    var configs = {};


    var Parser = function(driver) {
        this.logger = new log('info', fs.createWriteStream('./logs/parser.' + (new Date().getTime()) + '.log'));
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
                this.logger.info('Found ' + list.length + ' files to parse');
                for(var i = 0; i < length; i++) {
                    this._parseFile(list[i]);
                }
            }.bind(this));
        },
        _parseFile: function(filedata) {
            this.logger.info('Parsing ' + filedata.file);
            this.storageFrom.read(filedata.file, function(err, data) {
                if (!err) {                    
                    var config = this._loadConfig(data.config);                    
                    var $body = $(he.decode(data.body));
                    var item = {
                        config: data.config,
                        url: data.url,
                        title: data.title,
                        category: data.category
                    };

                    for(var i in config.parsers) {
                        item[i] = this._execParser(config.parsers[i], $body, data);                        
                    }
                    item.tags = this._buildTags(item, filedata.file);

                    this.storageTo.write(item, function(success, err, fileinfo) {
                        if (err) {
                            this.logger.warning('WRITE FAILED: ' + JSON.stringify(err));
                        }                        
                    }.bind(this));
                }
                else {
                    this.logger.warning('READ FAILED: ' + JSON.stringify(err));
                }
            }.bind(this), false);
        },
        _loadConfig: function(config) {
            if(!configs[config]) {
                configs[config] = require('../config/drivers/' + config + '.js');
            }
            return configs[config];
        },
        _execParser: function(parser, $body, item) {
            return parser.call(item, $body, $);
        },
        _buildTags: function(item, file) {
            var tags = [];

            if (item && item.specs && item.category && filters.categoriesMap[item.category]) {
                var categoryFilters = filters.categoriesMap[item.category].slice(0);
                if (categoryFilters) {
                    var length = item.specs.length;
                    for (var i = 0; i < length; i++) {
                        if (categoryFilters.length == 0) {
                            break;
                        }
                        tags = tags.concat(this._matchItem(item.specs[i], categoryFilters));
                    }
                }
            } else {
                console.log('No filters for category ' + item.category);
            }
            console.log('Tags for category ' + item.category + ' ' + file, tags);
            return tags;
        },
        _matchItem: function(spec, categoryFilters) {
            var filter,
                values,
                matched = [];

            if (spec && spec[1]) {
                values = spec[1];
                for (var i = 0; i < categoryFilters.length; i++) {
                    for (var j = 0; j < values.length; j++) {
                        if (filters.matches(categoryFilters[i].regex, values[j])) {
                            matched.push(filters.formatValue(categoryFilters[i].regex, values[j]));

                            if (categoryFilters[i].amount == 1) {
                                break;
                            }
                        }
                    }
                    if (matched.length) {
                        categoryFilters.splice(i, 1);
                        break;
                    }
                }
            }
            return matched;
        }
    };


    module.exports = Parser;
})(this);
