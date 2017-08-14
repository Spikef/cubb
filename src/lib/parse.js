var utils = require('./utils');
var rules = require('./rules');
var clean = require('./render').clean;

function parse(string, options) {
    return token(serialize(string, options));
}

function serialize(string, options) {
    return string
        .replace(/\r(\n?)/g, '\n')
        .replace(/\t/g, options.tab)
        .replace(/\u00a0/g, ' ')
        .replace(/\u2424/g, '\n');
}

function token(str) {
    var tokens = [];
    var cap, block, bull, item, titles, aligns, header, i, l;

    while (str) {
        // box
        if (cap = rules.box.exec(str)) {
            str = str.substring(cap[0].length);

            block = {
                type: 'box',
                width: 0,
                align: null,
                border: /^:?=/.test(cap[0]) ? 'double' : 'single',
                rows: cap[3].replace(/^[|║]\s*|\s*[|║]$/g, '').split(/\s*[|║]\n[|║]\s*/)
            };

            if (cap[1] && cap[2]) {
                block.align = 'center';
            } else if (cap[1]) {
                block.align = 'left';
            } else if (cap[2]) {
                block.align = 'right';
            }

            block.rows = block.rows.map(function(value) {
                item = {
                    value: value,
                    width: utils.stringWidth(clean(value))
                };

                block.width = Math.max(block.width, item.width);

                return item;
            });

            tokens.push(block);

            continue;
        }

        // list
        if (cap = rules.list.exec(str)) {
            str = str.substring(cap[0].length);
            bull = cap[1];

            block = {
                type: 'list',
                items: []
            };

            // items
            cap = cap[0].match(rules.item);

            for (i = 0, l = cap.length; i < l; i++) {
                item = cap[i].replace(/^ *[*+] +/, '');
                block.items.push(item);
            }

            tokens.push(block);

            continue;
        }

        // table
        if (cap = rules.table.exec(str)) {
            str = str.substring(cap[0].length);

            block = {
                type: 'table',
                widths: []
            };

            if (cap[1] && cap[2]) {
                block.headers = [];

                titles = cap[1].split(/ +\| +/);
                aligns = cap[2].split(/ +\| +/);

                for (i = 0; i < titles.length; i++) {
                    header = {
                        title: titles[i].trim(),
                        width: utils.stringWidth(clean(titles[i]))
                    };

                    block.widths[i] = block.widths[i] ? Math.max(header.width, block.widths[i]) : header.width;

                    if (/^-+:$/.test(aligns[i])) {
                        header.align = 'right';
                    } else if (/^:-+:$/.test(aligns[i])) {
                        header.align = 'center';
                    } else if (/^:-+$/.test(aligns[i])) {
                        header.align = 'left';
                    } else {
                        header.align = null;
                    }

                    block.headers.push(header);
                }
            }

            block.cells = cap[3].replace(/^\n+|\n+$/g, '').split('\n');
            block.cells = block.cells.map(function(cell, rowIndex) {
                cell = cell.replace(/^ *\||\| *$/g, '').split(/ +\| +/).map(utils.trim);
                item = {};
                item.rowIndex = rowIndex;
                item.type = cell.length === 1 && /^\[.*]$/.test(cell[0]) ? 'title' : 'row';

                if (item.type === 'title') {
                    item.title = cell[0].replace(/^\[|]$/g, '');
                } else {
                    item.cols = cell.map(function(col, colIndex) {
                        col = {
                            value: col,
                            width: 0,
                            colIndex: colIndex
                        };

                        col.width = utils.stringWidth(clean(col.value));
                        col.align = block.headers && block.headers[colIndex] ? block.headers[colIndex].align : null;

                        block.widths[colIndex] = block.widths[colIndex] ? Math.max(col.width, block.widths[colIndex]) : col.width;

                        return col;
                    });
                }

                return item;
            });

            tokens.push(block);

            continue;
        }

        // new line
        if (cap = rules.newline.exec(str)) {
            str = str.substring(cap[0].length);

            tokens.push({
                type: 'space',
                value: cap[0]
            });

            continue;
        }

        // text
        if (cap = rules.text.exec(str)) {
            str = str.substring(cap[0].length);

            tokens.push({
                type: 'text',
                value: cap[0]
            });

            continue;
        }

        if (str) {
            throw new Error('Infinite loop on byte: ' + str.charCodeAt(0));
        }
    }

    return tokens;
}

module.exports = parse;