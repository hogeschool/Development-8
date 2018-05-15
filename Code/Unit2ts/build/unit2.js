"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Immutable = __importStar(require("immutable"));
var head = function (l) {
    return l.first();
};
var tail = function (l) {
    if (l.count() == 0) {
        throw "The given list is empty";
    }
    else {
        return l.takeLast(l.count() - 1).toList();
    }
};
var merge = function (l1) { return function (l2) {
    if (l1.count() == 0 && l2.count() == 0) {
        return Immutable.List();
    }
    else if (l1.count() == 0) {
        return l2;
    }
    else if (l2.count() == 0) {
        return l1;
    }
    else {
        var x = head(l1);
        var y = head(l2);
        var xs = tail(l1);
        var ys = tail(l2);
        if (x <= y) {
            return Immutable.List([x]).concat(merge(xs)(l2)).toList();
        }
        else {
            return Immutable.List([y]).concat(merge(l1)(ys)).toList();
        }
    }
}; };
var splitAt = function (l) { return function (n) {
    if (l.count() == 0) {
        throw "Out of bound";
    }
    else if (n == 0) {
        return [Immutable.List(), l];
    }
    else {
        var x = head(l);
        var xs = tail(l);
        var _a = splitAt(xs)(n - 1), xs1 = _a[0], xs2 = _a[1];
        return [Immutable.List([x]).concat(xs1).toList(), xs2];
    }
}; };
var mergeSort = function (l) {
    if (l.count() == 1) {
        return l;
    }
    else {
        var middle = Math.floor(l.count() / 2);
        var _a = splitAt(l)(middle), left = _a[0], right = _a[1];
        var sortedLeft = mergeSort(left);
        var sortedRight = mergeSort(right);
        return merge(sortedLeft)(sortedRight);
    }
};
var filter = function (predicate) { return function (l) {
    if (l.count() == 0) {
        return l;
    }
    else {
        var x = head(l);
        var xs = tail(l);
        if (predicate(x)) {
            return Immutable.List([x]).concat(filter(predicate)(xs)).toList();
        }
        else {
            return filter(predicate)(xs);
        }
    }
}; };
var quickSort = function (l) {
    if (l.count() == 0) {
        return l;
    }
    else {
        var pivot_1 = head(l);
        var smaller = filter(function (x) { return x < pivot_1; })(l);
        var greater = filter(function (x) { return x > pivot_1; })(l);
        return (quickSort(smaller)).concat(Immutable.List([pivot_1])).concat(quickSort(greater)).toList();
    }
};
var l1 = Immutable.List([-5, 0, 3, 15, 21]);
var l2 = Immutable.List([-15, -6, -3, 10, 11]);
var unsortedList = Immutable.List([0, -15, 3, 1, 6, 7, 22, -40, 9]);
console.log(mergeSort(unsortedList));
//# sourceMappingURL=unit2.js.map