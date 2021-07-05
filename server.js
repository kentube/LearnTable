/* eslint-disable no-undef */
/* eslint-disable no-console */
var port = process.env.PORT || 3939;
var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
    if (req.url === '/favicon.ico') {
        return res.end();
    }
    console.log('>>> Incoming request to ' + req.url + ', ' + req.method);

    if (req.url === '/' && req.method === 'GET') {
        //res.writeHead(200, { 'Content-Type': 'text/html' });
        //res.end('Hello <strong>The Home Page</strong> ' + Date());
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let file = fs.createReadStream('index.html');
        file.pipe(res);

    } else if (req.url === '/learntable.csv' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        fs.readFile('./upload.txt', 'utf8', function (error, contents) {
            if (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end();
            }
            console.log('sending response for ' + req.url);
            res.end(contents);
        });
        console.log('after readFile');

    } else if (req.url === '/learntable.csv' && req.method === 'POST') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            fs.writeFile("./upload.txt", body, (err) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end();
                }
                console.log('The file has been saved!');
            });
            console.log('after writeFile');
            res.writeHead(200, { 'Content-Type': 'application/html' })
            res.end()
        });
        console.log('after request.on');

    } else if (req.url === '/bundle.js' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        let file = fs.createReadStream('bundle.js');
        file.pipe(res);
    } else if (req.url === '/bundle.css' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        let file = fs.createReadStream('bundle.css');
        file.pipe(res);
    } else if (req.url.startsWith("/images/") && req.method === 'GET') {
        let filepath = req.url.substring(1);
        let extension = filepath.substring(filepath.lastIndexOf("."));

        res.writeHead(200, { 'Content-Type': 'text/' + extension });
        let file = fs.createReadStream(filepath);
        file.pipe(res);

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end();
        console.error('Not found');
    }
}).listen(port);
console.log('Server running at port ' + port);
