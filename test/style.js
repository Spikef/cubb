var fs = require('fs');
var path = require('path');
var assert = require('assert');
var chalk = require('chalk');
var render = require('../src/lib/render');

var source = fs.readFileSync(path.resolve(__dirname, 'files/text.md'), 'utf8');
var texts = source.split(/\n/);

describe('Style', function() {
    it('should return a stylish text -- ubb', function() {
        assert.equal(chalk.redBright.bold.bgGreen('No support'), render.style(texts[0]));
    });

    it('should return a stylish text -- html', function() {
        assert.equal(chalk.redBright.bold.bgGreen('No support'), render.style(texts[1]));
    });
});
