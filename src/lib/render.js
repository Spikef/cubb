var utils = require('./utils');
var styles = require('./styles');
var boxes = require('./box');

var styleFlag = /[\[<]\/?(b|i|d|u|(bg)?color([=\s][^\]]+?)?|(bg)?(black|red|green|yellow|blue|magenta|cyan|white|gray)(bright)?)[\]>]/;
var styleFlagStart = new RegExp('^' + styleFlag.source, 'i');
var styleFlagGlobal = new RegExp(styleFlag.source, 'gi');

function render(tokens, options) {
    var result = '';

    tokens.forEach(function(token) {
        switch (token.type) {
            case 'space':
                result += token.value;
                break;
            case 'text':
                result += renderText(token.value, options.width);
                break;
            case 'table':
                result += renderTable(token, options);
                break;
            case 'list':
                result += renderList(token, options);
                break;
            case 'box':
                result += renderBox(token, options);
                break;
        }
    });

    return result;
}

function renderText(str, width) {
    if (width === 'auto') return style(str);

    var cap, w = 0;
    var string = '';

    while (str) {
        if (w >= width) {
            if (cap = /^[ `~!&)=|}:;,\].>/?！…）—】；：”'。，、？]+/.exec(str)) {
                str = str.substring(cap[0].length);
                string += cap[0];
            }

            w = 0;
            string += '\n';
            continue;
        }

        if (cap = /^\n+/.exec(str)) {
            str = str.substring(cap[0].length);
            continue;
        }

        if (cap = styleFlagStart.exec(str)) {
            str = str.substring(cap[0].length);
            string += cap[0];
            continue;
        }

        if (cap = /^./.exec(str)) {
            str = str.substring(cap[0].length);
            string += cap[0];
            w += utils.stringWidth(cap[0]);
            continue;
        }

        if (str) {
            string += str;
            str = '';
        }
    }

    return style(string);
}

function renderBox(token, options) {
    var opts = options.box;
    var styles = boxes[token.border];
    var margin = utils.repeatChars('\n', opts.margin);
    var padding = utils.repeatChars(opts.padding);
    var paddingHorizontal = utils.repeatChars(opts.paddingHorizontal);
    var paddingVertical = utils.repeatChars('\n', opts.paddingVertical);
    var borderStyle = ['<' + opts.borderColor + '>', '</' + opts.borderColor + '>'];
    var horizontal = utils.repeatChars(styles.horizontal, token.width + opts.paddingHorizontal * 2);
    var vertical = style(borderStyle[0] + styles.vertical + borderStyle[1]);
    var string = '';

    string += margin;
    string += padding + style(borderStyle[0] + styles.topLeft + horizontal + styles.topRight + borderStyle[1]);
    string += '\n';

    if (paddingVertical) {
        string += padding + vertical + utils.repeatChars(token.width + opts.paddingHorizontal * 2) + vertical;
        string += '\n';
    }

    string += token.rows.map(function(row) {
        row = renderCell(row.value, token.align, row.width, token.width);
        row = padding + vertical + paddingHorizontal + row + paddingHorizontal + vertical;
        return row;
    }).join('\n');

    if (paddingVertical) {
        string += '\n';
        string += padding + vertical + utils.repeatChars(token.width + opts.paddingHorizontal * 2) + vertical;
    }

    string += '\n';
    string += padding + style(borderStyle[0] + styles.bottomLeft + horizontal + styles.bottomRight + borderStyle[1]);
    string += margin;

    return string;
}

function renderList(token, options) {
    var opts = options.list;
    var space = utils.repeatChars('\n', opts.space);
    var margin = utils.repeatChars('\n', opts.margin);
    var bullet = utils.repeatChars(opts.padding) + opts.style + ' ';

    var string = token.items.map(function(item) {
        return bullet + style(item);
    }).join(space);

    string = margin + string + margin;

    return string;
}

function renderTable(token, options) {
    var opts = options.table;
    var margin = utils.repeatChars('\n', opts.margin);
    var padding = utils.repeatChars(opts.padding);
    var rowSpace = utils.repeatChars('\n', opts.rowSpace);
    var colSpace = utils.repeatChars(opts.colSpace);
    var titlePadding = utils.repeatChars(opts.titlePadding);

    var string = '';

    if (token.headers) {
        string += padding;
        token.headers.forEach(function(header, index) {
            if (index !== 0) string += colSpace;
            string += renderCell('<b>' + header.title + '</b>', header.align, header.width, token.widths[index]);
        });
        string += '\n';

        string += padding;
        token.widths.forEach(function(width, index) {
            if (index !== 0) string += colSpace;
            string += utils.repeatChars('=', width);
        });
        string += '\n';

        string += rowSpace;
    }

    token.cells.forEach(function(row, rowIndex) {
        if (rowIndex !== 0) string += rowSpace + '\n';

        if (row.type === 'title') {
            if (!rowSpace) string += '\n';
            string += titlePadding;
            string += style('<u>' + row.title + '</u>');
            if (!rowSpace) string += '\n';
        } else if (row.type === 'row') {
            string += padding;
            row.cols.forEach(function(col, colIndex) {
                if (colIndex !== 0) string += colSpace;
                string += renderCell(col.value, col.align, col.width, token.widths[colIndex]);
            });
        }
    });

    string = margin + string + margin;

    return string;
}

function renderCell(text, align, textWidth, cellWidth) {
    var spaceWidth = cellWidth - textWidth;
    var leftWidth, rightWidth, leftSpace, rightSpace, string;
    switch (align) {
        case 'center':
            leftWidth = Math.ceil(spaceWidth / 2);
            rightWidth = spaceWidth - leftWidth;
            leftSpace = utils.repeatChars(leftWidth);
            rightSpace = utils.repeatChars(rightWidth);
            string = leftSpace + text + rightSpace;
            break;
        case 'right':
            leftSpace = utils.repeatChars(spaceWidth);
            string = leftSpace + text;
            break;
        case 'left':
        case null:
        default:
            rightSpace = utils.repeatChars(spaceWidth);
            string = text + rightSpace;
            break;
    }

    return style(string);
}

function style(string) {
    return string
        .replace(/[\[<]b[\]>]/gi, styles.bold[0])
        .replace(/[\[<]\/b[\]>]/gi, styles.bold[1])
        .replace(/[\[<]i[\]>]/gi, styles.italic[0])
        .replace(/[\[<]\/i[\]>]/gi, styles.italic[1])
        .replace(/[\[<]d[\]>]/gi, styles.diminish[0])
        .replace(/[\[<]\/d[\]>]/gi, styles.diminish[1])
        .replace(/[\[<]u[\]>]/gi, styles.underline[0])
        .replace(/[\[<]\/u[\]>]/gi, styles.underline[1])
        .replace(/[\[<](bg)?(?:color[=\s])?(black|red|green|yellow|blue|magenta|cyan|white|gray)(bright)?[\]>]/gi, function($0, $1, $2, $3) {
            var key = '';
            if ($1) key += 'bg';
            if ($2) key += $1 ? utils.capitalize($2) : $2.toLowerCase();
            if ($3) key += 'Bright';

            return styles[key] || $0;
        })
        .replace(/[\[<]\/(bg)?(color|black|red|green|yellow|blue|magenta|cyan|white|gray)(bright)?[\]>]/gi, function($0, $1) {
            return $1 ? styles.bgColorClose : styles.colorClose;
        });
}

function clean(string) {
    return string.replace(styleFlagGlobal, '');
}

render.style = style;
render.clean = clean;

module.exports = render;
