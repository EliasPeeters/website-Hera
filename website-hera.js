var http = require('https')
  , vm = require('vm')
  , concat = require('concat-stream');

  const bodyParser = require('body-parser');
var pdf = require("pdf-creator-node");
var fs = require("fs");
let express = require('express');
const path = require('path');
const uuid = require('uuidv4');


app = express();

let statusRoute = require('./routes/status')
let pdfRoute = require('./routes/pdf')


// load file from Hades
var request = require('sync-request');
var res = request('GET', 'http://hades.eliaspeeters.de/assets/js/dualCalculator.js').getBody('utf8');

context = {}
vm.createContext(context)
vm.runInContext(res, context);



app.use('/pdfs', express.static('pdfs'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = 8084
app.listen(port, () => {
    console.log(`Running on ${port}`)
})



