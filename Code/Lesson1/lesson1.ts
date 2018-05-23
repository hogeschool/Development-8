import * as Immutable from "immutable"
import { aaa } from "./library1"

let numbers = (n: number): string => {
  if (n < 0) {
    throw "What r u doing?"
  } else if (n == 0) {
    return "0 "
  } else {
    return (numbers(n - 1)) + n + " "
  } 
}

let head = <a>(l: Immutable.List<a>): a => {
  return l.first()
}

let tail = <a>(l: Immutable.List<a>): Immutable.List<a> => {
  return l.takeLast(l.count() - 1).toList()
}

// let length = <a>(l: Immutable.List<a>): number => {
//   let counter = 0
// }

let l = Immutable.List<number>([1,2,3,4,5])
console.log(head(l))
console.log("Done!")   