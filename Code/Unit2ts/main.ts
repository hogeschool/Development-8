import * as Unit2 from "./unit2"

let l1 = Unit2.ArrayToList([5, 3, 4])//Cons<number>(5, Cons(3, Cons(4, Empty())))
let l2 = Unit2.ArrayToList([-6, 2, 0, 4, 15])//Cons<number>(-6, Cons(2, Cons(0, Cons(4, Cons(15, Empty())))))
let pal = Unit2.ArrayToList([-6, 2, 0, 2, -6])//Cons<number>(-6, Cons(2, Cons(0, Cons(2, Cons(-6, Empty())))))
let uncompressed = Unit2.ArrayToList(["a", "a", "a", "a", "b", "b", "c", "c", "b"])//Cons<number>(-6, Cons(-6, Cons(-6, Cons(2, Cons(2, Cons())))))
let text = Unit2.StringToCharList("Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora".toLocaleLowerCase())

//last
console.log("LAST: " + Unit2.last(l1).toString())

//concat
let myListTwice = Unit2.concat(l1)(l2)
console.log("CONCAT: " + myListTwice.toString())

//rev
console.log("REV: " + Unit2.rev(l2).toString())

//equals
console.log("EQUALS: " + l1.equals(l1))

//palindrome
console.log("PALINDROME: " + Unit2.palindrome(pal))

//compress
console.log("COMPRESS: " + Unit2.compress(uncompressed).toString())

//caesar
let encodedText = Unit2.caesarChypher(text)(15)
let decodedText = Unit2.caesarChypher(encodedText)(-15).toString()
console.log(encodedText.toString())
console.log(decodedText.toString())