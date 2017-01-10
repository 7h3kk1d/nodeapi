Node API
=======================
Usage: `Run node main.js -h`

Output 1 – Sorted by gender (females before males) then by last name ascending:
node main.js input_file -c gender last -s descending ascending`

Output 2 – sorted by birth date, ascending.
node main.js input_file -c dob -d ascending

Output 3 – sorted by last name, descending.
node main.js input_file -c last -d descending


Listens on port 3000 for api.
Delimiter for posting is expected to be the same used for input file.
In order to sort by multiple columns use the -c flag followed by column names and -s flag followed by ascending/descending

Tests
-----
npm test test/records.js
