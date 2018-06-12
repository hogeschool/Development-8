"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var unit4_1 = require("../Unit4ts/unit4");
var BinaryTree = function (tree) {
    return __assign({}, tree, { tryFind: function (value) {
            return exports.tryFind(value)(this);
        }, insert: function (value) {
            return exports.insert(value)(this);
        }, toString: function () {
            return exports.treeToString(this);
        } });
};
exports.EmptyTree = function () {
    var t = { kind: "empty" };
    return BinaryTree(t);
};
exports.Tree = function (x, left, right) {
    var t = {
        kind: "node",
        value: x,
        left: left,
        right: right
    };
    return BinaryTree(t);
};
//find
exports.tryFind = function (value) { return function (tree) {
    if (tree.kind == "empty") {
        return unit4_1.None();
    }
    else {
        if (value == tree.value) {
            return unit4_1.Some(tree);
        }
        else if (value <= tree.value) {
            return exports.tryFind(value)(BinaryTree(tree.left));
        }
        else {
            return exports.tryFind(value)(BinaryTree(tree.right));
        }
    }
}; };
//insert
exports.insert = function (value) { return function (tree) {
    if (tree.kind == "empty") {
        return exports.Tree(value, exports.EmptyTree(), exports.EmptyTree());
    }
    else {
        if (value <= tree.value) {
            return exports.Tree(tree.value, exports.insert(value)(BinaryTree(tree.left)), BinaryTree(tree.right));
        }
        else {
            return exports.Tree(tree.value, BinaryTree(tree.left), exports.insert(value)(BinaryTree(tree.right)));
        }
    }
}; };
//in-order map
exports.treeMap = function (f) { return function (tree) {
    return exports.inorderFold(function (tree) { return function (x) { return tree.insert(f(x)); }; })(exports.EmptyTree())(tree);
}; };
//in-order fold
exports.inorderFold = function (f) { return function (init) { return function (tree) {
    if (tree.kind == "empty") {
        return init;
    }
    else {
        var leftState = exports.inorderFold(f)(init)(BinaryTree(tree.left));
        var currentState = f(leftState)(tree.value);
        var rightState = exports.inorderFold(f)(currentState)(BinaryTree(tree.right));
        return rightState;
    }
}; }; };
exports.treeToString = function (tree) {
    var ts = exports.inorderFold(function (s) { return function (x) { return s + " " + x; }; })("")(tree);
    return "[" + ts + " ]";
};
exports.NoneOptional = function () {
    return {
        kind: "none",
        map: OptionFunctor().map
    };
};
exports.SomeOptional = function (x) {
    return {
        kind: "some",
        value: x,
        map: OptionFunctor().map
    };
};
var OptionFunctor = function () {
    return {
        map: function (f) {
            if (this.kind == "none") {
                return unit4_1.None();
            }
            else {
                return unit4_1.Some(f(this.value));
            }
        }
    };
};
var ListFunctor = function () {
    return {
        map: function (f) {
            return unit4_1.map(f)(this);
        }
    };
};
exports.ListTypeClass = function (l) {
    return __assign({}, l, { map: ListFunctor().map });
};
var TreeFunctor = function () {
    return {
        map: function (f) {
            return exports.treeMap(f)(this);
        }
    };
};
exports.TreeTypeClass = function (t) {
    return __assign({}, t, { map: TreeFunctor().map });
};
//# sourceMappingURL=unit5.js.map