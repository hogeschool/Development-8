import * as Unit2 from "../Unit2ts/unit2"
import * as Unit4 from "./unit4"

console.log("====== UNIT 4 ======") 

let l = Unit2.ArrayToList([3, 5, 0, 4, 11, 22, 50, 69])
console.log(`FILTER: ${Unit4.filter<number>(x => x > 10)(l)}`)
console.log(`FOLD: ${Unit4.map<number, number>(x => x + 1)(l)}`)
console.log(`FOLD:  ${Unit4.fold<number, number>(s => x => s + x)(0)(l)}`)
console.log(`MAP FOLD: ${Unit4.mapFold<number, number>(x => x + 1)(l)}`)
console.log(`FILTER FOLD: ${Unit4.filterFold<number>(x => x > 10)(l)}`)
