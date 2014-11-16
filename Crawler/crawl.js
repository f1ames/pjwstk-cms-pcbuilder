var crawler = require("./crawler.js");
(new crawler(process.argv[2])).crawl();
