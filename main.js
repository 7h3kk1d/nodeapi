// Define column names first that way they can be used in the cli options
const columnNames = ["last", "first", "gender", "favorite_color", "birthdate"]
const dateFormat = "M/D/YYYY";

// Adds cli options
var argv = require('yargs') // Adds cli options
    .usage('Usage: $0 <input_file> [options]')
    .demandCommand(1)
    .alias('d', 'delimiter')
    .option('sort-column', {
        alias: 'c',
        describe: 'Column to sort',
        choices: columnNames,
        array: true
     })
    .option('sort-direction', {
        alias: 's',
        describe: 'Direction of sort',
        choices: ['ascending', 'descending'] ,
        array: true
     })
    .default('d', ',')
    .help('h')
    .alias('h', 'help')
    .argv;

// Libraries
var fs = require('fs');
var csv = require('csv');
var parse = require('csv-parse/lib/sync');
var express = require('express');
var bodyParser = require('body-parser');

// Just using an array for storage simplicity
var records = require('./records')({columnNames: columnNames,
                                    dateFormat: dateFormat,
                                    delimiter: argv.d});
var app = express();
app.use(bodyParser.text());

// CSV Parsing
var parseOptions = { delimiter : argv.d,
                     trim: true,
                     columns: columnNames}
var parser = csv.parse(parseOptions);
var input = fs.createReadStream(argv._[0]);

// Map ascending to 1 and descending to -1 to match JS convention for comparators
var sortDirections = argv.s.map((direction) => {
    switch(direction) {
        case 'ascending':
            return 1;
        case 'descending':
            return -1;
    }
});

// Push each row to the records object
parser.on('data', (record) => {
    records.push(record);
});
input.pipe(parser)

parser.on('end', () => {
    records.sort(argv.c, sortDirections).outputReccords();
});

app.get('/records/:sortColumn', function(req, res) {
    var sortColumns = [];
    var sortDirection = [];
    var sorted = records;

    switch(req.params["sortColumn"]) {
        case "name":
            sortColumns = ["last", "first"]
            sortDirection = [1, 1]
            break;
        default:
            sortColumns = [req.params["sortColumn"]]
            sortDirection = [1]
    }

    sorted = sorted.sort(sortColumns, sortDirection);
    res.send({records: sorted.records});
});

app.post('/records', function(req, res) {
    records.push(parse(req.body, parseOptions));
    res.send();
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});
