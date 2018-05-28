"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unit2_1 = require("../Unit2ts/unit2");
exports.splitAt = function (i) { return function (l) {
    if (l.kind == "empty") {
        throw "Out of bound";
    }
    else if (i == 0) {
        return unit2_1.Tuple(unit2_1.Cons(l.head, unit2_1.Empty()), l.tail);
    }
    else {
        var x = l.head;
        var xs = l.tail;
        var t = exports.splitAt(i - 1)(xs);
        return unit2_1.Tuple(unit2_1.Cons(x, t.fst), t.snd);
    }
}; };
exports.merge = function (l1) { return function (l2) {
    if (l1.kind == "empty") {
        return l2;
    }
    else if (l2.kind == "empty") {
        return l1;
    }
    else {
        if (l1.head <= l2.head) {
            return unit2_1.Cons(l1.head, exports.merge(l1.tail)(l2));
        }
        else {
            return unit2_1.Cons(l2.head, exports.merge(l1)(l2.tail));
        }
    }
}; };
exports.mergeSort = function (l) {
    if (l.length() == 1) {
        return l;
    }
    else {
        var middle = Math.floor(l.length() / 2 - 1);
        var t1 = (_a = exports.splitAt(middle)(l), _a.fst), t2 = _a.snd;
        var sortedLeft = exports.mergeSort(t1);
        var sortedRight = exports.mergeSort(t2);
        return exports.merge(sortedLeft)(sortedRight);
    }
    var _a;
};
var exprToString = function (expr) {
    if (expr.kind == "val") {
        return expr.value.toString();
    }
    else if (expr.kind == "var") {
        return expr.name;
    }
    else if (expr.kind == "add") {
        return exprToString(expr.left) + " + " + expr.right;
    }
    else if (expr.kind == "sub") {
        return exprToString(expr.left) + " - " + expr.right;
    }
    else if (expr.kind == "mul") {
        return exprToString(expr.left) + " * " + expr.right;
    }
    else {
        return exprToString(expr.left) + " / " + expr.right;
    }
};
exports.Val = function (n) {
    return { kind: "val", value: n, toString: exprToString };
};
exports.Var = function (id) {
    return { kind: "var", name: id, toString: exprToString };
};
exports.Add = function (left, right) {
    return { kind: "add", left: left, right: right, toString: exprToString };
};
exports.Sub = function (left, right) { return { kind: "sub", left: left, right: right, toString: exprToString }; };
exports.Mul = function (left, right) { return { kind: "mul", left: left, right: right, toString: exprToString }; };
exports.Div = function (left, right) { return { kind: "div", left: left, right: right, toString: exprToString }; };
var lookup = function (id) { return function (stack) {
    if (stack.kind == "empty") {
        throw "Undeclared variable";
    }
    else if (stack.head.fst == id) {
        return stack.head.snd;
    }
    else {
        return lookup(id)(stack.tail);
    }
}; };
var exists = function (id) { return function (stack) {
    if (stack.kind == "empty") {
        return false;
    }
    else if (stack.head.fst == id) {
        return true;
    }
    else {
        return exists(id)(stack.tail);
    }
}; };
var setMemory = function (id) { return function (n) { return function (stack) {
    if (stack.kind == "empty") {
        return unit2_1.Cons(unit2_1.Tuple(id, n), unit2_1.Empty());
    }
    else if (stack.head.fst == id) {
        return unit2_1.Cons(unit2_1.Tuple(id, n), stack.tail);
    }
    else {
        return unit2_1.Cons(stack.head, setMemory(id)(n)(stack.tail));
    }
}; }; };
exports._eval = function (expr) { return function (stack) {
    if (expr.kind == "val") {
        return expr.value;
    }
    else if (expr.kind == "var") {
        return lookup(expr.name)(stack);
    }
    else if (expr.kind == "add") {
        return exports._eval(expr.left)(stack) + exports._eval(expr.right)(stack);
    }
    else if (expr.kind == "sub") {
        return exports._eval(expr.left)(stack) - exports._eval(expr.right)(stack);
    }
    else if (expr.kind == "mul") {
        return exports._eval(expr.left)(stack) * exports._eval(expr.right)(stack);
    }
    else {
        return exports._eval(expr.left)(stack) / exports._eval(expr.right)(stack);
    }
}; };
var stmtToString = function (stmt) {
    if (stmt.kind == "assignment") {
        return stmt.var + " = " + stmt.expr.toString();
    }
    else {
        return "print(" + stmt.expr + ")";
    }
};
exports.Assignment = function (id, expr) {
    return {
        kind: "assignment",
        var: id,
        expr: expr,
        toString: stmtToString
    };
};
exports.Print = function (expr) {
    return {
        kind: "print",
        expr: expr,
        toString: stmtToString
    };
};
var runStmt = function (stmt) { return function (stack) {
    if (stmt.kind == "assignment") {
        var v = exports._eval(stmt.expr)(stack);
        return setMemory(stmt.var)(v)(stack);
    }
    else {
        var v = exports._eval(stmt.expr)(stack);
        console.log(v);
        return stack;
    }
}; };
exports.run = function (program) { return function (stack) {
    if (program.kind == "empty") {
        return stack;
    }
    else {
        var memory = runStmt(program.head)(stack);
        return exports.run(program.tail)(memory);
    }
}; };
//# sourceMappingURL=unit3.js.map