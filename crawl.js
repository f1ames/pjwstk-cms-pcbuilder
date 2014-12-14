// e.g. node crawl.js agito.pl

var crawler = require('./lib/crawler.js');
(new crawler(process.argv[2])).crawl();
