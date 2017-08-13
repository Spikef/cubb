exports.capitalize = function capitalize(word) {
    if (typeof word !== 'string') {
        throw new Error('Argument type error: ' + word);
    }

    return word.toLowerCase().replace(/^[a-z]/, function($0) {
        return $0.toUpperCase();
    });
};

exports.merge = function merge() {
    var target = {};

    for (var index = 0; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    if (source[key] && typeof source[key] === 'object') {
                        target[key] = merge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            }
        }
    }

    return target;
};

exports.trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};

exports.replace = function replace(regex, opt) {
    regex = regex.source;
    opt = opt || '';

    return function self(name, val) {
        if (!name) return new RegExp(regex, opt);
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return self;
    };
};

exports.repeatChars = function repeatChars(char, count) {
    if (arguments.length <= 1) {
        count = char;
        char = ' ';
    }

    return new Array(parseInt(count) + 1).join(char);
};

exports.stringWidth = function stringWidth(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return 0;
    }

    var width = 0;

    for (var i = 0; i < str.length; i++) {
        var code = str.codePointAt(i);

        // Ignore control characters
        if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
            continue;
        }

        // Ignore combining characters
        if (code >= 0x300 && code <= 0x36F) {
            continue;
        }

        // Surrogates
        if (code > 0xFFFF) {
            i++;
        }

        width += this.isWideChar(code) ? 2 : 1;
    }

    return width;
};

exports.isWideChar = function isWideChar(code) {
    if (isNaN(code)) return false;

    // code points are derived from:
    // http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
    return code >= 0x1100 && (
        code <= 0x115f ||  // Hangul Jamo
        code === 0x2329 || // LEFT-POINTING ANGLE BRACKET
        code === 0x232a || // RIGHT-POINTING ANGLE BRACKET
        // CJK Radicals Supplement .. Enclosed CJK Letters and Months
        (0x2e80 <= code && code <= 0x3247 && code !== 0x303f) ||
        // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
        (0x3250 <= code && code <= 0x4dbf) ||
        // CJK Unified Ideographs .. Yi Radicals
        (0x4e00 <= code && code <= 0xa4c6) ||
        // Hangul Jamo Extended-A
        (0xa960 <= code && code <= 0xa97c) ||
        // Hangul Syllables
        (0xac00 <= code && code <= 0xd7a3) ||
        // CJK Compatibility Ideographs
        (0xf900 <= code && code <= 0xfaff) ||
        // Vertical Forms
        (0xfe10 <= code && code <= 0xfe19) ||
        // CJK Compatibility Forms .. Small Form Variants
        (0xfe30 <= code && code <= 0xfe6b) ||
        // Halfwidth and Fullwidth Forms
        (0xff01 <= code && code <= 0xff60) ||
        (0xffe0 <= code && code <= 0xffe6) ||
        // Kana Supplement
        (0x1b000 <= code && code <= 0x1b001) ||
        // Enclosed Ideographic Supplement
        (0x1f200 <= code && code <= 0x1f251) ||
        // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
        (0x20000 <= code && code <= 0x3fffd)
    );
};