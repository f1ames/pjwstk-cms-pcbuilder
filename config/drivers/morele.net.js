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
            "/strefa-gracza/"
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
        var path = currentUrl.split('.net/').pop();
        return (url.indexOf('-' + id) !== -1 && url.split('/').length > 5)
            && (path.length > 20 && (path.match(/\//g) || []).length < 2);
    },
    categories: {
        464: "myszki",
        18: "klawiatury",
        42: "plyty_glowne",
        45: "procesory",
        60: "chlodzenie",
        4: "dyski_twarde",
        12: "karty_graficzne",
        11: "karty_dzwiekowe",
        14: "karty_sieciowe",
        15: "tunery_tv",
        33: "obudowy",
        61: "zasilacze",
        28: "napedy",
        38: "ram",
        523: "monitory"
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
                    specs.push([$tds.eq(0).text(), $tds.eq(1).text()]);
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
        }
    }
};
