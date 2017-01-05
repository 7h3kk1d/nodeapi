// Define column names first that way they can be used in the cli options
const column_names = ["last", "first", "gender", "dob"]

// Adds cli options
var argv = require('yargs') // Adds cli options
    .usage('Usage: $0 <input_file> [options]')
    .demandCommand(1)
    .alias('d', 'delimiter')
    .option('sort-column', {
        alias: 'c',
        describe: 'Column to sort',
        choices: column_names
     })
    .option('sort-direction', {
        alias: 's',
        describe: 'Direction of sort',
        choices: ['ascending', 'descinding'] 
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
var parseOptions = { "delimiter" : argv['d'] }
var parser = csv.parse(parseOptions);
var input = fs.createReadStream(argv._[0]);

// Sort an array of arrays by the columns values
function sortByColumn(columnIndices) {
    return (a, b) => {
        if(a[columnIndex] < b[columnIndex])
            return -1;
        if(a[columnIndex] > b[columnIndex])
            return 1;
        return 0;
    }
}

// Convert dates to moment objects
function parseRecord(rawRecord) {
    rawRecord[4] = moment(rawRecord[4], "M/D/YYYY");
    return rawRecord;
}

// Push each row to the records object
parser.on('data', (record) => {
    records.push(parseRecord(record));
});
input.pipe(parser)

parser.on('end', () => {
    records.sort(sortByColumn(4));
    console.log(records);
});
