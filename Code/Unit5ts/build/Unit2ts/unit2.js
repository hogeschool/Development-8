"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cons = function (x, xs) {
    return {
        kind: "cons",
        head: x,
        tail: xs,
        length: function () {
            return exports._length(this);
        },
        toString: function () {
            return exports.listToString(this);
        },
        equals: function (l) {
            return exports._equals(this)(l);
        }
    };
};
exports.Empty = function () {
    return {
        kind: "empty",
        length: function () {
            return 0;
        },
        toString: function () {
            return "";
        },
        equals: function (l) {
            return exports._equals(this)(l);
        }
    };
};
exports._length = function (l) { return l.kind == "empty" ? 0 : 1 + exports._length(l.tail); };
exports.Tuple = function (x, y) {
    return {
        fst: x,
        snd: y,
        toString: function () {
            return "(" + this.fst + "," + this.snd + ")";
        }
    };
};
exports.last = function (l) {
    if (l.kind == "empty") {
        throw "The list is empty";
    }
    else if (l.length() == 1) {
        return l.head;
    }
    else {
        return exports.last(l.tail);
    }
};
exports.concat = function (l1) { return function (l2) {
    if (l1.kind == "empty") {
        return l2;
    }
    else {
        return exports.Cons(l1.head, exports.concat(l1.tail)(l2));
    }
}; };
exports.listToString = function (l) {
    var lts = function (l) {
        if (l.kind == "empty") {
            return "";
        }
        else {
            return l.head + " " + lts(l.tail);
        }
    };
    return "[ " + lts(l) + "]";
};
exports.rev = function (l) {
    if (l.kind == "empty") {
        return l;
    }
    else {
        return exports.concat(exports.rev(l.tail))(exports.Cons(l.head, exports.Empty()));
    }
};
exports.nth = function (n) { return function (l) {
    if (l.kind == "empty") {
        throw "Out of bound";
    }
    else if (n == 0) {
        return l.head;
    }
    else {
        var xs = l.tail;
        return exports.nth(n - 1)(l.tail);
    }
}; };
exports._equals = function (l1) { return function (l2) {
    if ((l1.kind == "empty" && l2.kind != "empty") || (l1.kind != "empty" && l2.kind == "empty")) {
        return false;
    }
    else if (l1.kind == "empty" && l2.kind == "empty") {
        return true;
    }
    else if (l1.kind == "cons" && l2.kind == "cons") {
        return l1.head == l2.head && (exports._equals(l1.tail)(l2.tail));
    }
    else {
        return false;
    }
}; };
exports.palindrome = function (l) {
    var lrev = exports.rev(l);
    return l.equals(lrev);
};
exports.compress = function (l) {
    if (l.kind == "empty") {
        return l;
    }
    else if (l.tail.kind != "empty") {
        if (l.head == l.tail.head) {
            return exports.compress(l.tail);
        }
        else {
            return exports.Cons(l.head, exports.compress(l.tail));
        }
    }
    else {
        return l;
    }
};
exports.ArrayToList = function (elements) {
    if (elements.length == 0) {
        return exports.Empty();
    }
    else {
        return exports.Cons(elements[0], exports.ArrayToList(elements.slice(1, elements.length)));
    }
};
exports.shift = function (letter) { return function (offset) {
    var lowerBound = "a".charCodeAt(0);
    var upperBound = "z".charCodeAt(0);
    var o = offset % 27;
    var letterCode = letter.charCodeAt(0) + o;
    if (letterCode < lowerBound) {
        return upperBound - (lowerBound - letterCode);
    }
    else if (letterCode > upperBound) {
        return lowerBound + (letterCode - upperBound);
    }
    else {
        return letterCode;
    }
}; };
exports.StringToCharList = function (text) {
    if (text == "") {
        return exports.Empty();
    }
    else {
        return exports.Cons(text[0], exports.StringToCharList(text.slice(1, text.length)));
    }
};
exports.caesarChypher = function (text) { return function (offset) {
    if (text.kind == "empty") {
        return text;
    }
    else {
        var c = text.head;
        var charCode = c.charCodeAt(0);
        if (charCode >= 97 && charCode <= 122) {
            var encodedChar = String.fromCharCode((exports.shift(c)(offset)));
            return exports.Cons(encodedChar, exports.caesarChypher(text.tail)(offset));
        }
        else {
            return exports.Cons(c, exports.caesarChypher(text.tail)(offset));
        }
    }
}; };
//# sourceMappingURL=unit2.js.map