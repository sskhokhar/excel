var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");
var XLSX = require('xlsx');
var randomToken = require('random-token');
var app = express();

const server = "http://0.0.0.0";
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile('write.html', { root: __dirname });
});

app.post('/write', function(req, res) {
    var data = req.body.data;
    console.log(data);

    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    var saltToken = randomToken.create('0123456789');
    var token = saltToken(5);
    token += '.xlsx';
    XLSX.writeFile(wb, token);
    res.send({ filename: token });
});

app.get('/download/:filename', function(req, res) {
    res.sendFile(req.params.filename, { root: __dirname });
});

app.get('/reader', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.listen(8000, function() {
    console.log("server started");
});