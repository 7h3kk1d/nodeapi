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
var moment = require('moment');
var express = require('express');


// Just using an array for storage simplicity
var records = []
var app = express();

// CSV Parsing
var parseOptions = { "delimiter" : argv['d'], trim: true, columns: columnNames}
var parser = csv.parse(parseOptions);
var input = fs.createReadStream(argv._[0]);

// Options
var sortDirections = argv.s.map((direction) => {
    switch(direction) {
        case 'ascending':
            return 1;
        case 'descending':
            return -1;
    }
});

// Sort an array of arrays by the columns values
function sortByColumns(columns, columnDirections) {
    return function(a, b) {
        for(var i = 0; i < columns.length; i++) {
            if(a[columns[i]] < b[columns[i]])
                return columnDirections[i] * -1;
            if(a[columns[i]] > b[columns[i]])
                return columnDirections[i];
        }
        return 0;
    }
}

// Convert dates to moment objects
function parseRecord(rawRecord) {
    rawRecord["birthdate"] = moment(rawRecord["birthdate"], dateFormat);
    return rawRecord;
}

// Display functions
function delimitedRecord(record) {
    outputRecord = []
    for(var i = 0; i < columnNames.length; i++) {
        if(columnNames[i] == "birthdate")
            outputRecord.push(record[columnNames[i]].format(dateFormat))
        else
            outputRecord.push(record[columnNames[i]])
    }
    return outputRecord.join(argv.d);
}

function displayRecords(records) {
    records.map((record) => {
        console.log(delimitedRecord(record));
    });
}

// Push each row to the records object
parser.on('data', (record) => {
    records.push(parseRecord(record));
});
input.pipe(parser)

parser.on('end', () => {
    records.sort(sortByColumns(argv.c, sortDirections));
    displayRecords(records);
});

app.get('/records/:sortColumn', function(req, res) {
    switch(req.params["sortColumn"]) {
        case "name":
            sortColumns = ["last", "first"]
            sortDirections = [1, 1]
            break;
        default:
            sortColumns = [req.params["sortColumn"]]
            sortDirections = [1]
    }

    copiedRecords = records.slice() // Copy array so sorting is not in place
    copiedRecords.sort(sortByColumns(sortColumns, sortDirections)); // Sort ascending
    res.send({records: copiedRecords});
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});
