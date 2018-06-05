"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Unit5 = __importStar(require("./unit5"));
var Unit2 = __importStar(require("../Unit2ts/unit2"));
var emptyTree = Unit5.EmptyTree();
var tree = emptyTree.insert(5).insert(-2).insert(10).insert(4).insert(6).insert(-5);
var opt = Unit5.SomeOptional(5);
var l = Unit2.ArrayToList([0, -5, 3, 1, 6, 4]);
var lTypeClass = Unit5.ListTypeClass(l);
var treeTypeClass = Unit5.TreeTypeClass(tree);
console.log(Unit5.treeMap(function (x) { return Math.abs(x); })(tree).toString());
console.log(opt.map(function (x) { return "N = " + String(x); }));
console.log(lTypeClass.map(function (x) { return "{ " + (x + 1) + " }"; }).toString());
console.log(treeTypeClass.map(function (x) { return "{ " + x + " }"; }).toString());
//# sourceMappingURL=main.js.map