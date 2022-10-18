var http = require('http');
var fs = require('fs');
var express = require('express');
const path = require('path'); 

var app = express();

app.use(express.static(path.join(__dirname, '/public')));
//creating server
http.createServer(function (req, res) {
    fs.readFile('index.html', function (err, html) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    });
}).listen(3000);