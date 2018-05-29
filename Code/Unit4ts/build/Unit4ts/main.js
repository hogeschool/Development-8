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
console.log("FILTER: " + Unit4.filter(function (x) { return x > 10; })(l));
console.log("FOLD: " + Unit4.map(function (x) { return x + 1; })(l));
console.log("FOLD:  " + Unit4.fold(function (s) { return function (x) { return s + x; }; })(0)(l));
console.log("MAP FOLD: " + Unit4.mapFold(function (x) { return x + 1; })(l));
console.log("FILTER FOLD: " + Unit4.filterFold(function (x) { return x > 10; })(l));
//# sourceMappingURL=main.js.map