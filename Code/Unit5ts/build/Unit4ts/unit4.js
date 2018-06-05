"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var unit2_1 = require("../Unit2ts/unit2");
var Unit2 = __importStar(require("../Unit2ts/unit2"));
exports.None = function () { return { kind: "none" }; };
exports.Some = function (v) { return { kind: "some", value: v }; };
exports.filter = function (predicate) { return function (l) {
    if (l.kind == "empty") {
        return l;
    }
    else if (predicate(l.head)) {
        return unit2_1.Cons(l.head, exports.filter(predicate)(l.tail));
    }
    else {
        return exports.filter(predicate)(l.tail);
    }
}; };
exports.map = function (f) { return function (l) {
    if (l.kind == "empty") {
        return unit2_1.Empty();
    }
    else {
        return unit2_1.Cons(f(l.head), exports.map(f)(l.tail));
    }
}; };
exports.fold = function (f) { return function (accumulator) { return function (l) {
    if (l.kind == "empty") {
        return accumulator;
    }
    else {
        return exports.fold(f)(f(accumulator)(l.head))(l.tail);
    }
}; }; };
var apply = function (x) { return function (f) { return f(x); }; };
var carry = function (f) { return function (x) { return function (y) { return f(x, y); }; }; };
var uncarry = function (f) { return function (args) { return f(args.fst)(args.snd); }; };
exports.mapFold = function (f) { return function (l) {
    return apply(exports.fold(function (l) { return function (x) { return unit2_1.Cons(f(x), l); }; })(unit2_1.Empty())(l))(Unit2.rev);
}; };
exports.filterFold = function (predicate) { return function (l) {
    return apply(exports.fold(function (l) { return function (x) {
        return predicate(x) ? unit2_1.Cons(x, l) : l;
    }; })(unit2_1.Empty())(l))(Unit2.rev);
}; };
exports.map2 = function (f) {
    return function (l1) {
        return function (l2) {
            if (l1.length() != l2.length()) {
                throw "The two lists must have the same length";
            }
            else if (l1.kind == "empty" && l2.kind == "empty") {
                return unit2_1.Empty();
            }
            else if (l1.kind == "cons" && l2.kind == "cons") {
                return unit2_1.Cons(f(l1.head)(l2.head), exports.map2(f)(l1.tail)(l2.tail));
            }
            else {
                throw "Cannot happen";
            }
        };
    };
};
exports.fold2 = function (f) {
    return function (init) {
        return function (l1) {
            return function (l2) {
                if (l1.length() != l2.length()) {
                    throw "The two lists must have the same length";
                }
                else if (l1.kind == "empty" && l2.kind == "empty") {
                    return init;
                }
                else if (l1.kind != "empty" && l2.kind != "empty") {
                    var accumulator = f(init)(l1.head)(l2.head);
                    return exports.fold2(f)(accumulator)(l1.tail)(l2.tail);
                }
                else {
                    throw "Cannot happen";
                }
            };
        };
    };
};
exports.zip = function (l1) { return function (l2) {
    if (l1.kind != l2.kind) {
        throw "The two lists must have the same length";
    }
    else if (l1.kind == "empty" && l2.kind == "empty") {
        return unit2_1.Empty();
    }
    else if (l1.kind != "empty" && l2.kind != "empty") {
        return unit2_1.Cons(unit2_1.Tuple(l1.head, l2.head), exports.zip(l1.tail)(l2.tail));
    }
    else {
        throw "Cannot happen";
    }
}; };
exports.zipFold = function (l1) { return function (l2) {
    if (l1.length() != l2.length()) {
        throw "The two lists must have the same length";
    }
    else {
        return apply(exports.fold2(function (l) { return function (x) { return function (y) { return unit2_1.Cons(unit2_1.Tuple(x, y), l); }; }; })(unit2_1.Empty())(l1)(l2))(Unit2.rev);
    }
}; };
exports.map2Safe = function (f) {
    return function (l1) {
        return function (l2) {
            if (l1.kind == "empty" && l2.kind == "empty") {
                return unit2_1.Empty();
            }
            else if (l1.kind == "empty" && l2.kind != "empty") {
                return exports.map(function (x) { return exports.None(); })(l2);
            }
            else if (l1.kind != "empty" && l2.kind == "empty") {
                return exports.map(function (x) { return exports.None(); })(l1);
            }
            else if (l1.kind != "empty" && l2.kind != "empty") {
                var newHead = exports.Some(f(l1.head)(l2.head));
                return unit2_1.Cons(newHead, exports.map2Safe(f)(l1.tail)(l2.tail));
            }
            else {
                throw "Cannot happen";
            }
        };
    };
};
exports.flatten = function (l) {
    return exports.fold(function (l1) { return function (x) { return Unit2.concat(l1)(x); }; })(unit2_1.Empty())(l);
};
//# sourceMappingURL=unit4.js.map