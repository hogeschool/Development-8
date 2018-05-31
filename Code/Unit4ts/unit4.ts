import { List, Tuple, Cons, Empty } from "../Unit2ts/unit2"
import * as Unit2 from "../Unit2ts/unit2"

export type Option<a> = {
  kind: "none"
} | {
  kind: "some",
  value: a
}

export let None = <a>(): Option<a> => { return {kind: "none"} }
export let Some = <a>(v: a): Option<a> => { return { kind: "some", value: v }}

export let filter = <a>(predicate: (x: a) => boolean) => (l : List<a>): List<a> => {
  if (l.kind == "empty") {
    return l
  }
  else if (predicate(l.head)) {
    return Cons<a>(l.head, filter(predicate)(l.tail))
  }
  else {
    return filter(predicate)(l.tail)
  }
}

export let map = <a, b>(f:(x: a) => b) => (l: List<a>): List<b> => {
  if (l.kind == "empty") {
    return Empty<b>()
  }
  else {
    return Cons<b>(f(l.head), map(f)(l.tail))
  }
}

export let fold = <s, a>(f: (state: s) => (x: a) => s) => (accumulator: s) => (l: List<a>): s => {
  if (l.kind == "empty") {
    return accumulator
  }
  else {
    return fold(f)(f(accumulator)(l.head))(l.tail)
  }
}

let apply = <a, b>(x: a) => (f: (y: a) => b): b => f(x)

let carry = <a, b, c>(f: (x: a, y: b) => c) => (x: a) => (y: b): c => f(x, y)

let uncarry = <a, b, c>(f: (x: a) => (y: b) => c) => (args: Tuple<a, b>): c => f(args.fst)(args.snd)

export let mapFold = <a, b>(f:(x: a) => b) => (l: List<a>): List<b> => {
  return apply<List<b>, List<b>>(fold((l: List<b>) => (x: a) => Cons<b>(f(x), l))(Empty<b>())(l))(Unit2.rev)
}

export let filterFold = <a>(predicate: (x: a) => boolean) => (l : List<a>): List<a> => {
  return apply<List<a>, List<a>>(fold((l: List<a>) => (x: a) => 
    predicate(x) ? Cons<a>(x, l) : l)(Empty<a>())(l))(Unit2.rev)
}

export let map2 =
  <a, b, c>(f: (x: a) => (y: b) => c) =>
           (l1: List<a>) => 
           (l2: List<b>): List<c> => {
  if (l1.length() != l2.length()) {
    throw "The two lists must have the same length"
  }
  else if (l1.kind == "empty" && l2.kind == "empty") {
    return Empty<c>()
  }
  else if (l1.kind == "cons" && l2.kind == "cons") {
    return Cons<c>(f(l1.head)(l2.head), map2(f)(l1.tail)(l2.tail))
  }
  else {
    throw "Cannot happen"
  }
}

export let fold2 = 
  <state, a, b>(f: (state: state) => (x: a) => (y: b) => state) =>
               (init: state) =>
               (l1: List<a>) => 
               (l2: List<b>): state => {
  if (l1.length() != l2.length()) {
    throw "The two lists must have the same length"
  }
  else if (l1.kind == "empty" && l2.kind == "empty") {
    return init
  }
  else if (l1.kind != "empty" && l2.kind != "empty") {
    let accumulator = f(init)(l1.head)(l2.head)
    return fold2(f)(accumulator)(l1.tail)(l2.tail)
  }
  else {
    throw "Cannot happen"
  }
}

export let zip = <a, b>(l1: List<a>) => (l2: List<b>): List<Tuple<a, b>> => {
  if (l1.kind != l2.kind) {
    throw "The two lists must have the same length"
  }
  else if (l1.kind == "empty" && l2.kind == "empty") {
    return Empty<Tuple<a, b>>()
  }
  else if (l1.kind != "empty" && l2.kind != "empty") {
    return Cons<Tuple<a, b>>(Tuple(l1.head, l2.head), zip<a, b>(l1.tail)(l2.tail))
  }
  else {
    throw "Cannot happen"
  }
}

export let zipFold = <a, b>(l1: List<a>) => (l2: List<b>): List<Tuple<a, b>> => {
  if (l1.length() != l2.length()) {
    throw "The two lists must have the same length"
  }
  else {
    return apply<List<Tuple<a, b>>, List<Tuple<a, b>>>
                (fold2((l: List<Tuple<a, b>>) => (x: a) => (y: b) => Cons<Tuple<a, b>>(Tuple(x, y), l))
                (Empty<Tuple<a, b>>())
                (l1)
                (l2))(Unit2.rev)
  }
}

export let map2Safe = <a, b, c>(f: (x: a) => (y: b) => c) =>
                               (l1: List<a>) => 
                               (l2: List<b>): List<Option<c>> => {
  if (l1.kind == "empty" && l2.kind == "empty") {
    return Empty<Option<c>>()
  }
  else if (l1.kind == "empty" && l2.kind != "empty") {
    return map<b, Option<c>>((x: b) => None<c>())(l2)
  }
  else if (l1.kind != "empty" && l2.kind == "empty") {
    return map<a, Option<c>>((x: a) => None<c>())(l1)
  }
  else if (l1.kind != "empty" && l2.kind != "empty") {
    let newHead = Some<c>(f(l1.head)(l2.head))
    return Cons<Option<c>>(newHead, map2Safe(f)(l1.tail)(l2.tail))
  }
  else {
    throw "Cannot happen"
  }
}

export let flatten = <a>(l: List<List<a>>): List<a> => {
  return fold((l1: List<a>) => (x: List<a>): List<a> => Unit2.concat(l1)(x))(Empty<a>())(l)
}