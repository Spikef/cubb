var fs = require('fs');
var path = require('path');
var assert = require('assert');
var render = require('../src/lib/render');

var source = fs.readFileSync(path.resolve(__dirname, 'files/text.md'), 'utf8');
var texts = source.split(/\n/);

describe('Clean', function() {
    it('should remove all tags -- ubb', function() {
        assert.equal('No support', render.clean(texts[0]));
    });

    it('should remove all tags -- html', function() {
        assert.equal('No support', render.clean(texts[1]));
    });
});
