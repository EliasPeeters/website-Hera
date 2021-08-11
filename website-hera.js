var http = require('https')
  , vm = require('vm')
  , concat = require('concat-stream');
var pdf = require("pdf-creator-node");
var pdf = require('html-pdf');
var fs = require("fs");
let express = require('express');
const path = require('path');
const uuid = require('uuidv4');


app = express();

let port = 8084

var options = {
    format: "A4",
    orientation: "portrait",
};

var request = require('sync-request');
var res = request('GET', 'http://hades.eliaspeeters.de/assets/js/dualCalculator.js').getBody('utf8');

let context = {}
vm.createContext(context)
vm.runInContext(res, context);

var html = fs.readFileSync("htmlTeamplate.html", "utf8");
var options = { format: 'A4' };

app.get('/', (request, result) => {
    let name = uuid.uuid()
    let dezimalToBinary = []
    for (let i = 0; i < 10; i++) {
        dezimalToBinary.push(context.dezimalToDual(Math.round(Math.random() * 255)))
    }
    res.send(dezimalToBinary)
})

app.use('/assets', express.static('assets'))

pdf.create(html, options).toFile('./assets/test.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });

app.listen(port, () => {
    console.log(`Running on ${port}`)
})



