require('./lib/polyfill');

var utils = require('./lib/utils');
var parse = require('./lib/parse');
var render = require('./lib/render');

var configs = {
    tab: '    ',
    width: 'auto',
    box: {
        width: 'auto',
        margin: 1,
        padding: 2,
        borderColor: 'yellow',
        paddingVertical: 0,
        paddingHorizontal: 1
    },
    list: {
        width: 'auto',
        style: '*',
        space: 0,
        margin: 1,
        padding: 2
    },
    table: {
        width: 'auto',
        margin: 1,
        padding: 2,
        rowSpace: 0,
        colSpace: 4,
        titlePadding: 2
    }
};

function Cubb(options) {
    if (!this instanceof Cubb) {
        return new Cubb(options);
    }

    this.options = utils.merge(configs, options);
}

/**
 * render string
 * @param {string} string
 * @param {Object} [options] - options
 * @param {string} [options.tab='    '] - \t
 * @param {number} [options.width='auto'] - max width
 */
Cubb.prototype.render = function(string, options) {
    if (typeof string !== 'string') {
        throw new Error('String is needed!');
    }

    var opts;
    if (options) {
        opts = utils.merge(this.options, options);
    } else {
        opts = this.options;
    }

    var tokens = parse(string, opts);
    return render(tokens, opts);
};

Cubb.prototype.clean = render.clean;
Cubb.clean = render.clean;

module.exports = Cubb;