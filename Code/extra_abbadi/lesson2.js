"use strict";
exports.__esModule = true;
var Immutable = require("immutable");
exports.an_immutable_collection = Immutable.List([5, 7, 4, 1, 8, 4, 2, 8]);
exports.immutable_length = function (l) {
    if (l.size == 0)
        return 0;
    else
        return 1 + exports.immutable_length(l.skip(1).toList());
};
var immutable_length_AUX = function (l) { return function (acc) {
    if (l.size == 0)
        return acc;
    else
        return immutable_length_AUX(l.skip(1).toList())(acc + 1);
}; };
exports.immutable_length_alt = function (l) {
    return immutable_length_AUX(l)(0);
};
exports.sum_elems = function (l) {
    if (l.size == 0)
        return 0;
    else
        return l.first() + exports.sum_elems(l.skip(1).toList());
};
exports.sum_evens = function (l) {
    if (l.size == 0)
        return 0;
    else {
        // let current = l.first()
        // if(current % 2 == 0) return current + sum_evens (l.skip(1).toList())
        // return sum_evens (l.skip(1).toList())
        var current = l.first();
        return ((current % 2 == 0) ? current : 0) + exports.sum_evens(l.skip(1).toList());
    }
};
exports.quick_sort = function (l) {
    if (l.size <= 1)
        return l;
    var pivot = l.first();
    return exports.quick_sort(l.filter(function (elem) { return elem < pivot; }).toList())
        .concat(l.filter(function (elem) { return elem == pivot; }).toList()).concat(exports.quick_sort(l.filter(function (elem) { return elem > pivot; }).toList())).toList();
    //[ 5 7 4 1 8 4 2 8]
    // pivot = 5
    // [1 2 4 4] @
    // [5]
    // [7 8 8]
};
exports.last = function (l) {
    if (l.size == 0)
        return "nothing";
    else if (l.size == 1)
        return l.first();
    else
        return exports.last(l.skip(1).toList());
};
exports.reverse = function (l) {
    if (l.size == 0)
        return l;
    else
        return exports.reverse(l.skip(1).toList()).push(l.first());
};
exports.palindrome = function (input) {
    if (input.size == 0) {
        return false;
    }
    else if (input.size == 1) {
        return true;
    }
    else {
        return input.first() == input.last() && exports.palindrome(input.slice(1, input.size - 1).toList());
    }
};
//define a compress function that removes all consecutive equal elements from a list
//         compress [a, a, a, b, c , c] => [a, b, c]
//define a compress_count function that removes all consecutive equal elements from a list
//         compress_count [a, a, a, b, c , c] => [(a, 3), (b, 1), (c, 2)]
