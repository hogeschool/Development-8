"use strict";
exports.__esModule = true;
exports.hello_world = "hello world!";
exports.sum = function (a, b) { return a + b; };
//           \a.\b.a+b
exports.sum_10 = function (a) { return function (b) {
    var c = 10;
    return a + b / c;
}; };
//           (\a.\b.((\c.a+b+c) 10))
var res = exports.sum_10(5)(6);
//           (((\a.\b.((\c.a+b+c) 10)) 5) 6)
//           ((\a.\b.((\c.a+b+c) 10)) 5) 6
//                (\b.((\c.5+b+c) 10))   6
//                    ((\c.5+6+c) 10)
//                         5+6+10
//                           21
exports.sum_20 = function (a) { return function (b) {
    var c = 10;
    c = 20;
    return a + b + c;
}; };
//           (\a.\b.((\c.(\c.a+b+c)20) 10))
var res1 = (exports.sum_10(5))(6);
//           (((\a.\b.((\c.(\c.a+b+c)20) 10)) 5) 6)
//           ((\a.\b.((\c.(\c.a+b+c)20) 10)) 5) 6
//                (\b.((\c.(\c.5+b+c)20) 10))   6
//                    ((\c.(\c.5+6+c)20) 10)
//rule                    ((\c.5+6+c)20)[c/10]
//                         (\c.5+6+c)20
//                         5+6+20
//                           31
var is_leap = function (year) {
    return year % 4 != 0 ? false :
        year % 100 != 0 ? true :
            year % 400 != 0 ? false :
                true;
};
// a,b
// if(a > b) return "a > b"
// else "a <= b"
//
exports.compare = function (a) { return function (b) {
    if (a > b)
        return "a > b";
    else
        return "a <= b";
}; };
//fact 5 => 5 * 4 * 3 * 2 * 1 
exports.factorial = function (n) { return n <= 1 ? 1 : n * exports.factorial(n - 1); };
// 0 1 2 3 4 5
// 1 1 2 3 5 8
exports.fibonacci = function (n) { return n <= 1 ? 1 : exports.fibonacci(n - 1) + exports.fibonacci(n - 2); };
// m   n
//10 / 3  = 3
// 2 / 3  = 0
exports.int_divsion = function (m) { return function (n) { return n > m ? 0 : 1 + exports.int_divsion(m - n)(n); }; };
exports.numbers = function (n) { return n > 0 ? exports.numbers(n - 1) + ("" + n) : "0"; };
exports.line_of_symbols = function (length) { return function (symbol) {
    if (length == 0)
        return "";
    else
        return symbol + exports.line_of_symbols(length - 1)(symbol);
}; };
//tail recursion
var line_of_symbols_alter_AUX = function (length) { return function (symbol) { return function (acc) {
    if (length == 0)
        return acc;
    else
        return line_of_symbols_alter_AUX(length - 1)(symbol)(symbol + acc);
}; }; };
exports.line_of_symbols_alter = function (length) { return function (symbol) {
    return line_of_symbols_alter_AUX(length)(symbol)("");
}; };
/* exercises:
return a string containing all numbers from 0 to n (recursive)


return a string containing all numbers from n to 0 (recursive)
return a string containing all numbers within a range n - m (recursive)
return a string containing all even number  within a range n - m (recursive)
draw a line of asterisks of a given length
draw a line of of a symbol taken as input of a given length
generate a binary string from a positive number
*/ 
