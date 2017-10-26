var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");
var XLSX = require('xlsx');
var multiparty = require('multiparty');
var fs = require('fs-extra');
var exceljs = require('exceljs');
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
    var data = req.body;
    console.log(data);
    var dataArray = [];
    var temp = data.data[0];
    temp.key = function(n) {
        return this[Object.keys(this)[n]];
    };
    console.log("Data: ", temp);
    for (var index = 0; index < 17; index++) {
        dataArray.push(temp.key(index));
    }
    console.log(dataArray);
    var workbook = new exceljs.Workbook();
    workbook.xlsx.readFile('./' + data.fileName)
        .then(function(e) {
            var worksheet = e.getWorksheet('AD');
            var row = worksheet.getRow(5);
            for (var index = 0; index < dataArray.length; index++) {
                row.getCell(index + 2).value = dataArray[index];
            }
            row.commit();
            //console.log(row.values);
            // row.values = dataArray;
            // //row.commit();
            // worksheet.addRows(dataArray);
            //console.log(row);
            // worksheet.getCell('E23').value = worksheet.getCell('E23').value + " wOHOO";
            // worksheet.getCell('R5').value = "cuggu";
            // worksheet.getCell('E20').value = worksheet.getCell('E20').value + " asdfasdf";
            workbook.xlsx.writeFile('./' + data.fileName)
                .then(function() {
                    res.send({ filename: data.fileName });
                });
        });

    // var ws = XLSX.utils.json_to_sheet(data);
    // var wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    // var saltToken = randomToken.create('0123456789');
    // var token = saltToken(5);
    // token += '.xlsx';
    // XLSX.writeFile(wb, token);
    // res.send({ filename: token });
});

app.get('/download/:filename', function(req, res) {
    res.sendFile(req.params.filename, { root: __dirname });
});

app.get('/reader', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.post('/upload', function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var a = files.file[0].originalFilename;
        console.log(a);
        fs.move(files.file[0].path, "./" + a, { overwrite: true }, err => err !== undefined ? res.sendStatus(404).status("error uploading file") : res.send(a));
    });
});

app.listen(8000, function() {
    console.log("server stareted");
});