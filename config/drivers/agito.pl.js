var commons = require('../commons.js');

module.exports = {
    config: {
        startUrls: [
            "http://www.agito.pl"
        ],
        allowedDomains: [
            "agito.pl"
        ],
        whitelist: [
            "/64.html", "/64,p", "-64-",    //myszki
            "/65.html", "/65,p", "-65-",    //klawiatury
            "/79.html", "/79,p", "-79-",    //płyty główne
            "/81.html", "/81,p", "-81-",    //procesory
            "/82.html", "/82,p", "-82-",    //chłodzenie
            "/83.html", "/83,p", "-83-",    //dyski twarde
            "/84.html", "/84,p", "-84-",    //karty graficzne
            "/85.html", "/85,p", "-85-",    //karty dźwiękowe
            "/89.html", "/89,p", "-89-",    //karty sieciowe
            "/91.html", "/91,p", "-91-",    //obudowy
            "/130.html","/130,p", "-130-",  //tunery tv
            "/221.html", "/221,p", "-221-", //zasilacze
            "/693.html", "/693,p", "-693-", //napędy
            "/707.html", "/707,p", "-707-", //ram
            "/3005.html", "=3005"           //monitory
        ],
        maxDepth: 10,
        requestDelay: 50,
        obeyRobotsTxt: false,
        obeyNofollow: false,
        allowedContentTypes: [
            "text/html",
            "application/xhtml+xml",
            "application/xml"
        ],
        logLevel: 'error'
    },
    prefix: 'AGI',
    skipIfNoCategory: true,
    isCurrentCategory: function(id, url, currentUrl) {
        var id = '' + id,
            cid = url.substr(-(id.length + 1));        
               
        return url.indexOf('-' + id + '-') !== -1 || cid == ('=' + id);
    },
    categoriesNormalized: {
        81: 1,
        707: 2,
        79: 3,
        83: 4,
        221: 5,
        82: 6,
        84: 7,
        89: 8,
        85: 9,
        91: 10,
        693: 11,
        130: 12,
        65: 13,
        64: 14,
        3005: 15
    },
    parsers: {
        descriptionTitle: function($body, $) {
            return $body.find("#tabs .tabcontent").eq(0).children("div").eq(0).children("div").eq(0).text();
        },
        descriptionBody: function($body, $) {
            return $body.find("#tabs .tabcontent").eq(0).children("div").eq(0).children("div").eq(1).text();
        },
        specs: function($body, $) {
            var specs = [];
            $body.find("#tabs .tabcontent").eq(0).children("div").eq(1).find("table tr").each(function(index, el) {
                var $tds;
                if(($tds = $(el).find("td")).length == 2) {
                    specs.push([commons.cleanLine($tds.eq(0).text()), 
                        commons.getLines($tds.eq(1))]);
                }
            });
            return specs;
        },
        images: function($body, $) {
            var images = [];
            $body.find('#thumbnail a[href*=265x310]').each(function(i, el) {
                images.push($(el).attr("href"));
            });
            return images;
        },
        price: function($body, $) {
            var regularPrice = $body.find('.productPrice .srp .priceStriked').text(),
                currentPrice = $body.find('.productPrice .price .variantPrice').text();
            return commons.parsePrice(currentPrice, regularPrice);
        }
    }
};
