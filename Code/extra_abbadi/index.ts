import * as l1 from "./lesson1"
import * as l2 from "./lesson2"
import * as l3 from "./lesson3"
import * as l4 from "./lesson4"
import * as Immutable from "immutable"
/*
v:A->A

x:A & T:B
-------------------
\x.T    :   A->B

T1:(A->B) & T2:A   CONDITIONS
-------------------
T1 T2   :   B
INPUT       RESULT
*/


//                           A        B
//                         number + number
//        A ->      (B ->     number)
//        A ->      (number -> number)
//        number -> (number -> number)
let sum = x => (y => x + y)
let sum_verbose = (x:number) => ((y:number) : number => x + y)

let x:number = sum (1) (2)
//         T1   T2
//         |     number----------------------
//         |                                |
//       __|_______________________         |
//       T1                      T2         |
//(number -> (number -> number))  number    |
//           (number -> number)            number
//                      number

// let res = l1.line_of_symbols_alter(100)("#")
// let last = l2.last(l2.an_immutable_collection)

// if(last == "nothing"){ 
//     console.log("found empty")
// }
// else {
//     let last_plus_one = last + 1
// }

console.log(l3.pretty_print_list(l3.custom_lst))

console.log(l3.pretty_print_list(l4.filter_fold(l3.custom_lst, (n:number) => n % 2 == 0)))




