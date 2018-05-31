"use strict";
exports.__esModule = true;
var lesson3_1 = require("./lesson3");
//High-order functions
//HOF0, f : (a:number, b:string) ..
//HOF2, f : (a:((_:number, _:(_:string->bool)) -> string), b:string) ..
// let incr = (l:List<number>):List<number> => {
//     if(l.kind == "empty") return l
//     else return mk_node(l.value + 1, incr(l.next))
// }
// let quad = (l:List<number>):List<number> => {
//     if(l.kind == "empty") return l
//     else return mk_node(l.value * l.value , quad(l.next))
// }
// let div_2 = (l:List<number>):List<number> => {
//     if(l.kind == "empty") return l
//     else return mk_node(l.value / 2, div_2(l.next))
// }
// let to_string = (l:List<number>):List<string> => {
//     if(l.kind == "empty") return l
//     else return mk_node(l.value.toString(), to_string(l.next))
// }
var map = function (l, f) {
    if (l.kind == "empty")
        return l;
    else
        return lesson3_1.mk_node(f(l.value), map(l.next, f));
};
var incr = function (l) { return map(l, function (n) { return n + 1; }); };
var quad = function (l) { return map(l, function (n) { return n * n; }); };
var div_2 = function (l) { return map(l, function (n) { return n / 2; }); };
var to_string = function (l) { return map(l, function (n) { return n.toString(); }); };
// let evens = (l:List<number>):List<number> => {
//     if(l.kind == "empty") return l
//     else{
//         if(l.value % 2 == 0) return mk_node(l.value, evens(l.next))
//         else return evens(l.next)
//     }
// }
// let odds = (l:List<number>):List<number> => {
//     if(l.kind == "empty") return l
//     else{
//         if(l.value % 2 != 0) return mk_node(l.value, evens(l.next))
//         else return evens(l.next)
//     }
// }
// let greater_2 = (l:List<number>):List<number> => {
//     if(l.kind == "empty") return l
//     else{
//         if(l.value > 2) return mk_node(l.value, evens(l.next))
//         else return evens(l.next)
//     }
// }
// let greater_3 = (l:List<number>):List<number> => {
//     if(l.kind == "empty") return l
//     else{
//         if(l.value > 3) return mk_node(l.value, evens(l.next))
//         else return evens(l.next)
//     }
// }
var filter = function (l, p) {
    if (l.kind == "empty")
        return l;
    else {
        if (p(l.value))
            return lesson3_1.mk_node(l.value, filter(l.next, p));
        else
            return filter(l.next, p);
    }
};
var evens = function (l) { return filter(l, function (n) { return n % 2 == 0; }); };
var odds = function (l) { return filter(l, function (n) { return n % 2 != 0; }); };
var greater_2 = function (l) { return filter(l, function (n) { return n > 2; }); };
var greater_3 = function (l) { return filter(l, function (n) { return n > 3; }); };
var greater_m = function (l, m) { return filter(l, function (n) { return n > m; }); };
var sum = function (l) {
    if (l.kind == "empty")
        return 0;
    else
        l.value + sum(l.next);
};
// let length = (l:List<number>):number =>{
//     if(l.kind == "empty") return 0
//     else 1 + length(l.next)
// }
var foldr = function (l, f, z) {
    if (l.kind == "empty")
        return z;
    else {
        return foldr(l.next, f, f(l.value, z));
    }
};
var foldl = function (l, f, z) {
    if (l.kind == "empty")
        return z;
    else {
        return f(l.value, foldl(l.next, f, z));
    }
};
var length = function (l) { return foldr(l, function (_, state) { return state + 1; }, 0); };
/*

length ([3, 4, 9, 1]) =>
  foldr([3, 4, 9, 1], (_:number, state:number) => state + 1, 0) =>
    foldr([ 4, 9, 1], (_:number, state:number) => state + 1, 1) =>
        foldr([9, 1], (_:number, state:number) => state + 1, 2) =>
            foldr([1], (_:number, state:number) => state + 1, 3) =>
                foldr([], (_:number, state:number) => state + 1, 4) =>
                    4
*/
exports.map_fold = function (l, f) {
    return foldl(l, 
    //(curr_e:a, s:List<b>) => concat(s, f(curr_e)), 
    function (curr_e, s) { return lesson3_1.mk_node(f(curr_e), s); }, lesson3_1.mk_empty());
};
exports.filter_fold = function (l, p) {
    return foldl(l, function (curr_e, s) { return p(curr_e) ? lesson3_1.mk_node(curr_e, s) : s; }, lesson3_1.mk_empty());
};
//let filter_f = ?
