// load in the modules we are using for this project
// fs = filesystem, access folders on the PC
// request lets us make calls to websites
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// site we want to check
var url = process.argv[2] || "http://www.google.com";

// using the request module. the response is what we will look at to make sure the link works. 200 = GOOD, 404 = BAD, idk other numbers very well.
request(url, function(error, response, body) {
	// create variable for HTML page and new array for the links
	if (!error && response.statusCode == 200) {
		$ = cheerio.load(body);
		var filtered = [];
		var links = $('a');
		links.each(function(index, link){
			var data = {};
			data.url = $(link).attr('href');
			data.name = $(link).text();
			filtered.push(data);
		})
		console.log("There are " + filtered.length + " links on the page.");


		// now we check statusCode of each link
		filtered.forEach(function(link){
			checkLink(link);
		})
	}
});

var checkLink = function(data){
	request(data.url, function(err, response, body){
		if(!err){
			if (response.statusCode == 200) {
				console.log(">> RESPONSE " + response.statusCode + " : " + data.url);
			} else {
				console.log(">> RESPONSE " + response.statusCode + " : " + data.url);
			}
		}
	})
};
