// Define column names first that way they can be used in the cli options
const columnNames = ["last", "first", "gender", "dob"]
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


// Just using an array for storage simplicity
var records = []

// CSV Parsing
var parseOptions = { "delimiter" : argv['d'], trim: true }
var parser = csv.parse(parseOptions);
var input = fs.createReadStream(argv._[0]);

// Options
var sortColumns = argv.c.map((columnName) => {
    return columnNames.indexOf(columnName)
});
var sortDirections = argv.s.map((direction) => {
    switch(direction) {
        case 'ascending':
            return 1;
        case 'descending':
            return -1;
    }
});

// Sort an array of arrays by the columns values
function sortByColumns(columnIndices, columnDirections) {
    return function(a, b) {
        for(var i = 0; i < columnIndices.length; i++) {
            if(a[i] < b[i])
                return columnDirections[i] * -1;
            if(a[i] > b[i])
                return columnDirections[i];
        }
        return 0;
    }
}

// Convert dates to moment objects
function parseRecord(rawRecord) {
    rawRecord[4] = moment(rawRecord[4], dateFormat);
    return rawRecord;
}

// Display functions
function displayRecord(record) {
    outputRecord = record.slice()
    outputRecord[4] = record[4].format(dateFormat);
    console.log(outputRecord.join(argv.d));
}
function displayRecords(records) {
    records.map(displayRecord);
}

// Push each row to the records object
parser.on('data', (record) => {
    records.push(parseRecord(record));
});
input.pipe(parser)

parser.on('end', () => {
    records.sort(sortByColumns(sortColumns, sortDirections));
    displayRecords(records);
});
