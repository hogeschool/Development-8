import * as Unit2 from "../Unit2ts/unit2"
import * as Unit4 from "./unit4"

console.log("====== UNIT 4 ======") 

let l = Unit2.ArrayToList([3, 5, 0, 4, 11, 22, 50, 69])
let l2 = Unit2.ArrayToList(["three", "five", "zero", "four", "eleven", "twentytwo", "fifty", "sixtynine"])
let l3 = Unit2.ArrayToList([3, 5, 0])
let l4 = Unit2.ArrayToList([5, 6, 1, 0])
let ll = Unit2.ArrayToList([l, l3, l4])
console.log(`FILTER: ${Unit4.filter<number>(x => x > 10)(l)}`)
console.log(`FOLD: ${Unit4.map<number, number>(x => x + 1)(l)}`)
console.log(`FOLD:  ${Unit4.fold<number, number>(s => x => s + x)(0)(l)}`)
console.log(`MAP FOLD: ${Unit4.mapFold<number, number>(x => x + 1)(l)}`)
console.log(`FILTER FOLD: ${Unit4.filterFold<number>(x => x > 10)(l)}`)
console.log(`ZIP: ${Unit4.zip<number, string>(l)(l2)}`)
console.log(`ZIP FOLD: ${Unit4.zipFold<number, string>(l)(l2)}`)
console.log(`MAP2: ${Unit4.map2<number, string, string>((x: number) => (y: string) => x + y)(l)(l2)}`)
let msafe = Unit4.map2Safe<string, number, string>((x: string) => (y: number) => x + y)(l2)(l3)
console.log(`MAP2SAFE: ${Unit4.map((x: Unit4.Option<string>) => x.kind == "none" ? "None" : `Some(${x.value})`)(msafe)}`)
console.log(`FLATTEN: ${Unit4.flatten(ll)}`)
