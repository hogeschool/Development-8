"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Unit2 = __importStar(require("../Unit2ts/unit2"));
var Unit4 = __importStar(require("./unit4"));
console.log("====== UNIT 4 ======");
var l = Unit2.ArrayToList([3, 5, 0, 4, 11, 22, 50, 69]);
var l2 = Unit2.ArrayToList(["three", "five", "zero", "four", "eleven", "twentytwo", "fifty", "sixtynine"]);
var l3 = Unit2.ArrayToList([3, 5, 0]);
var l4 = Unit2.ArrayToList([5, 6, 1, 0]);
var ll = Unit2.ArrayToList([l, l3, l4]);
console.log("FILTER: " + Unit4.filter(function (x) { return x > 10; })(l));
console.log("FOLD: " + Unit4.map(function (x) { return x + 1; })(l));
console.log("FOLD:  " + Unit4.fold(function (s) { return function (x) { return s + x; }; })(0)(l));
console.log("MAP FOLD: " + Unit4.mapFold(function (x) { return x + 1; })(l));
console.log("FILTER FOLD: " + Unit4.filterFold(function (x) { return x > 10; })(l));
console.log("ZIP: " + Unit4.zip(l)(l2));
console.log("ZIP FOLD: " + Unit4.zipFold(l)(l2));
console.log("MAP2: " + Unit4.map2(function (x) { return function (y) { return x + y; }; })(l)(l2));
var msafe = Unit4.map2Safe(function (x) { return function (y) { return x + y; }; })(l2)(l3);
console.log("MAP2SAFE: " + Unit4.map(function (x) { return x.kind == "none" ? "None" : "Some(" + x.value + ")"; })(msafe));
console.log("FLATTEN: " + Unit4.flatten(ll));
//# sourceMappingURL=main.js.map