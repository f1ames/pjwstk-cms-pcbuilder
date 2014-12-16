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
    parsers: {
        // description: function(response, $) {
        //     return $("#tabs .tabcontent").eq(0).children("div").eq(0).html();
        // },
        // specs: function(response, $) {
        //     return $("#tabs .tabcontent").eq(0).children("div").eq(1).html();
        // },
        // images: function(response, $) {
        //     var images = [];
        //     $('#thumbnail a[href*=265x310]').each(function(i, el) {
        //         images.push($(el).attr("href"));
        //     });
        //     return images;
        // },
        // domain: function(response, $) {
        //     return 'agito.pl';
        // }
    }
};
