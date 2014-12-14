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
        maxDepth: 15,
        requestDelay: 4,
        obeyRobotsTxt: false,
        allowedContentTypes: [
            "text/html",
            "application/xhtml+xml",
            "application/xml"
        ],
        logLevel: 'error'
    },
    prefix: 'AGI',
    categories: {
        64: "myszki",
        65: "klawiatury",
        79: "plyty_glowne",
        81: "procesory",
        82: "chlodzenie",
        83: "dyski_twarde",
        84: "karty_graficzne",
        85: "karty_dzwiekowe",
        89: "karty_sieciowe",
        130: "tunery_tv",
        91: "obudowy",
        221: "zasilacze",
        693: "napedy",
        707: "ram",
        3005: "monitory"
    },
    parsers: {
        description: function(response, $) {
            return $("#tabs .tabcontent").eq(0).children("div").eq(0).html();
        },
        specs: function(response, $) {
            return $("#tabs .tabcontent").eq(0).children("div").eq(1).html();
        },
        images: function(response, $) {
            var images = [];
            $('#thumbnail a[href*=265x310]').each(function(i, el) {
                images.push($(el).attr("href"));
            });
            return images;
        },
        domain: function(response, $) {
            return 'agito.pl';
        }
    }
};
