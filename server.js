
var http = require('http'),
	fs = require('fs'),
	path = require('path');
var mimes = {
	".html" : "text/html",
	".css" 	: "text/css",
	".js" 	: "text/javascript",
	".gif"	: "image/jpeg",
	".jpeg"	: "ïmage/jpeg",
	".png"	: "image/png",
	".woff"	: "font/woff"
}

function onRequest(request, response) {
	var filepath = (request.url === '/') ? ('./index.html') : ('.' + request.url);
	var contentType = mimes[path.extname(filepath)];
	
	fs.readFile(filepath, function(error, data) {
		if (error) {
			response.writeHead(404);
			response.write('File not Found!');
		} else {
			response.writeHead(200, {'Content-Type': contentType});
			response.end(data, 'utf-8');
		}
		response.end();

	});
}
http.createServer(onRequest).listen(8000);



