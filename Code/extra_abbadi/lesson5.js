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
var lesson3_1 = require("./lesson3");
var lesson4_1 = require("./lesson4");
exports.mk_BTMethods = function (tree_data) {
    return __assign({}, tree_data, { insert: function (value) { return insert(this, value); }, tryFind: function (value) { return tryFind(this, value); }, toString: function () { return to_string(this); } });
};
var empty_tree = function () { return exports.mk_BTMethods({ kind: "empty" }); };
var mk_node = function (value) { return exports.mk_BTMethods({
    kind: "node",
    value: value,
    left: empty_tree(),
    right: empty_tree()
}); };
var insert = function (tree, value) {
    if (tree.kind == "empty")
        return mk_node(value);
    if (tree.value < value) {
        return __assign({}, tree, { right: insert(tree.right, value) });
    }
    else {
        return __assign({}, tree, { left: insert(tree.left, value) });
    }
};
var tryFind = function (tree, value) {
    if (tree.kind == "empty")
        return lesson3_1.mk_nothing("found empty tree");
    else if (tree.value == value)
        return lesson3_1.mk_something(value);
    else if (tree.value > value)
        return tryFind(tree.left, value);
    else
        return tryFind(tree.right, value);
};
var to_string = function (tree) {
    if (tree.kind == "empty")
        return "empty";
    else
        return "(" + to_string(tree.left) + "  <-  " + tree.value + "  ->  " + to_string(tree.right) + ")";
};
exports.mk_tree = function (elems) {
    return lesson4_1.fold(elems, function (value, tree) { return tree.insert(value); }, empty_tree());
};
