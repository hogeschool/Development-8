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
var Unit3 = __importStar(require("./unit3"));
console.log("====== UNIT 3 ======");
var l = Unit2.ArrayToList([0, 5, 3, -2, -4, 5, 1, -20]);
var sorted1 = Unit2.ArrayToList([0, 2, 4, 15, 22, 40]);
var sorted2 = Unit2.ArrayToList([-5, 3, 4, 21, 70, 80]);
var expr = Unit3.Add(Unit3.Mul(Unit3.Val(3), Unit3.Val(-2)), Unit3.Sub(Unit3.Var("x"), Unit3.Val(4)));
var testProgram = Unit2.ArrayToList([
    Unit3.Assignment("x", Unit3.Val(5)),
    Unit3.Assignment("y", Unit3.Val(2)),
    Unit3.Assignment("x", Unit3.Add(Unit3.Var("x"), Unit3.Var("y"))),
    Unit3.Print(Unit3.Var("x"))
]);
var emptyMem = Unit2.ArrayToList([]);
console.log("SPLIT AT: " + Unit3.splitAt(2)(l).toString());
console.log("MERGE: " + Unit3.merge(sorted1)(sorted2).toString());
console.log("MERGE-SORT: " + Unit3.mergeSort(l).toString());
console.log("EVAL: " + Unit3._eval(expr)(Unit2.ArrayToList([{ fst: "x", snd: 5 }])).toString());
console.log("RUN: " + Unit3.run(testProgram)(emptyMem));
//# sourceMappingURL=main.js.map