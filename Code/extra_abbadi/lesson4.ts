import { List, mk_node, mk_empty } from "./lesson3"
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

export let map = <a, b>(l:List<a>, f:((_:a)=>b)):List<b> => {
    if(l.kind == "empty") return l
    else return mk_node(f(l.value), map(l.next, f))
}
let incr = (l:List<number>) : List<number> => map(l, (n:number) => n + 1)
let quad = (l:List<number>):List<number> => map(l, (n:number) => n * n)
let div_2 = (l:List<number>):List<number> => map(l, (n:number) => n / 2)
let to_string = (l:List<number>):List<string> => map(l, (n:number) => n.toString())

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


let filter = <a>(l:List<a>, p:(_:a)=>boolean):List<a> =>{
    if(l.kind == "empty") return l
    else{
        if(p(l.value)) return mk_node(l.value, filter(l.next, p))
        else return filter(l.next, p)
    }
}


let evens = (l:List<number>):List<number> => filter(l, (n:number) => n % 2 == 0)
let odds = (l:List<number>):List<number> => filter(l, (n:number) => n % 2 != 0)
let greater_2 = (l:List<number>):List<number> => filter(l, (n:number) => n > 2)
let greater_3 = (l:List<number>):List<number> => filter(l, (n:number) => n > 3)
let greater_m = (l:List<number>, m:number):List<number> => filter(l, (n:number) => n > m)


let sum = (l:List<number>):number =>{
    if(l.kind == "empty") return 0
    else l.value + sum(l.next)
}

// let length = (l:List<number>):number =>{
//     if(l.kind == "empty") return 0
//     else 1 + length(l.next)
// }

let foldr = <a,b>(l:List<a>, f:(a:a, b:b) => b, z:b) : b => {
    if(l.kind == "empty") return z
    else {
        return foldr (l.next, f, f(l.value, z))
    }
}
let foldl = <a,b>(l:List<a>, f:(a:a, b:b) => b, z:b) : b => {
    if(l.kind == "empty") return z
    else {
        return f (l.value, foldl(l.next, f, z))
    }
}
export let fold = foldl

let length = (l:List<number>):number => foldr(l, (_:number, state:number) => state + 1, 0)

/*

length ([3, 4, 9, 1]) =>
  foldr([3, 4, 9, 1], (_:number, state:number) => state + 1, 0) =>
    foldr([ 4, 9, 1], (_:number, state:number) => state + 1, 1) =>
        foldr([9, 1], (_:number, state:number) => state + 1, 2) =>
            foldr([1], (_:number, state:number) => state + 1, 3) =>
                foldr([], (_:number, state:number) => state + 1, 4) =>
                    4
*/

export let map_fold = <a,b>(l:List<a>, f:((_:a) => b)) : List<b> => 
    foldl(l, 
          //(curr_e:a, s:List<b>) => concat(s, f(curr_e)), 
          (curr_e:a, s:List<b>) => mk_node(f(curr_e), s), 
          mk_empty())
          
export let filter_fold = <a,b>(l:List<a>, p:((_:a) => boolean)) : List<a> => 
    foldl(l, 
          (curr_e:a, s:List<a>) => p(curr_e) ? mk_node(curr_e, s) : s, 
          mk_empty())


export let multiplyFold = (originalList : List<number>) : number => foldr(originalList, ((value, state) => value * state), 1) 