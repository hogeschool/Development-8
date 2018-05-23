"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Immutable = __importStar(require("immutable"));
var numbers = function (n) {
    if (n < 0) {
        throw "What r u doing?";
    }
    else if (n == 0) {
        return "0 ";
    }
    else {
        return (numbers(n - 1)) + n + " ";
    }
};
var head = function (l) {
    return l.first();
};
var tail = function (l) {
    return l.takeLast(l.count() - 1).toList();
};
// let length = <a>(l: Immutable.List<a>): number => {
//   let counter = 0
// }
var l = Immutable.List([1, 2, 3, 4, 5]);
console.log(head(l));
console.log("Done!");
