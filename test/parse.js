var fs = require('fs');
var path = require('path');
var assert = require('assert');
var chalk = require('chalk');
var parse = require('../src/lib/parse');

var source;

source = fs.readFileSync(path.resolve(__dirname, 'files/list.md'), 'utf8');
var lists = source.split(/\n-{3,}\n/);

source = fs.readFileSync(path.resolve(__dirname, 'files/table.md'), 'utf8');
var tables = source.split(/\n-{3,}\n/);

describe('Parse', function() {
    it('parse list', function() {
        var tokens = parse(lists[0], { tab: '    ' });
        assert.equal(JSON.stringify(tokens), JSON.stringify(JSON.parse(lists[1].replace(/^\s+|\s+$/g, ''))));
    });

    it('parse table with header', function() {
        var tokens = parse(tables[0], { tab: '    ' });
        assert.equal(JSON.stringify(tokens), JSON.stringify(JSON.parse(tables[2].replace(/^\s+|\s+$/g, ''))));
    });
});