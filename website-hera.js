var http = require('https')
  , vm = require('vm')
  , concat = require('concat-stream');
var pdf = require("pdf-creator-node");
var fs = require("fs");
let express = require('express');
const path = require('path');
const uuid = require('uuidv4');


app = express();

let port = 8084

var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "0mm",
    },
    footer: {
        height: "28mm"
    }
};

var request = require('sync-request');
var res = request('GET', 'http://hades.eliaspeeters.de/assets/js/dualCalculator.js').getBody('utf8');

let context = {}
vm.createContext(context)
vm.runInContext(res, context);

app.get('/', (request, result) => {
    let name = uuid.uuid()
    let dezimalToBinary = []
    for (let i = 0; i < 10; i++) {
        dezimalToBinary.push(context.dezimalToDual(Math.round(Math.random() * 255)))
    }

    var document = {
        html: html,
        data: {
          dezimalToBinary: dezimalToBinary
        },
        path: `pdfs/${name}.pdf`,
        type: "",
    };

    pdf.create(document, options).then((res) => {
        console.log(res);
        // result.send(res)
        result.sendFile(path.join(__dirname, '/pdfs', `${name}.pdf`))
      })
      .catch((error) => {
        console.error(error);
      });
})

app.listen(port, () => {
    console.log(`Running on ${port}`)
})

var html = fs.readFileSync("htmlTeamplate.html", "utf8");

