var $ = require('cheerio');
var trim = require('trim');

module.exports = {
    cleanLine: function(value) {
        return this._cleanLine(value);
    },
    getLines: function($el) {
        var lines = [];

        if ($el.html().search(/<br\s*\/?>/gi) !== -1) {
            $el.html().split(/<br\s*\/?>/gi).forEach(function(el, i) {
                lines.push($('<p>' + el + '</p>').text())
            });
        } else if ($el.find('li').length) {
            $el.find('li').each(function(index, item) {
                lines.push($(item).text());
            });
        } else {
            lines.push($el.text());
        }
        return lines.map(this._cleanLine);
    },
    parsePrice: function() {
        var parsedPrice,
            price = 0;

        if (arguments.length) {
            for (var i = 0; i < arguments.length; i++) {
                parsedPrice = parseFloat(arguments[i]);
                if (parsedPrice && parsedPrice > 0) {
                    price = parsedPrice;
                    break;
                }
            }
        }
        return price;
    },
    _cleanLine: function(value) {
        return trim(value.replace(' ?Ładowanie, proszę czekać...', ''));
    }
};
