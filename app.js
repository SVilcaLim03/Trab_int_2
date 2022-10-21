var express = require('express');

var app = express();
const port = 3000

app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('',(req, res) => {
    res.render('index', {text: ''})
})

app.get('/speech_trans', (req, res) => {
    res.render('speech_trans',{text: ''})
})

app.get('/s_t_micro', (req, res) => {
    res.render('s_t_micro',{text: ''})
})

app.listen(port, () => console.info(`App listening on port ${port}`))
/*
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
}).listen(3000);*/