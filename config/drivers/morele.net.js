var commons = require('../commons.js'); 

module.exports = {
    config: {
        startUrls: [
            "http://www.morele.net"
        ],
        allowedDomains: [
            "morele.net"
        ],
        whitelist: [
            "/www.morele.net/"
        ],
        blacklist: [
            "/wiadomosc",
            "/wiadomosc/",
            "/koszyk",
            "/koszyk/",
            "/info/",
            "/sklep/",
            "/user/",
            "/kontakt",
            "/pomoc",
            "/o_nas",
            "/rtv/",
            "/agd/",
            "/fotografia-i-kamery/",
            "/telefony/",
            "/biuro/",
            "/rtv",
            "/agd",
            "/fotografia-i-kamery",
            "/telefony",
            "/biuro",
            "/strefa-gracza",
            "/strefa-gracza/",
            "/produkt/",
            "/rma_list/",
            "/inventory/",
            "/pokaz_pomoc/",
            "/feedback/",
            /,\d+O\d+\/\d+/gi
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
    prefix: 'MOR',
    skipIfNoCategory: true,
    checkPath: true,
    isCurrentCategory: function(id, url, currentUrl) {
        var id = '' + id,
            cid = url.substr(-(id.length + 1)); 
            path = currentUrl.split('.net/').pop();

        return (cid == ('-' + id) || url.indexOf('-' + id + '/') !== -1)
            && url.split('/').length > 5
            && (path.length > 20 && (path.match(/\//g) || []).length < 2);
    },
    categoriesNormalized: {
        45: 1,
        38: 2,
        42: 3,
        4: 4,
        61: 5,
        60: 6,
        12: 7,
        14: 8,
        11: 9,
        33: 10,
        28: 11,
        15: 12,
        18: 13,
        464: 14,
        523: 15
    },
    parsers: {
        descriptionTitle: function($body, $) {
            return $body.find('.product-name h1.name').text();
        },
        descriptionBody: function($body, $) {
            return $body.find('.description .wc_desc').text();
        },
        specs: function($body, $) {
            var specs = [];
            $body.find("table.feature-info tr").each(function(index, el) {
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
            $body.find('.image-product > ul > li img').each(function(i, el) {
                images.push($(el).attr("src"));
            });
            return images;
        },
        price: function($body, $) {
            return commons.parsePrice($body.find('.id-price .price span').text());
        }
    }
};
