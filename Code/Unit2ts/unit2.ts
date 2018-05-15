import * as Immutable from "immutable"

let head = <a>(l : Immutable.List<a>): a => {
  return l.first()
}

let tail = <a>(l : Immutable.List<a>): Immutable.List<a> => {
  if (l.count() == 0) {
    throw "The given list is empty"
  }
  else {
    return l.takeLast(l.count() - 1).toList()
  }
}

let merge = <a>(l1: Immutable.List<a>) => (l2: Immutable.List<a>): Immutable.List<a> => {
  if (l1.count() == 0 && l2.count() == 0) {
    return Immutable.List<a>()
  }
  else if (l1.count() == 0) {
    return l2
  }
  else if (l2.count() == 0) {
    return l1
  }
  else {
    let x = head(l1)
    let y = head(l2)
    let xs = tail(l1)
    let ys = tail(l2)
    if (x <= y) {
      return Immutable.List<a>([x]).concat(merge(xs)(l2)).toList()
    }
    else {
      return Immutable.List<a>([y]).concat(merge(l1)(ys)).toList()
    }
  }
}

let splitAt = <a>(l : Immutable.List<a>) => (n: number): [Immutable.List<a>,Immutable.List<a>] => {
  if (l.count() == 0) {
    throw "Out of bound"
  }
  else if (n == 0) {
    return [Immutable.List<a>(), l]
  }
  else {
    let x = head(l)
    let xs = tail(l)
    let [xs1,xs2] = splitAt(xs)(n - 1)
    return [Immutable.List<a>([x]).concat(xs1).toList(),xs2]
  }
}

let mergeSort = <a>(l : Immutable.List<a>): Immutable.List<a> => {
  if (l.count() == 1) {
    return l
  } else {
    let middle = Math.floor(l.count() / 2)
    let [left,right] = splitAt(l)(middle)
    let sortedLeft = mergeSort(left)
    let sortedRight = mergeSort(right)
    return merge(sortedLeft)(sortedRight)
  }
}

let filter = <a>(predicate: (_: a) => boolean) => (l: Immutable.List<a>): Immutable.List<a> => {
  if (l.count() == 0) {
    return l
  } else {
    let x = head(l)
    let xs = tail(l)
    if (predicate(x)) {
      return Immutable.List<a>([x]).concat(filter(predicate)(xs)).toList()
    }
    else {
      return filter(predicate)(xs)
    }
  }
}

let quickSort = <a>(l: Immutable.List<a>): Immutable.List<a> => {
  if (l.count() == 0) {
    return l
  }
  else {
    let pivot = head(l)
    let smaller = filter((x: a) => x < pivot)(l)
    let greater = filter((x: a) => x > pivot)(l)
    return (quickSort(smaller)).concat(Immutable.List<a>([pivot])).concat(quickSort(greater)).toList()
  }
}

let l1 = Immutable.List([-5,0,3,15,21])
let l2 = Immutable.List([-15,-6,-3,10,11])
let unsortedList = Immutable.List([0,-15,3,1,6,7,22,-40,9])
console.log(mergeSort(unsortedList))