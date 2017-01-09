var moment = require('moment');

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

function Record(options, records) {
    this.options = options;
    this.records = records;
}

Record.prototype.push = function(record) {
    this.records.push(this.parseRecord(record));
}

Record.prototype.sort = function(columns, columnDirections) {
    sortedRecords = this.records.slice();
    sortedRecords.sort(sortByColumns(columns, columnDirections));
    return new Record(this.options, sortedRecords);
}

Record.prototype.outputReccords = function() {
    console.log(this.records);
    this.records.map((record) => {
        console.log(this.delimitedRecord(record));
    });
}

Record.prototype.delimitedRecord = function(record) {
    columnNames = this.options.columnNames;
    dateFormat = this.options.dateFormat;
    outputRecord = []
    for(var i = 0; i < columnNames.length; i++) {
        if(columnNames[i] == "birthdate")
            outputRecord.push(record[columnNames[i]].format(dateFormat))
        else
            outputRecord.push(record[columnNames[i]])
    }
    return outputRecord.join(this.options.delimiter);
}

// Convert dates to moment objects
Record.prototype.parseRecord = function(rawRecord) {
    rawRecord["birthdate"] = moment(rawRecord["birthdate"], this.options.dateFormat);
    return rawRecord;
}

module.exports = function(options) {
    return new Record(options, [])
};
