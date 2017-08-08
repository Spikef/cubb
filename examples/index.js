var fs = require('fs');
var path = require('path');
var Cubb = require('../src');

var options = {
    list: {
        space: 2,
        style: '+'
    }
};

var cubb = new Cubb(options);
var source = fs.readFileSync(path.resolve(__dirname, 'complex.md'), 'utf8');

console.log(cubb.render(source));