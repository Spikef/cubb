var utils = require('./utils');

var rules = {
    newline: /^\n+/,
    list: /^( *bullet) [\s\S]+?(?:\n(?!\1)\n?|\s*$)/,
    table: /^(?:(?: *\| *(.+) *\| *\n)(?: *\| *([-:]+[-| :]*) *\| *\n))?((?: *\|.*\| *(?:\n|$))+)/,
    text: /^[^\n]+/
};

rules.bullet = /(?:[*+])/;
rules.item = /^( *bullet) [^\n]*/;

rules.list = utils.replace(rules.list)(/bullet/g, rules.bullet)();
rules.item = utils.replace(rules.item, 'gm')(/bullet/g, rules.bullet)();

module.exports = rules;