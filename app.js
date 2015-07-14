// load in the modules we are using for this project
// fs = filesystem, access folders on the PC
// request lets us make calls to websites
var fs 				= require('fs');
var request 		= require('request');
var cheerio 		= require('cheerio');
var input		 	= process.argv[2];
var starting 		= process.argv[3] || 2;
var ending 			= process.argv[4] || 65;

// site we want to check
if (input === "resources") {
	var url = "http://www.riprc.org/resources/?resource-audience&resource-topic&resource-type&resource-location";
	console.log("Starting at PAGE:" + starting + " and ending at PAGE:" + ending)
} else {
	var url = input || "http://www.google.com";
}

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

		if(input === "resources"){

			for(var page = starting; page < ending; page++){
				console.log("Looking at page " + page)
				var site = "http://www.riprc.org/resources/page/" + page + "/?resource-audience&resource-topic&resource-type&resource-location"
				request(site, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						var origin = site;
						var resources = [];
						$ = cheerio.load(body);
						var links = $('a');
						links.each(function(index, link){
							var data = {};
							data.url = $(link).attr('href');
							data.name = $(link).text();
							// data.origin = origin;
							resources.push(data);
						})
						resources.forEach(function(link){
							checkLink(link, origin);
						})
					}
				})
			}
		}
		console.log("There are " + filtered.length + " links on the page.");

		// now we check statusCode of each link
		filtered.forEach(function(link){
			checkLink(link, url);
		})
	}
});

// if you only want to print broken links, comment out the good link response.
var checkLink = function(data, origin){
	request(data.url, function(err, response, body){
		if(!err){
			if (response.statusCode == 200) {
				// GOOD LINK
				console.log(">> RESPONSE " + response.statusCode + " : " + data.url);
			} else {
				// BAD LINK
				console.log(">> RESPONSE " + response.statusCode + " : " + data.url);
			}
		}
	})
};

