import * as Unit2 from "../Unit2ts/unit2"
import * as Unit3 from "./unit3"

console.log("====== UNIT 3 ======")

let l = Unit2.ArrayToList([0, 5, 3, -2, -4, 5, 1, -20])
let sorted1 = Unit2.ArrayToList([0, 2, 4, 15, 22, 40])
let sorted2 = Unit2.ArrayToList([-5, 3, 4, 21, 70, 80])
let expr = Unit3.Add(Unit3.Mul(Unit3.Val(3), Unit3.Val(-2)),Unit3.Sub(Unit3.Var("x"),Unit3.Val(4)))

let testProgram = Unit2.ArrayToList(
  [
    Unit3.Assignment("x", Unit3.Val(5)),
    Unit3.Assignment("y", Unit3.Val(2)),
    Unit3.Assignment("x", Unit3.Add(Unit3.Var("x"), Unit3.Var("y"))),
    Unit3.Print(Unit3.Var("x"))
  ]
)

let emptyMem: Unit3.Memory = Unit2.ArrayToList<Unit2.Tuple<string, number>>([])

console.log("SPLIT AT: " + Unit3.splitAt<number>(2)(l).toString())
console.log("MERGE: " + Unit3.merge<number>(sorted1)(sorted2).toString())
console.log("MERGE-SORT: " + Unit3.mergeSort<number>(l).toString())
console.log("EVAL: " + Unit3._eval(expr)(Unit2.ArrayToList([{ fst: "x", snd: 5 }])).toString())
console.log(`RUN: ${Unit3.run(testProgram)(emptyMem)}`)