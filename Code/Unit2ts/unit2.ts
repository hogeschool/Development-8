type List<a> = {
  kind: "empty"
} | {
  kind: "cons",
  head: a,
  tail: List<a>
}

let Cons = <a>(x: a, xs: List<a>): List<a> => {
  return {
    kind: "cons",
    head: x,
    tail: xs
  }
}

let Empty = <a>(): List<a> => {
  return { kind: "empty" }
}


let len = <a>(l: List<a>): number => {
  if (l.kind == "empty") {
    return 0
  } else {
    return 1 + len(l.tail)
  }
}

let sum = (l: List<number>): number => {
  if (l.kind == "empty") {
    return 0
  } else {
    return l.head + sum(l.tail)
  }
}

let evens = (l: List<number>): List<number> => {
  if (l.kind == "empty") {
    return Empty<number>()
  } else {
    if (l.head % 2 == 0) {
      return Cons<number>(l.head, evens(l.tail))
    }
    else {
      return evens(l.tail)
    }
  }
}

let concat = <a>(l1: List<a>) => (l2: List<a>): List<a> => {
  if (l1.kind == "empty") {
    return l2
  }
  else {
    return Cons<a>(l1.head, concat(l1.tail)(l2))
  }
}

let listString = <a>(l: List<a>): string => {
  if (l.kind == "empty") {
    return ""
  } else {
    return l.head + " " + (listString(l.tail))
  }
}

interface Tuple<a, b> {
  fst: a,
  snd: b
}

let Tuple = <a, b>(x: a, y: b): Tuple<a, b> => {
  return {
    fst: x,
    snd: y
  }
}

let splitAt = <a>(i: number) => (l: List<a>): Tuple<List<a>, List<a>> => {
  if (l.kind == "empty") {
    throw "I cannot split an empty list"
  }
  else if (i == 0) {
    let leftPart = Cons<a>(l.head, Empty<a>())
    let rightPart = l.tail
    return Tuple<List<a>, List<a>>(leftPart, rightPart)
  }
  else {
    //split 1 [3;4;5;6;7] -> ([3;4];[5;6;7])
    //split 0 [4;5;6;7] -> ([4],[5;6;7])
    let t = splitAt<a>(i - 1)(l.tail)
    let leftPart = t.fst
    let rightPart = t.snd
    return Tuple<List<a>, List<a>>(Cons<a>(l.head, leftPart), rightPart)
  }
} 

//concat [4;5;6] [1;2;3] 
//concat [] [1;2;3] --> [1;2;3]
//concat [6] [1;2;3] --> [6;1;2;3]
//concat [5;6] -> [1;2;3] -> [5;6;1;2;3]
//concat [4;5;6] -> [1;2;3] -> [4;5;6;1;2;3]

let myList = Cons<number>(5, Cons(3, Cons(4, Empty())))
let myListTwice = concat(myList)(myList)
// console.log(listString(myListTwice))
let t = splitAt(3)(myListTwice)
console.log(listString(t.fst))
console.log(listString(t.snd))