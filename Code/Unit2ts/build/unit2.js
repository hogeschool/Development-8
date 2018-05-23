"use strict";
var Cons = function (x, xs) {
    return {
        kind: "cons",
        head: x,
        tail: xs
    };
};
var Empty = function () {
    return { kind: "empty" };
};
var len = function (l) {
    if (l.kind == "empty") {
        return 0;
    }
    else {
        return 1 + len(l.tail);
    }
};
var sum = function (l) {
    if (l.kind == "empty") {
        return 0;
    }
    else {
        return l.head + sum(l.tail);
    }
};
var evens = function (l) {
    if (l.kind == "empty") {
        return Empty();
    }
    else {
        if (l.head % 2 == 0) {
            return Cons(l.head, evens(l.tail));
        }
        else {
            return evens(l.tail);
        }
    }
};
var concat = function (l1) { return function (l2) {
    if (l1.kind == "empty") {
        return l2;
    }
    else {
        return Cons(l1.head, concat(l1.tail)(l2));
    }
}; };
var listString = function (l) {
    if (l.kind == "empty") {
        return "";
    }
    else {
        return l.head + " " + (listString(l.tail));
    }
};
var Tuple = function (x, y) {
    return {
        fst: x,
        snd: y
    };
};
var splitAt = function (i) { return function (l) {
    if (l.kind == "empty") {
        throw "I cannot split an empty list";
    }
    else if (i == 0) {
        var leftPart = Cons(l.head, Empty());
        var rightPart = l.tail;
        return Tuple(leftPart, rightPart);
    }
    else {
        //split 1 [3;4;5;6;7] -> ([3;4];[5;6;7])
        //split 0 [4;5;6;7] -> ([4],[5;6;7])
        var t_1 = splitAt(i - 1)(l.tail);
        var leftPart = t_1.fst;
        var rightPart = t_1.snd;
        return Tuple(Cons(l.head, leftPart), rightPart);
    }
}; };
//concat [4;5;6] [1;2;3] 
//concat [] [1;2;3] --> [1;2;3]
//concat [6] [1;2;3] --> [6;1;2;3]
//concat [5;6] -> [1;2;3] -> [5;6;1;2;3]
//concat [4;5;6] -> [1;2;3] -> [4;5;6;1;2;3]
var myList = Cons(5, Cons(3, Cons(4, Empty())));
var myListTwice = concat(myList)(myList);
// console.log(listString(myListTwice))
var t = splitAt(3)(myListTwice);
console.log(listString(t.fst));
console.log(listString(t.snd));
//# sourceMappingURL=unit2.js.map