"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Unit2 = __importStar(require("./unit2"));
var l1 = Unit2.ArrayToList([5, 3, 4]); //Cons<number>(5, Cons(3, Cons(4, Empty())))
var l2 = Unit2.ArrayToList([-6, 2, 0, 4, 15]); //Cons<number>(-6, Cons(2, Cons(0, Cons(4, Cons(15, Empty())))))
var pal = Unit2.ArrayToList([-6, 2, 0, 2, -6]); //Cons<number>(-6, Cons(2, Cons(0, Cons(2, Cons(-6, Empty())))))
var uncompressed = Unit2.ArrayToList(["a", "a", "a", "a", "b", "b", "c", "c", "b"]); //Cons<number>(-6, Cons(-6, Cons(-6, Cons(2, Cons(2, Cons())))))
var text = Unit2.StringToCharList("Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora".toLocaleLowerCase());
//last
console.log("LAST: " + Unit2.last(l1).toString());
//concat
var myListTwice = Unit2.concat(l1)(l2);
console.log("CONCAT: " + myListTwice.toString());
//rev
console.log("REV: " + Unit2.rev(l2).toString());
//equals
console.log("EQUALS: " + l1.equals(l1));
//palindrome
console.log("PALINDROME: " + Unit2.palindrome(pal));
//compress
console.log("COMPRESS: " + Unit2.compress(uncompressed).toString());
//caesar
var encodedText = Unit2.caesarChypher(text)(15);
var encodeTest = Unit2.caesarChypher(Unit2.ArrayToList(["z", "y", "c"]))(5);
var decodedText = Unit2.caesarChypher(encodedText)(-15).toString();
var shiftTest = Unit2.shift("z")(5);
console.log(encodedText.toString());
console.log(decodedText.toString());
console.log(encodeTest.toString());
console.log(shiftTest);
//# sourceMappingURL=main.js.map