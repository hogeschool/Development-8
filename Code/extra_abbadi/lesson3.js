"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
exports.mk_nothing = function (message) { return ({ kind: "nothing", message: message }); };
exports.mk_something = function (value) { return ({ kind: "something", value: value }); };
exports.mk_node = function (value, next) { return ({ kind: "node", value: value, next: next }); };
exports.mk_empty = function () { return ({ kind: "empty" }); };
//(1 ->) (5 ->) (90 ->) (2 ->) (/)
exports.custom_lst = exports.mk_node(1, exports.mk_node(5, exports.mk_node(90, exports.mk_node(2, exports.mk_empty()))));
exports.custom_string_lst = exports.mk_node("a", exports.mk_node("n", exports.mk_node("n", exports.mk_node("a", exports.mk_empty()))));
exports.first = function (l) {
    return l.kind == "empty" ? exports.mk_nothing("found empty list")
        : exports.mk_something(l.value);
};
exports.last = function (l) {
    return l.kind == "empty" ? exports.mk_nothing("found empty list")
        : l.next.kind == "empty" ? exports.mk_something(l.value)
            : exports.last(l.next);
};
exports.skip = function (l, n) {
    return n < 0 ? exports.mk_nothing("found negative number to skip")
        : n == 0 ? exports.mk_something(l)
            : l.kind == "empty" ? exports.mk_nothing("cannot skip. found empty list")
                : exports.skip(l.next, n - 1);
};
exports.pretty_print_list = function (l) {
    return l.kind == "empty" ? "[]"
        : l.value + " :: " + exports.pretty_print_list(l.next);
};
// 1 2 3 4 -> take(2) -> 1 2 
exports.take = function (l, n) {
    if (n < 0)
        return exports.mk_nothing("found negative number to skip");
    else if (n == 0)
        return exports.mk_something(exports.mk_empty());
    else if (l.kind == "empty")
        return exports.mk_nothing("Cannot take. Found empty list. n is " + n);
    else {
        var take_tail = exports.take(l.next, n - 1);
        if (take_tail.kind == "nothing")
            return take_tail;
        else
            return exports.mk_something(__assign({}, l, { next: take_tail.value }));
    }
};
exports.length = function (l) {
    return l.kind == "empty" ? 0
        : 1 + exports.length(l.next);
};
exports.reverse = function (l) {
    if (l.kind == "empty")
        return l;
    // 1 2 3 4     
    else {
        // 1 2 3
        var taken_elems = exports.take(l, exports.length(l) - 1);
        //4
        var last_elem = exports.last(l);
        if (taken_elems.kind == "something" &&
            last_elem.kind == "something") {
            // 4 :: reverse(1 2 3)
            return exports.mk_node(last_elem.value, exports.reverse(taken_elems.value));
        }
        else {
            //this will never occure
        }
    }
};
exports.palindrome = function (l) {
    if (l.kind == "empty")
        return true;
    else if (l.next.kind == "empty")
        return true;
    else {
        var first_l = exports.first(l);
        var last_l = exports.last(l);
        if (first_l.kind != "nothing" &&
            last_l.kind != "nothing") {
            if (first_l.value != last_l.value)
                return false;
            else {
                var skip_l = exports.skip(l, 1);
                if (skip_l.kind == "nothing")
                    return false;
                var take_l = exports.take(skip_l.value, exports.length(skip_l.value) - 1);
                if (take_l.kind == "nothing")
                    return false;
                return exports.palindrome(take_l.value);
            }
        }
        else {
            //this will never happen
            return false;
        }
    }
};
var equals = function (ls1, ls2) {
    if (ls1.kind == "empty" &&
        ls2.kind == "empty")
        return true;
    else if (ls1.kind == "node" &&
        ls2.kind == "node")
        ls1.value == ls2.value && equals(ls1.next, ls2.next);
    else
        return false;
};
var palindrome_improved = function (ls) {
    return equals(exports.reverse(ls), ls);
};
// let slice = <a>(l:List<a>, n:number) : Option<Pair<List<a>, List<a>>> {
// }
//slice: (l,n) => Pair(l[0,n],l[n+1, l.length])
