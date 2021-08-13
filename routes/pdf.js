var fs = require("fs");
var pdf = require("pdf-creator-node");
const path = require('path');
const uuid = require('uuidv4');

var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "1mm",
    },
    footer: {
        height: "1mm",
    }
};

var htmlTask = fs.readFileSync("tasks.html", "utf8");
var htmlSolution = fs.readFileSync("solutions.html", "utf8");

app.get('/createpdf', (req, res) => {
    let name = uuid.uuid()
    let binaryToDezimalLength = (req.query.binaryToDezimal != null) ? req.query.binaryToDezimal: 10;
    let dezimalToBinaryLength = (req.query.dezimalToBinary != null) ? req.query.dezimalToBinary: 10;
    let binaryAddtionLength = (req.query.binaryAddition != null) ? req.query.binaryAddition: 10;
    console.log(binaryAddtionLength)
    console.log(req.query)

    let binaryToDezimal = []
    for (let i = 0; i < binaryToDezimalLength; i++) {
        let task = context.randomDualNumber(2, 10)
        binaryToDezimal.push({
            task: task,
            solution: context.dualToDezimal(task)
        })
    }

    let dezimalToBinary = []
    for (let i = 0; i < dezimalToBinaryLength; i++) {
        let task = Math.round(Math.random() * 255);
        dezimalToBinary.push({
            task: task,
            solution: context.dezimalToDual(task)
        })
    }

    let binaryAddtion = []
    for (let i = 0; i < binaryAddtionLength; i++) {
        let task = {
            number1: context.randomDualNumber(2, 10),
            number2: context.randomDualNumber(2, 10),
        };
        binaryAddtion.push({
            task: task,
            solution: context.additionDual(task.number1, task.number2)
        })
    }


    var documentTask = {
        html: htmlTask,
        data: {
            binaryToDezimal: binaryToDezimal,
            dezimalToBinary: dezimalToBinary,
            binaryAddtion: binaryAddtion
        },
        path: `./pdfs/${name}Task.pdf`,
        type: "",
    };

    var documentSolution = {
        html: htmlSolution,
        data: {
            binaryToDezimal: binaryToDezimal,
            dezimalToBinary: dezimalToBinary,
            binaryAddtion: binaryAddtion
        },
        path: `./pdfs/${name}Solution.pdf`,
        type: "",
    };

    let local = 'http://localhost:8084'
    let external = 'https://hera.eliaspeeters.de'
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