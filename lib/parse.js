(function(namespace) {

    var fs = require("fs");
    var roboto = require("roboto");


    var Crawler = function(driver) {
        this.crawler = undefined;
        this.driver = require("./crawler/" + driver + ".js");
        this.init();
    };
    Crawler.prototype = {
        init: function() {
            this.crawler = new roboto.Crawler(this.driver.config);
            this._parsers();
            this.crawler.on("item", function(item) {
                this._save(item);
            }.bind(this));            
        },
        crawl: function() {
            this.crawler.crawl();
        },
        _save: function(item) {
            var path = "../_Storage/";
            var category = false;
            var categories = this.driver.categories;

            if((item.description || "").length > 0) {
                for(var id in categories) {
                    if(item.url.indexOf("-" + id + "-") !== -1 || item.url.indexOf("=" + id) !== -1) {
                        category = categories[id];
                        break;
                    }
                }

                if(category) {
                    path = path + category + "/";
                    fs.exists(path, function(exists) {
                        if(!exists) {
                            fs.mkdirSync(path);
                        }
                        fs.writeFile(path + item.url.split("/").pop().replace(".html", "") + ".json", JSON.stringify(item));
                    });
                }
            }
        },
        _parsers: function() {
            var parsers = this.driver.parsers;
            for(var i in parsers) {
                this.crawler.parseField(i, parsers[i]);
            }
        }
    };


    module.exports = Crawler;
})(this);
