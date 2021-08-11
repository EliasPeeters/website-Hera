var fs = require("fs");
var pdf = require("pdf-creator-node");
const path = require('path');
const uuid = require('uuidv4');

var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm"
};

var htmlTask = fs.readFileSync("tasks.html", "utf8");
var htmlSolution = fs.readFileSync("solutions.html", "utf8");

app.get('/createpdf', (req, res) => {
    let name = uuid.uuid()
    let binaryToDezimalLength = (req.query.binaryToDezimal != null) ? req.query.binaryToDezimal: 10;
    let dezimalToBinaryLength = (req.query.dezimalToBinary != null) ? req.query.dezimalToBinary: 10;


    let binaryToDezimal = []
    for (let i = 0; i < binaryToDezimalLength; i++) {
        let task = context.randomDualNumber(2, 10)
        binaryToDezimal.push({
            task: task,
            solution: context.dualToDezimal(task)
        })
    }

    dezimalToBinary = []
    for (let i = 0; i < dezimalToBinaryLength; i++) {
        let task = Math.round(Math.random() * 255);
        dezimalToBinary.push({
            task: task,
            solution: context.dezimalToDual(task)
        })
    }

    var documentTask = {
        html: htmlTask,
        data: {
            binaryToDezimal: binaryToDezimal,
            dezimalToBinary: dezimalToBinary
        },
        path: `./pdfs/${name}Task.pdf`,
        type: "",
    };

    var documentSolution = {
        html: htmlSolution,
        data: {
            binaryToDezimal: binaryToDezimal,
            dezimalToBinary: dezimalToBinary
        },
        path: `./pdfs/${name}Solution.pdf`,
        type: "",
    };

    let local = 'localhost:8084'
    let external = 'hera.eliaspeeters.de'
    let server = ''
    if (process.env.SERVER == 'local') {
        server = local
    } else {
        server = external
    }

    pdf.create(documentTask, options).then((result) => {
        pdf.create(documentSolution, options).then((result) => {
            res.send({
                task: `${server}/pdfs/${name}Task.pdf`,
                solution: `${server}/pdfs/${name}Solution.pdf`
            })
        })
        .catch((error) => {
            console.error(error);
        });
    })
    .catch((error) => {
        console.error(error);
    });
})