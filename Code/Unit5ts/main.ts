import * as Unit5 from "./unit5"
import * as Unit2 from "../Unit2ts/unit2"

let emptyTree = Unit5.EmptyTree<number>()
let tree = emptyTree.insert(5).insert(-2).insert(10).insert(4).insert(6).insert(-5)
let opt = Unit5.SomeOptional<number, string>(5)
let l = Unit2.ArrayToList([0, -5, 3, 1, 6, 4])
let lTypeClass = Unit5.ListTypeClass(l)
let treeTypeClass = Unit5.TreeTypeClass(tree)

console.log(Unit5.treeMap((x: number) => Math.abs(x))(tree).toString())
console.log(opt.map((x: number) => "N = " + String(x)))
console.log(lTypeClass.map((x: number) => `{ ${x + 1} }`).toString())
console.log(treeTypeClass.map((x: number) => `{ ${x} }`).toString())