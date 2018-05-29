import { List, Tuple, Cons, Empty } from "../Unit2ts/unit2"
import * as Unit2 from "../Unit2ts/unit2"

export type Option<a> = {
  kind: "none"
} | {
  kind: "some",
  value: a
}

export let None = <a>() => { return {kind: "none"} }
export let Some = <a>(v: a) => { return { kind: "some", value: v }}

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