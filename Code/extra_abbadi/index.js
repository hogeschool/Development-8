"use strict";
exports.__esModule = true;
var l3 = require("./lesson3");
var l4 = require("./lesson4");
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
var sum = function (x) { return (function (y) { return x + y; }); };
var sum_verbose = function (x) { return (function (y) { return x + y; }); };
var x = sum(1)(2);
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
console.log(l3.pretty_print_list(l3.custom_lst));
console.log(l3.pretty_print_list(l4.filter_fold(l3.custom_lst, function (n) { return n % 2 == 0; })));
