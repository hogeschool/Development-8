"use strict";
var x = 5;
//(lambda x -> console.log("Hello world " + x)) 5
var id = function (x) { return x; };
var add = function (x) { return function (x) { return x + x; }; };
console.log(id(5));
console.log(add(3)(5));
//add(3,5)
