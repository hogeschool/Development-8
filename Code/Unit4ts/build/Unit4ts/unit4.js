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
//# sourceMappingURL=unit4.js.map