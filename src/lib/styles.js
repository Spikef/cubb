var styles = {
    bold: [1, 22],
    italic: [3, 23],
    diminish: [2, 22],
    underline: [4, 24],
    // color
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    gray: 90,
    // Bright color
    redBright: 91,
    greenBright: 92,
    yellowBright: 93,
    blueBright: 94,
    magentaBright: 95,
    cyanBright: 96,
    whiteBright: 97,
    // close color
    colorClose: 39,
    // bgColor
    bgBlack: 40,
    bgRed: 41,
    bgGreen: 42,
    bgYellow: 43,
    bgBlue: 44,
    bgMagenta: 45,
    bgCyan: 46,
    bgWhite: 47,
    // Bright bg color
    bgBlackBright: 100,
    bgRedBright: 101,
    bgGreenBright: 102,
    bgYellowBright: 103,
    bgBlueBright: 104,
    bgMagentaBright: 105,
    bgCyanBright: 106,
    bgWhiteBright: 107,
    // close bgColor
    bgColorClose: 49
};

Object.keys(styles).forEach(function(key) {
    if (Array.isArray(styles[key])) {
        styles[key] = styles[key].map(function(code) {
            return '\u001B[' + code + 'm';
        });
    } else {
        styles[key] = '\u001B[' + styles[key] + 'm';
    }
});

module.exports = styles;