var assert = require('assert');
var should = require('should');
var moment = require('moment');
var recordGenerator = require('../records');

describe('Record', function() {
    var records;

    beforeEach(function() {
        records = recordGenerator({dateFormat: "M/D/YYYY", columnNames: ["birthdate", "last"], delimiter: ','}, []);
    });

    describe('#push', function() {
        it('should convert birthdates into moment objects', function() {
           records.push({birthdate: "01/01/1991", last: "lastName"});
           records.records.should.have.lengthOf(1);
           moment.isMoment(records.records[0].birthdate).should.be.true();
           moment.isMoment(records.records[0].last).should.be.false();
        });
    });

    describe('#delimitedRecord', function() {
        it('should output a csv delimited output', function() {
           records.push({birthdate: "01/01/1991", last: "lastName"});
           records.delimitedRecord(records.records[0]).should.equal("1/1/1991,lastName")
        });
    });
    describe('#sort', function() {
        it('should be able to sort by a column in ascending order', function() {
           records.push({birthdate: "01/01/1991", last: "oldest"});
           records.push({birthdate: "01/01/1993", last: "youngest"});
           records.push({birthdate: "01/01/1992", last: "middle"});
           sorted = records.sort(["birthdate"],[1])

           sorted.records[0].last.should.equal("oldest")
           sorted.records[1].last.should.equal("middle")
           sorted.records[2].last.should.equal("youngest")
        });
        it('should be able to sort by a column in descending order', function() {
           records.push({birthdate: "01/01/1991", last: "oldest"});
           records.push({birthdate: "01/01/1993", last: "youngest"});
           records.push({birthdate: "01/01/1992", last: "middle"});
           sorted = records.sort(["birthdate"],[-1])

           sorted.records[0].last.should.equal("youngest")
           sorted.records[1].last.should.equal("middle")
           sorted.records[2].last.should.equal("oldest")
        });
        it('should be able to sort by multiple columns', function() {
           records.push({birthdate: "01/01/1991", last: "A"});
           records.push({birthdate: "01/01/1991", last: "B"});
           records.push({birthdate: "01/01/1992", last: "A"});
           records.push({birthdate: "01/01/1992", last: "B"});
           sorted = records.sort(["birthdate", "last"],[1, -1])

           sorted.records[0].last.should.equal("B")
           moment("01/01/1991", "M/D/YYYY").isSame(sorted.records[0].birthdate);
           sorted.records[1].last.should.equal("A")
           moment("01/01/1991", "M/D/YYYY").isSame(sorted.records[1].birthdate);
           sorted.records[2].last.should.equal("B")
           moment("01/01/1992", "M/D/YYYY").isSame(sorted.records[2].birthdate);
           sorted.records[3].last.should.equal("A")
           moment("01/01/1992", "M/D/YYYY").isSame(sorted.records[3].birthdate);
        });
    });
});
